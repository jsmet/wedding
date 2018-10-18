
using Microsoft.ApplicationInsights;
using System.Collections.Generic;
using System.Threading.Tasks;
using Wedding.Data;
using Wedding.Models;

namespace Services
{
    public class RsvpService : IRsvpService
    {
        private RsvpSql _data;
        private static TelemetryClient _telemetryClient = new TelemetryClient();

        public RsvpService(RsvpSql data)
        {
            _data = data;   
        }

        public async Task<Rsvp> GetRsvp(int rsvpId)
        {            
            if (rsvpId.ToString().Length == 5)
            {
                return await _data.GetRsvp(rsvpId);
            }
            else
            {
                _telemetryClient.TrackEvent("InvalidIDAtServiceLayer", new Dictionary<string, string>() { { "RsvpID", rsvpId.ToString() } });
                return null;
            }
        }
    }
}
