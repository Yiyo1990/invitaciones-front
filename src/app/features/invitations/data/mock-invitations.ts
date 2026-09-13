import { InvitationPublicData } from '../../../core/models/invitation-public-data';

export const MOCK_INVITATIONS: Record<string, InvitationPublicData> = {
  'sofia-carlos': {
    slug: 'sofia-carlos',
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    names: 'Sofía & Carlos',
    headline: '¡Nos casamos!',
    eventDate: new Date('2026-12-12T17:00:00'),
    welcomeMessage:
      'Con inmensa alegría queremos compartir contigo este momento tan especial. Tu presencia hará de nuestro día algo aún más memorable.',
    ceremony: {
      name: 'Parroquia San Francisco de Asís',
      time: '17:00 hrs',
      address: 'Av. Reforma 500, Col. Centro, Ciudad de México',
      mapsUrl: 'https://maps.google.com/?q=Parroquia+San+Francisco+Asis+CDMX',
    },
    reception: {
      name: 'Hacienda Los Olivos',
      time: '19:30 hrs',
      address: 'Carretera México-Toluca Km 32, Ocoyoacac, Edo. de Méx.',
      mapsUrl: 'https://maps.google.com/?q=Hacienda+Los+Olivos+Ocoyoacac',
    },
    dressCode: 'Formal',
    galleryImages: [
      'https://images.unsplash.com/photo-1606216794074-735e1aa682e8?w=600&q=80',
      'https://images.unsplash.com/photo-1522673607200-1639adae42d2?w=600&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451c517d7f?w=600&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    ],
    giftRegistry: [
      { name: 'Liverpool', url: 'https://www.liverpool.com.mx' },
      { name: 'Amazon', url: 'https://www.amazon.com.mx' },
    ],
    rsvpUrl: '#rsvp',
    footerMessage: 'Gracias por acompañarnos en este momento tan especial.',
  },
  'boda-ana-carlos': {
    slug: 'boda-ana-carlos',
    heroImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
    names: 'Ana & Carlos',
    headline: '¡Nos casamos!',
    eventDate: new Date('2026-11-15T16:00:00'),
    welcomeMessage:
      'Sería un honor contar con tu presencia en el día más importante de nuestras vidas. ¡Te esperamos!',
    ceremony: {
      name: 'Catedral Metropolitana',
      time: '16:00 hrs',
      address: 'Plaza de la Constitución S/N, Centro Histórico, CDMX',
      mapsUrl: 'https://maps.google.com/?q=Catedral+Metropolitana+CDMX',
    },
    reception: {
      name: 'Salón Las Palmas',
      time: '18:30 hrs',
      address: 'Av. Insurgentes Sur 1458, Col. Actipan, CDMX',
      mapsUrl: 'https://maps.google.com/?q=Salon+Las+Palmas+CDMX',
    },
    dressCode: 'Etiqueta',
    galleryImages: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
      'https://images.unsplash.com/photo-1522673607200-1639adae42d2?w=600&q=80',
      'https://images.unsplash.com/photo-1606216794074-735e1aa682e8?w=600&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
    ],
    giftRegistry: [
      { name: 'Liverpool', url: 'https://www.liverpool.com.mx' },
      { name: 'Amazon', url: 'https://www.amazon.com.mx' },
    ],
    rsvpUrl: '#rsvp',
    footerMessage: 'Gracias por acompañarnos en este momento tan especial.',
  },
};
