import { EventType } from './event-type';

export interface CreateEventForm {
  eventType: EventType | '';
  eventName: string;
  honoreeName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  latitude: number | null;
  longitude: number | null;
  placeId: string | null;
  googleMapsUrl: string | null;
  dressCode: string;
  templateId: string;
}

/** Shared form value for create and edit flows. */
export type EventFormValue = CreateEventForm;
