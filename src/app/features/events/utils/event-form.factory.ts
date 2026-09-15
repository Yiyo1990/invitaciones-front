import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CreateEventForm } from '../../../core/models/create-event-form';

export const EVENT_FORM_STEP_FIELDS: Record<number, (keyof CreateEventForm)[]> = {
  1: ['eventType'],
  2: ['eventName', 'honoreeName', 'eventDate', 'eventTime', 'venueName', 'venueAddress'],
  3: ['templateId'],
  4: [],
};

export function createEventFormGroup(
  fb: FormBuilder,
  initial?: Partial<CreateEventForm>,
): FormGroup {
  return fb.group({
    eventType: [initial?.eventType ?? '', Validators.required],
    eventName: [initial?.eventName ?? '', Validators.required],
    honoreeName: [initial?.honoreeName ?? '', Validators.required],
    eventDate: [initial?.eventDate ?? '', Validators.required],
    eventTime: [initial?.eventTime ?? '', Validators.required],
    venueName: [initial?.venueName ?? '', Validators.required],
    venueAddress: [initial?.venueAddress ?? '', Validators.required],
    latitude: [initial?.latitude ?? null],
    longitude: [initial?.longitude ?? null],
    placeId: [initial?.placeId ?? null],
    googleMapsUrl: [initial?.googleMapsUrl ?? null],
    dressCode: [initial?.dressCode ?? ''],
    templateId: [initial?.templateId ?? '', Validators.required],
  });
}
