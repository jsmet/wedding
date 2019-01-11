
using Microsoft.ApplicationInsights;
using System.Threading.Tasks;
using Wedding.Data;
using Wedding.Models;
using Wedding.Interfaces;

namespace Wedding.Services
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
            if (rsvpId.ToString().Length == 5 || rsvpId.ToString().Length == 6)
            {
                return await _data.GetRsvp(rsvpId);
            }
            else
            {
#if !DEBUG
                _telemetryClient.TrackEvent("InvalidIDAtServiceLayer", new Dictionary<string, string>() { { "RsvpID", rsvpId.ToString() } });
#endif
                return null;
            }
        }

        public async Task<ConfirmRsvpResponse> ConfirmRsvp(ConfirmRsvp request)
        {
            return await _data.ConfirmRsvp(request);
        }
    }
}
