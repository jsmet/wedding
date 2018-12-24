
using System.Collections.Generic;

namespace Wedding.Models
{
    public class Rsvp
    {
        public int RsvpID { get; set; }
        public List<Invitee> Invitees { get; set; }
        public bool? Attending { get; set; }
        public int NumberOfGuests { get; set; }
        public List<Guest> Guests { get; set; }
    }

    public class ConfirmRsvp
    {
        public int RsvpID { get; set; }
        public bool Attending { get; set; }
        public Guest[] Guests { get; set; }
    }

    public class Invitee
    {
        public string First { get; set; }
        public string Last { get; set; }
    }

    public class Guest
    {
        public string First { get; set; }
        public string Last { get; set; }
    }

    public class ConfirmRsvpResponse
    {
        public bool Success { get; set; }
        public string ErrorMessage { get; set; }
    }
}

