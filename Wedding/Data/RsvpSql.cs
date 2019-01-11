
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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
SELECT i.[First], i.[Last], i.Attending, i.NumberOfGuests
FROM Invitee i 
WHERE RsvpId = @rsvpID

SELECT g.[First], g.[Last]
FROM Guest g
WHERE g.RsvpId = @rsvpID
";
                        cmd.CommandText = sql;
                        cmd.Parameters.Add(new SqlParameter("@rsvpID", rsvpId));

                        await conn.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            if (reader.HasRows) {
                                result = new Rsvp() {
                                    RsvpID = rsvpId,
                                    Invitees = new List<Invitee>()
                                };
                                while (await reader.ReadAsync())
                                {
                                    result.NumberOfGuests += reader.GetInt32(reader.GetOrdinal("NumberOfGuests"));

                                    result.Invitees.Add(new Invitee() {
                                        First = reader.GetString(reader.GetOrdinal("First")),
                                        Last = reader.GetString(reader.GetOrdinal("Last"))
                                    });

                                    if (!reader.IsDBNull(reader.GetOrdinal("Attending")))
                                    {
                                        result.Attending = reader.GetBoolean(reader.GetOrdinal("Attending"));
                                    }
                                    else
                                    {
                                        result.Attending = null;
                                    }
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
UPDATE Invitee SET Attending = @attending WHERE RsvpID = @rsvpID;

-- They could be updating their RSVP, delete previous guests out
DELETE FROM Guest WHERE RsvpID = @rsvpID;

-- Add their guests
IF ISJSON (@guestsJson) > 0
    INSERT INTO Guest ([First], [Last], RsvpID)
    OUTPUT inserted.ID
    SELECT [First], [Last], @rsvpID
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
                        cmd.Parameters.AddWithValue("@rsvpID", request.RsvpID);
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
                        { "ID", request.RsvpID.ToString() },
                        { "Attending", request.Attending.ToString() },
                        { "GuestCount", request.Guests.Length.ToString() }
                    });
#endif
                return result;
            }            
        }
    }
}
