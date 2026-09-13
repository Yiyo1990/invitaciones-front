import { EventType } from './event-type';

export interface CreateEventForm {
  eventType: EventType | '';
  eventName: string;
  honoreeName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  dressCode: string;
  templateId: string;
}

/** Shared form value for create and edit flows. */
export type EventFormValue = CreateEventForm;
