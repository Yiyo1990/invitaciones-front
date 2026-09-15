import { EventType } from './event-type';

export interface VenueInfo {
  name: string;
  time: string;
  address: string;
  mapsUrl: string;
}

export interface GiftRegistryLink {
  name: string;
  url: string;
}

export interface InvitationPublicData {
  slug: string;
  eventType: EventType;
  templateId: string | null;
  heroImage: string;
  names: string;
  headline: string;
  eventDate: Date;
  welcomeMessage: string;
  /** False when neither invitation welcomeMessage nor event description exist. */
  hasWelcomeMessage: boolean;
  ceremony: VenueInfo;
  reception: VenueInfo;
  dressCode: string;
  galleryImages: string[];
  giftRegistry: GiftRegistryLink[];
  rsvpUrl?: string;
  footerMessage: string;
  primaryColor: string;
  secondaryColor: string;
  /** Raw invitation color before app/template defaults; null when unset. */
  invitationPrimaryColor: string | null;
  /** Raw invitation color before app/template defaults; null when unset. */
  invitationSecondaryColor: string | null;
  backgroundImageUrl?: string;
  coverImageUrl?: string;
  musicUrl?: string;
}
