import { CreateEventForm } from '../models/create-event-form';
import {
  CreateEventRequest,
  EventApiResponse,
  EventDashboardApiResponse,
  InvitationApiResponse,
  UpdateEventRequest,
} from '../models/event-api';
import { EventDetail } from '../models/event-detail';
import { EventSummary } from '../models/event-summary';

export function mapEventApiToSummary(api: EventApiResponse): EventSummary {
  return {
    id: api.id,
    name: api.name,
    type: api.eventType,
    eventDate: new Date(api.eventDate),
    status: api.status,
    publicSlug: api.slug,
    totalGuests: 0,
    confirmedGuests: 0,
  };
}

export function mapEventApiToDetail(
  api: EventApiResponse,
  options: {
    invitation?: InvitationApiResponse | null;
    dashboard?: EventDashboardApiResponse | null;
    templateName?: string;
    templatePreview?: string;
  } = {},
): EventDetail {
  const guests = options.dashboard?.guests;

  return {
    id: api.id,
    name: api.name,
    type: api.eventType,
    eventDate: new Date(api.eventDate),
    time: api.eventTime ?? undefined,
    venue: api.venueName ?? undefined,
    address: api.address ?? undefined,
    latitude: api.latitude ?? null,
    longitude: api.longitude ?? null,
    placeId: api.placeId ?? null,
    googleMapsUrl: api.googleMapsUrl ?? null,
    dressCode: api.dressCode ?? undefined,
    status: api.status,
    slug: api.slug,
    invitationIsPublished:
      options.invitation?.isPublished ??
      options.dashboard?.invitation?.isPublished ??
      false,
    coverImage: options.invitation?.coverImageUrl ?? undefined,
    templateId: options.invitation?.templateId ?? undefined,
    templateName: options.templateName,
    templatePreview: options.templatePreview ?? options.invitation?.coverImageUrl ?? undefined,
    totalGuests: guests?.total ?? 0,
    confirmedGuests: guests?.confirmed ?? 0,
    declinedGuests: guests?.declined ?? 0,
    pendingGuests: guests?.pending ?? 0,
    confirmedPeople: guests?.confirmedAttendees ?? 0,
  };
}

export function mapFormToCreateEventRequest(form: CreateEventForm): CreateEventRequest {
  const request: CreateEventRequest = {
    name: form.eventName.trim(),
    eventType: form.eventType as CreateEventRequest['eventType'],
    eventDate: toIsoDateString(form.eventDate),
  };

  if (form.eventTime) {
    request.eventTime = form.eventTime;
  }
  if (form.venueName.trim()) {
    request.venueName = form.venueName.trim();
  }
  if (form.venueAddress.trim()) {
    request.address = form.venueAddress.trim();
  }
  if (form.dressCode.trim()) {
    request.dressCode = form.dressCode.trim();
  }
  if (form.honoreeName.trim()) {
    request.description = `Festejado(s): ${form.honoreeName.trim()}`;
  }
  if (form.latitude != null) {
    request.latitude = form.latitude;
  }
  if (form.longitude != null) {
    request.longitude = form.longitude;
  }
  if (form.placeId?.trim()) {
    request.placeId = form.placeId.trim();
  }
  if (form.googleMapsUrl?.trim()) {
    request.googleMapsUrl = form.googleMapsUrl.trim();
  }

  return request;
}

export function mapFormToUpdateEventRequest(form: CreateEventForm): UpdateEventRequest {
  return {
    name: form.eventName.trim(),
    eventType: form.eventType as UpdateEventRequest['eventType'],
    eventDate: toIsoDateString(form.eventDate),
    eventTime: form.eventTime || null,
    venueName: form.venueName.trim() || null,
    address: form.venueAddress.trim() || null,
    dressCode: form.dressCode.trim() || null,
    description: form.honoreeName.trim()
      ? `Festejado(s): ${form.honoreeName.trim()}`
      : null,
    latitude: form.latitude ?? null,
    longitude: form.longitude ?? null,
    placeId: form.placeId?.trim() || null,
    googleMapsUrl: form.googleMapsUrl?.trim() || null,
  };
}

export function extractHonoreeFromDescription(description: string | null | undefined): string {
  if (!description) {
    return '';
  }
  const match = description.match(/^Festejado\(s\):\s*(.+)$/i);
  return match?.[1]?.trim() ?? '';
}

function toIsoDateString(dateInput: string): string {
  // HTML date input yields YYYY-MM-DD; backend expects ISO date string.
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return `${dateInput}T00:00:00.000Z`;
  }
  return new Date(dateInput).toISOString();
}
