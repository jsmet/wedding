
using System.Threading.Tasks;
using Wedding.Models;

namespace Wedding.Interfaces
{
    public interface IRsvpService
    {
        Task<Rsvp> GetRsvp(int rsvpID);
        Task<ConfirmRsvpResponse> ConfirmRsvp(ConfirmRsvp request);
    }
}
