import { EventDetail } from '../../../core/models/event-detail';
import { EventStatus } from '../../../core/models/event-status';
import { EventType } from '../../../core/models/event-type';
import { MOCK_EVENTS } from './mock-events';
import { MOCK_TEMPLATES } from './mock-templates';

function templateById(id: string) {
  const template = MOCK_TEMPLATES.find((item) => item.id === id);
  if (!template) {
    throw new Error(`Missing mock template: ${id}`);
  }
  return template;
}

const DETAIL_EXTRAS: Record<
  string,
  Pick<
    EventDetail,
    | 'time'
    | 'venue'
    | 'address'
    | 'dressCode'
    | 'honoreeName'
    | 'templateId'
    | 'templateName'
    | 'templatePreview'
    | 'declinedGuests'
    | 'pendingGuests'
    | 'confirmedPeople'
  >
> = {
  '1': {
    time: '17:00 hrs',
    venue: 'Hacienda Los Olivos',
    address: 'Carretera México-Toluca Km 32, Ocoyoacac, Edo. de Méx.',
    dressCode: 'Formal',
    honoreeName: 'Sofía & Carlos',
    templateId: templateById('wedding-classic').id,
    templateName: templateById('wedding-classic').name,
    templatePreview: templateById('wedding-classic').previewImage,
    declinedGuests: 10,
    pendingGuests: 23,
    confirmedPeople: 102,
  },
  '2': {
    time: '16:00 hrs',
    venue: 'Salón Fiesta Kids',
    address: 'Av. Insurgentes Sur 890, CDMX',
    dressCode: 'Casual',
    honoreeName: 'Mateo',
    templateId: templateById('birthday-kids').id,
    templateName: templateById('birthday-kids').name,
    templatePreview: templateById('birthday-kids').previewImage,
    declinedGuests: 0,
    pendingGuests: 45,
    confirmedPeople: 0,
  },
  '3': {
    time: '12:00 hrs',
    venue: 'Jardín Las Flores',
    address: 'Calle Primavera 45, Guadalajara, Jal.',
    dressCode: 'Semi-formal',
    honoreeName: 'Emma',
    templateId: templateById('baby-shower-soft').id,
    templateName: templateById('baby-shower-soft').name,
    templatePreview: templateById('baby-shower-soft').previewImage,
    declinedGuests: 2,
    pendingGuests: 6,
    confirmedPeople: 28,
  },
  '4': {
    time: '19:00 hrs',
    venue: 'Auditorio Universidad',
    address: 'Campus Norte, Monterrey, N.L.',
    dressCode: 'Etiqueta',
    honoreeName: 'Generación 2026',
    templateId: templateById('graduation-modern').id,
    templateName: templateById('graduation-modern').name,
    templatePreview: templateById('graduation-modern').previewImage,
    declinedGuests: 3,
    pendingGuests: 5,
    confirmedPeople: 78,
  },
};

export const MOCK_EVENT_DETAILS: EventDetail[] = MOCK_EVENTS.map((summary) => {
  const extras = DETAIL_EXTRAS[summary.id] ?? {
    declinedGuests: 0,
    pendingGuests: Math.max(summary.totalGuests - summary.confirmedGuests, 0),
    confirmedPeople: summary.confirmedGuests,
  };

  return {
    id: summary.id,
    name: summary.name,
    type: summary.type,
    eventDate: summary.eventDate,
    status: summary.status,
    slug: summary.publicSlug,
    coverImage: summary.coverImage,
    totalGuests: summary.totalGuests,
    confirmedGuests: summary.confirmedGuests,
    ...extras,
  };
});

const quinceRose = templateById('quince-rose');

/** Fallback detail for unknown ids (e.g. /events/123) so the page remains usable in demos. */
export const MOCK_FALLBACK_EVENT_DETAIL: EventDetail = {
  id: '123',
  name: 'XV años de Valeria',
  type: EventType.Quinceanera,
  eventDate: new Date('2026-11-15'),
  time: '20:00 hrs',
  venue: 'Quinta Las Palmas',
  address: 'Monterrey, Nuevo León',
  dressCode: 'Formal',
  honoreeName: 'Valeria',
  status: EventStatus.Published,
  slug: 'valeria-xv',
  coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
  templateId: quinceRose.id,
  templateName: quinceRose.name,
  templatePreview: quinceRose.previewImage,
  totalGuests: 120,
  confirmedGuests: 85,
  declinedGuests: 10,
  pendingGuests: 25,
  confirmedPeople: 102,
};
