import { EventType } from '../../../core/models/event-type';
import { PublicInvitationApiResponse } from '../../../core/models/event-api';
import { mapPublicInvitation } from './map-public-invitation.util';
import { resolveInvitationRenderer } from './invitation-renderer.registry';

function buildApi(
  overrides: {
    eventType?: EventType;
    templateId?: string | null;
    slug?: string;
    invitation?: Partial<PublicInvitationApiResponse['invitation']>;
    event?: Partial<PublicInvitationApiResponse['event']>;
  } = {},
): PublicInvitationApiResponse {
  return {
    slug: overrides.slug ?? 'evento-demo',
    event: {
      name: 'Evento demo',
      eventType: overrides.eventType ?? EventType.Wedding,
      eventDate: '2026-12-19T00:00:00.000Z',
      eventTime: '18:30',
      timezone: 'America/Monterrey',
      venueName: 'Salón Demo',
      address: 'Calle 1',
      city: 'Monterrey',
      state: 'NL',
      country: 'México',
      latitude: null,
      longitude: null,
      placeId: null,
      googleMapsUrl: null,
      description: 'Descripción del evento',
      dressCode: 'Formal',
      ...overrides.event,
    },
    invitation: {
      title: 'Título',
      subtitle: 'Subtítulo',
      welcomeMessage: 'Bienvenidos',
      templateId: overrides.templateId === undefined ? 'wedding-classic' : overrides.templateId,
      primaryColor: '#C5A059',
      secondaryColor: '#FFFFFF',
      backgroundImageUrl: null,
      coverImageUrl: null,
      musicUrl: null,
      ...overrides.invitation,
    },
  };
}

describe('mapPublicInvitation', () => {
  it('maps WEDDING invitation', () => {
    const data = mapPublicInvitation(
      buildApi({ eventType: EventType.Wedding, templateId: 'wedding-classic' }),
    );
    expect(data.eventType).toBe(EventType.Wedding);
    expect(data.names).toBe('Título');
    expect(data.headline).toBe('Subtítulo');
    expect(data.hasWelcomeMessage).toBeTrue();
  });

  it('maps XV_YEARS invitation', () => {
    const data = mapPublicInvitation(
      buildApi({
        eventType: EventType.Quinceanera,
        templateId: 'quince-elegant',
        slug: 'xv-sofia',
        invitation: { title: 'XV de Sofía', subtitle: 'Mis XV' },
      }),
    );
    expect(data.eventType).toBe(EventType.Quinceanera);
    expect(data.slug).toBe('xv-sofia');
    expect(data.templateId).toBe('quince-elegant');
    expect(data.names).toBe('XV de Sofía');
  });

  it('maps BIRTHDAY invitation', () => {
    const data = mapPublicInvitation(
      buildApi({
        eventType: EventType.Birthday,
        templateId: 'birthday-kids',
        invitation: { title: 'Cumple de Leo', subtitle: null },
      }),
    );
    expect(data.eventType).toBe(EventType.Birthday);
    expect(data.headline).toBe('Cumpleaños');
  });

  it('renders with null personalization fields', () => {
    const data = mapPublicInvitation(
      buildApi({
        eventType: EventType.BabyShower,
        templateId: 'baby-shower-soft',
        invitation: {
          title: null,
          subtitle: null,
          welcomeMessage: null,
          primaryColor: null,
          secondaryColor: null,
          backgroundImageUrl: null,
          coverImageUrl: null,
          musicUrl: null,
        },
        event: {
          description: null,
          dressCode: null,
          venueName: null,
          address: null,
          city: null,
          state: null,
          country: null,
        },
      }),
    );

    expect(data.names).toBe('Evento demo');
    expect(data.heroImage.length).toBeGreaterThan(0);
    expect(data.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(data.secondaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(data.invitationPrimaryColor).toBeNull();
    expect(data.invitationSecondaryColor).toBeNull();
    expect(data.musicUrl).toBeUndefined();
    expect(data.ceremony.address).toBe('Ubicación por confirmar');
  });

  it('falls back to event description when welcomeMessage is null', () => {
    const data = mapPublicInvitation(
      buildApi({
        invitation: { welcomeMessage: null },
        event: { description: 'Festejado(s): Ana' },
      }),
    );
    expect(data.hasWelcomeMessage).toBeTrue();
    expect(data.welcomeMessage).toBe('Festejado(s): Ana');
  });
});

describe('resolveInvitationRenderer', () => {
  it('uses wedding-eternal-garden renderer for Jardín Eterno', () => {
    expect(resolveInvitationRenderer('wedding-eternal-garden')).toBe('wedding-eternal-garden');
  });

  it('uses birthday-adventure renderer for Aventura de Cumpleaños', () => {
    expect(resolveInvitationRenderer('birthday-adventure')).toBe('birthday-adventure');
  });

  it('uses generic for known wedding template', () => {
    expect(resolveInvitationRenderer('wedding-classic')).toBe('generic');
  });

  it('uses generic for XV template', () => {
    expect(resolveInvitationRenderer('quince-elegant')).toBe('generic');
  });

  it('uses generic fallback for unknown or null template', () => {
    expect(resolveInvitationRenderer(null)).toBe('generic');
    expect(resolveInvitationRenderer(undefined)).toBe('generic');
    expect(resolveInvitationRenderer('unknown-template')).toBe('generic');
  });
});
