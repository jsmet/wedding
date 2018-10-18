
namespace Wedding.Models
{
    public class Rsvp
    {
        public int ID { get; set; }
        public string First { get; set; }
        public string Last { get; set; }
        public bool Attending { get; set; }
        public int NumberOfGuests { get; set; }
    }

    public class ConfirmRsvp
    {
        public int ID { get; set; }
        public bool Attending { get; set; }
        public Guest[] Guests { get; set; }
    }

    public class Guest
    {
        public string First { get; set; }
        public string Last { get; set; }
    }
}

