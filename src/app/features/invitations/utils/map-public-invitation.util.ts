import { PublicInvitationApiResponse } from '../../../core/models/event-api';
import { buildGoogleMapsUrl } from '../../../core/models/event-location';
import { EVENT_TYPE_LABELS } from '../../../core/models/event-type';
import { InvitationPublicData } from '../../../core/models/invitation-public-data';
import {
  DEFAULT_INVITATION_PRIMARY_COLOR,
  DEFAULT_INVITATION_SECONDARY_COLOR,
  resolveInvitationColor,
} from '../../../core/utils/invitation-style.util';

const FALLBACK_HERO_IMAGE =
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80';

/** Maps Nest `GET /public/events/:slug` into the public invitation view model. */
export function mapPublicInvitation(api: PublicInvitationApiResponse): InvitationPublicData {
  const locationParts = [
    api.event.venueName,
    api.event.address,
    api.event.city,
    api.event.state,
    api.event.country,
  ].filter((part): part is string => !!part && part.trim().length > 0);

  const address = locationParts.join(', ') || 'Ubicación por confirmar';
  const timeLabel = api.event.eventTime ? `${api.event.eventTime} hrs` : '';
  const mapsUrl =
    api.event.googleMapsUrl?.trim() ||
    buildGoogleMapsUrl({
      latitude: api.event.latitude,
      longitude: api.event.longitude,
      placeId: api.event.placeId,
      address: api.event.address || address,
    }) ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const venueBlock = {
    name: api.event.venueName || 'Ubicación',
    time: timeLabel || 'Por confirmar',
    address,
    mapsUrl,
  };

  const names =
    api.invitation.title?.trim() ||
    api.event.name ||
    EVENT_TYPE_LABELS[api.event.eventType] ||
    'Invitación';

  const welcomeFromInvitation = api.invitation.welcomeMessage?.trim() || '';
  const welcomeFallback = api.event.description?.trim() || '';
  const coverImageUrl = api.invitation.coverImageUrl?.trim() || '';
  const backgroundImageUrl = api.invitation.backgroundImageUrl?.trim() || '';
  const rawPrimary = api.invitation.primaryColor?.trim() || '';
  const rawSecondary = api.invitation.secondaryColor?.trim() || '';
  const invitationPrimaryColor = /^#[0-9A-Fa-f]{6}$/.test(rawPrimary) ? rawPrimary : null;
  const invitationSecondaryColor = /^#[0-9A-Fa-f]{6}$/.test(rawSecondary)
    ? rawSecondary
    : null;

  return {
    slug: api.slug,
    eventType: api.event.eventType,
    templateId: api.invitation.templateId,
    heroImage: coverImageUrl || backgroundImageUrl || FALLBACK_HERO_IMAGE,
    names,
    headline:
      api.invitation.subtitle?.trim() ||
      EVENT_TYPE_LABELS[api.event.eventType] ||
      'Te invitamos',
    eventDate: new Date(api.event.eventDate),
    welcomeMessage: welcomeFromInvitation || welcomeFallback,
    hasWelcomeMessage: welcomeFromInvitation.length > 0 || welcomeFallback.length > 0,
    ceremony: venueBlock,
    reception: venueBlock,
    dressCode: api.event.dressCode?.trim() || 'Por confirmar',
    galleryImages: coverImageUrl ? [coverImageUrl] : [],
    giftRegistry: [],
    footerMessage: 'Gracias por acompañarnos en este momento especial.',
    primaryColor: resolveInvitationColor(
      api.invitation.primaryColor,
      DEFAULT_INVITATION_PRIMARY_COLOR,
    ),
    secondaryColor: resolveInvitationColor(
      api.invitation.secondaryColor,
      DEFAULT_INVITATION_SECONDARY_COLOR,
    ),
    invitationPrimaryColor,
    invitationSecondaryColor,
    backgroundImageUrl: backgroundImageUrl || undefined,
    coverImageUrl: coverImageUrl || undefined,
    musicUrl: api.invitation.musicUrl?.trim() || undefined,
  };
}
