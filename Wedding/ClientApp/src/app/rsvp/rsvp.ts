
import { Guests } from './confirmRsvp';

export class RSVP {
  id: number;
  first: string;
  last: string;
  attending: boolean;
  numberOfGuests: number;
  guests: Guests[]
}
