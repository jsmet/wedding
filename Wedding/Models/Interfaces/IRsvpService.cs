using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Wedding.Models;

namespace Services
{
    public interface IRsvpService
    {
        Task<Rsvp> GetRsvp(int rsvpID);
    }
}
