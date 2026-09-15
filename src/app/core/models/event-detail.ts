import { EventStatus } from './event-status';
import { EventType } from './event-type';

export interface EventDetail {
  id: string;
  name: string;
  type: EventType;
  eventDate: Date;
  time?: string;
  venue?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  placeId?: string | null;
  googleMapsUrl?: string | null;
  dressCode?: string;
  honoreeName?: string;
  status: EventStatus;
  slug?: string;
  invitationIsPublished?: boolean;
  coverImage?: string;
  templateId?: string;
  templateName?: string;
  templatePreview?: string;
  totalGuests: number;
  confirmedGuests: number;
  declinedGuests: number;
  pendingGuests: number;
  confirmedPeople: number;
}
