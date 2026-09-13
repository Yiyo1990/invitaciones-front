import { EventStatus } from '../../../core/models/event-status';
import { EventSummary } from '../../../core/models/event-summary';
import { EventType } from '../../../core/models/event-type';

export const MOCK_EVENTS: EventSummary[] = [
  {
    id: '1',
    name: 'Boda de Ana & Carlos',
    type: EventType.Wedding,
    eventDate: new Date('2026-11-15'),
    status: EventStatus.Published,
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    publicSlug: 'boda-ana-carlos',
    totalGuests: 120,
    confirmedGuests: 87,
  },
  {
    id: '2',
    name: 'Cumpleaños de Sofía',
    type: EventType.Birthday,
    eventDate: new Date('2026-10-05'),
    status: EventStatus.Draft,
    coverImage: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&q=80',
    totalGuests: 45,
    confirmedGuests: 0,
  },
  {
    id: '3',
    name: 'Baby Shower de Laura',
    type: EventType.BabyShower,
    eventDate: new Date('2026-09-28'),
    status: EventStatus.Published,
    coverImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e6?w=800&q=80',
    publicSlug: 'baby-shower-laura',
    totalGuests: 30,
    confirmedGuests: 22,
  },
  {
    id: '4',
    name: 'Graduación Universidad',
    type: EventType.Graduation,
    eventDate: new Date('2026-06-20'),
    status: EventStatus.Finished,
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    publicSlug: 'graduacion-2026',
    totalGuests: 80,
    confirmedGuests: 72,
  },
];

export const MOCK_EVENT_NAMES: Record<string, string> = Object.fromEntries(
  MOCK_EVENTS.map((event) => [event.id, event.name]),
);
