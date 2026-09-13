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
  heroImage: string;
  names: string;
  headline: string;
  eventDate: Date;
  welcomeMessage: string;
  ceremony: VenueInfo;
  reception: VenueInfo;
  dressCode: string;
  galleryImages: string[];
  giftRegistry: GiftRegistryLink[];
  rsvpUrl?: string;
  footerMessage: string;
}
