using Microsoft.ApplicationInsights;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Wedding.Models;

namespace Wedding.Data
{
    public class RsvpSql
    {
        private string _conn;        

        public RsvpSql(string conn)
        {
            _conn = conn;
        }

        public async Task<Rsvp> GetRsvp(int rsvpId)
        {
            Rsvp result = null;

            try
            {
                using (var conn = new SqlConnection(_conn))
                {
                    using (var cmd = conn.CreateCommand())
                    {
                        string sql = @"
SELECT i.ID, i.[First], i.[Last], i.Attending, i.NumberOfGuests
FROM Invitees i 
WHERE RsvpId = @rsvpID

SELECT g.[First], g.[Last]
FROM Guests g
WHERE InviteeID = (SELECT i.[ID] FROM Invitees i WHERE i.RsvpId = @rsvpID)
";
                        cmd.CommandText = sql;
                        cmd.Parameters.Add(new SqlParameter("@rsvpID", rsvpId));

                        await conn.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                result = new Rsvp()
                                {
                                    ID = reader.GetInt32(reader.GetOrdinal("ID")),
                                    First = reader.GetString(reader.GetOrdinal("First")),
                                    Last = reader.GetString(reader.GetOrdinal("Last")),                                    
                                    NumberOfGuests = reader.GetInt32(reader.GetOrdinal("NumberOfGuests"))
                                };

                                if (!reader.IsDBNull(reader.GetOrdinal("Attending")))
                                {
                                    result.Attending = reader.GetBoolean(reader.GetOrdinal("Attending"));
                                } else
                                {
                                    result.Attending = null;
                                }

                                // We could have another recordset if this person has already RSVP'ed before and is wanting to update their info
                                await reader.NextResultAsync();                                
                                if (reader.HasRows)
                                {
                                    result.Guests = new List<Guest>();
                                    while (await reader.ReadAsync())
                                    {
                                        result.Guests.Add(new Guest()
                                        {
                                            First = reader.GetString(reader.GetOrdinal("First")),
                                            Last = reader.GetString(reader.GetOrdinal("Last"))
                                        });
                                    }
                                }
                                
                            }
                            else
                            {
                                // They failed to enter in a good ID, return empty
                            }
                        }
                    }
                }

                return result;

            } catch (Exception e)
            {
#if !DEBUG
                new TelemetryClient().TrackException(e, new Dictionary<string, string>() { { "RsvpID", rsvpId.ToString() } });
#endif
                return result;
            }
        }

        public async Task<ConfirmRsvpResponse> ConfirmRsvp(ConfirmRsvp request)
        {
            ConfirmRsvpResponse result = new ConfirmRsvpResponse()
            {
                Success = false,
                ErrorMessage = string.Empty
            };

            try
            {
                using (var conn = new SqlConnection(_conn))
                {
                    using (var cmd = conn.CreateCommand())
                    {
                        string sql = @"
SET XACT_ABORT ON 
SET NOCOUNT ON 
BEGIN TRAN 

-- Update their attending status
UPDATE Invitees SET Attending = @attending WHERE [ID] = @inviteeID;

-- They could be updating their RSVP, delete previous guests out
DELETE FROM Guests WHERE InviteeID = @inviteeID;

-- Add their guests
IF ISJSON (@guestsJson) > 0
    INSERT INTO Guests ([First], [Last], InviteeID)
    OUTPUT inserted.ID
    SELECT [First], [Last], @inviteeID
        FROM OPENJSON(@guestsJson)
            WITH (
                [First] NVARCHAR(256),
                [Last] NVARCHAR(256)
            )
ENDIF

SET NOCOUNT OFF 
COMMIT TRAN
";
                        string guestsJson = JsonConvert.SerializeObject(request.Guests);
                        cmd.Parameters.AddWithValue("@guestsJson", guestsJson);
                        cmd.Parameters.AddWithValue("@inviteeID", request.ID);
                        cmd.Parameters.AddWithValue("@attending", request.Attending);

                        cmd.CommandText = sql;                        

                        await conn.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            // We don't care about reading actual results
                            if (await reader.ReadAsync())
                            {
                                result.Success = true;
                            }
                            else
                            {
                                // They failed but why? 
                            }
                        }
                    }
                }

                return result;
            }
            catch (Exception e)
            {
#if !DEBUG
                new TelemetryClient().TrackException(e, 
                    new Dictionary<string, string>() {
                        { "ID", request.ID.ToString() },
                        { "Attending", request.Attending.ToString() },
                        { "GuestCount", request.Guests.Length.ToString() }
                    });
#endif
                return result;
            }            
        }
    }
}
