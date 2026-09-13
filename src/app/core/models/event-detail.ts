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
  dressCode?: string;
  honoreeName?: string;
  status: EventStatus;
  slug?: string;
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
