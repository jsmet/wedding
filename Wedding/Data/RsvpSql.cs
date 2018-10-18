using Microsoft.ApplicationInsights;
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
WHERE RsvpId = @rsvpID";
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
                                    Attending = reader.GetBoolean(reader.GetOrdinal("Attending")),
                                    NumberOfGuests = reader.GetInt32(reader.GetOrdinal("NumberOfGuests"))
                                };
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
                new TelemetryClient().TrackException(e, new Dictionary<string, string>() { { "RsvpID", rsvpId.ToString() } });
                return result;
            }
        }
    }
}
