import { EventStatus } from './event-status';
import { EventType } from './event-type';

export interface EventSummary {
  id: string;
  name: string;
  type: EventType;
  eventDate: Date;
  status: EventStatus;
  coverImage?: string;
  publicSlug?: string;
  totalGuests: number;
  confirmedGuests: number;
}
