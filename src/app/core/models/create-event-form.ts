import { EventType } from './event-type';

export interface CreateEventForm {
  eventType: EventType | '';
  eventName: string;
  honoreeName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  templateId: string;
}
