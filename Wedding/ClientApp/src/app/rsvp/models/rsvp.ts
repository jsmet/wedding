
import { Guests } from './confirmRsvp';

export class RSVP {
  id: number;
  invitees: Invitee[];
  attending: boolean;
  numberOfGuests: number;
  guests: Guests[]
}

export class Invitee {
  first: string;
  last: string;
}
