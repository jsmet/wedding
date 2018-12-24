export class ConfirmRsvp {
  rsvpID: number;
  attending: boolean;
  hasGuests: boolean;
  guests: Guests[]  
}

export class Guests {
  first: string;
  last: string;
}
