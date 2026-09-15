import { CreateEventForm } from '../../../core/models/create-event-form';
import { EventDetail } from '../../../core/models/event-detail';
import { InvitationTemplate } from '../../../core/models/invitation-template';

export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Converts display times like "17:00 hrs" into an HTML time input value. */
export function formatTimeForInput(time?: string): string {
  if (!time) {
    return '';
  }

  const match = time.match(/(\d{1,2}):(\d{2})/);
  if (!match) {
    return '';
  }

  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

export function resolveTemplateId(
  detail: EventDetail,
  templates: InvitationTemplate[],
): string {
  if (detail.templateId) {
    return detail.templateId;
  }

  if (detail.templateName) {
    const byName = templates.find((template) => template.name === detail.templateName);
    if (byName) {
      return byName.id;
    }
  }

  return '';
}

export function mapEventDetailToFormValue(
  detail: EventDetail,
  templates: InvitationTemplate[] = [],
): CreateEventForm {
  return {
    eventType: detail.type,
    eventName: detail.name,
    honoreeName: detail.honoreeName ?? '',
    eventDate: formatDateForInput(detail.eventDate),
    eventTime: formatTimeForInput(detail.time),
    venueName: detail.venue ?? '',
    venueAddress: detail.address ?? '',
    latitude: detail.latitude ?? null,
    longitude: detail.longitude ?? null,
    placeId: detail.placeId ?? null,
    googleMapsUrl: detail.googleMapsUrl ?? null,
    dressCode: detail.dressCode ?? '',
    templateId: resolveTemplateId(detail, templates),
  };
}
