import { EventStatus } from './event-status';
import { EventType } from './event-type';

/** Response from `GET/POST/PATCH /api/events` (`EventResponseDto`). */
export interface EventApiResponse {
  id: string;
  name: string;
  eventType: EventType;
  eventDate: string;
  eventTime: string | null;
  timezone: string;
  venueName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  description: string | null;
  dressCode: string | null;
  status: EventStatus;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

/** Body for `POST /api/events` (`CreateEventDto`). */
export interface CreateEventRequest {
  name: string;
  eventType: EventType;
  eventDate: string;
  eventTime?: string;
  timezone?: string;
  venueName?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  description?: string;
  dressCode?: string;
}

/** Body for `PATCH /api/events/:id` (`UpdateEventDto`). */
export type UpdateEventRequest = Partial<{
  name: string;
  eventType: EventType;
  eventDate: string;
  eventTime: string | null;
  timezone: string;
  venueName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  description: string | null;
  dressCode: string | null;
}>;

/** Response from invitation endpoints under `/api/events/:eventId/invitation`. */
export interface InvitationApiResponse {
  id: string;
  eventId: string;
  templateId: string | null;
  title: string | null;
  subtitle: string | null;
  welcomeMessage: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  backgroundImageUrl: string | null;
  coverImageUrl: string | null;
  musicUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvitationRequest {
  templateId?: string;
  title?: string;
  subtitle?: string;
  welcomeMessage?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundImageUrl?: string;
  coverImageUrl?: string;
  musicUrl?: string;
}

export type UpdateInvitationRequest = Partial<{
  templateId: string | null;
  title: string | null;
  subtitle: string | null;
  welcomeMessage: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  backgroundImageUrl: string | null;
  coverImageUrl: string | null;
  musicUrl: string | null;
}>;

/** Response from `GET /api/events/:eventId/dashboard`. */
export interface EventDashboardApiResponse {
  event: {
    id: string;
    name: string;
    eventType: EventType;
    eventDate: string;
    eventTime: string | null;
    status: EventStatus;
    slug: string;
  };
  invitation: {
    hasInvitation: boolean;
    isPublished: boolean;
    publishedAt: string | null;
  };
  guests: {
    total: number;
    pending: number;
    confirmed: number;
    declined: number;
    confirmedCompanions: number;
    confirmedAttendees: number;
    maxCompanions: number;
    potentialAttendees: number;
  };
  response: {
    responded: number;
    responseRate: number;
    confirmationRate: number;
  };
  recentRsvp: Array<{
    guestId: string;
    firstName: string;
    lastName: string | null;
    rsvpStatus: string;
    confirmedCompanions: number;
    respondedAt: string | null;
  }>;
}

/** Public `GET /api/public/events/:slug`. */
export interface PublicInvitationApiResponse {
  slug: string;
  event: {
    name: string;
    eventType: EventType;
    eventDate: string;
    eventTime: string | null;
    timezone: string;
    venueName: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    description: string | null;
    dressCode: string | null;
  };
  invitation: {
    title: string | null;
    subtitle: string | null;
    welcomeMessage: string | null;
    templateId: string | null;
    primaryColor: string | null;
    secondaryColor: string | null;
    backgroundImageUrl: string | null;
    coverImageUrl: string | null;
    musicUrl: string | null;
  };
}
