import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import { EVENT_TYPE_LABELS } from '../../../../core/models/event-type';
import { InvitationPublicData } from '../../../../core/models/invitation-public-data';

const TEMPLATE_PRIMARY = '#1E88E5';
const TEMPLATE_SECONDARY = '#FF9800';
const TEMPLATE_SKY = '#87CEFA';
const DEFAULT_TAGLINE = '¡Ven a vivir una gran aventura!';
const DEFAULT_CLOSING = '¡No faltes, será muy especial!';

@Component({
  selector: 'app-birthday-adventure',
  imports: [],
  templateUrl: './birthday-adventure.html',
  styleUrl: './birthday-adventure.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirthdayAdventure {
  readonly data = input.required<InvitationPublicData>();
  readonly canRsvp = input(true);

  readonly rsvpRequested = output<void>();

  protected readonly closingMessage = DEFAULT_CLOSING;

  protected readonly themeStyles = computed(() => {
    const invitation = this.data();
    const primary = invitation.invitationPrimaryColor ?? TEMPLATE_PRIMARY;
    const secondary = invitation.invitationSecondaryColor ?? TEMPLATE_SECONDARY;
    return {
      '--birthday-primary': primary,
      '--birthday-secondary': secondary,
      '--birthday-sky': TEMPLATE_SKY,
      '--birthday-orange': '#FF9800',
      '--birthday-yellow': '#FFD54F',
      '--birthday-pink': '#FF5C7A',
      '--birthday-purple': '#7E57C2',
      '--birthday-teal': '#4DD0B0',
      '--birthday-text': '#1A3A6B',
    };
  });

  /** Festejado: subtitle/headline, descripción, o título limpio. */
  protected readonly honoreeName = computed(() => {
    const invitation = this.data();
    const typeLabel = EVENT_TYPE_LABELS[invitation.eventType]?.toLowerCase() ?? '';

    const headline = invitation.headline?.trim() ?? '';
    if (headline && headline.toLowerCase() !== typeLabel && !/^te invitamos$/i.test(headline)) {
      return headline;
    }

    const fromDescription = invitation.welcomeMessage.match(/^Festejado\(s\):\s*(.+)$/i);
    if (fromDescription?.[1]?.trim()) {
      return fromDescription[1].trim();
    }

    const cleaned = invitation.names
      .replace(/^(cumpleaños|cumple(?:años)?\s+de|fiesta\s+de)\s+/i, '')
      .trim();
    return cleaned || invitation.names;
  });

  protected readonly adventureMessage = computed(() => {
    const invitation = this.data();
    if (!invitation.hasWelcomeMessage) {
      return DEFAULT_TAGLINE;
    }
    if (/^Festejado\(s\):/i.test(invitation.welcomeMessage.trim())) {
      return DEFAULT_TAGLINE;
    }
    return invitation.welcomeMessage;
  });

  protected readonly dateLabel = computed(() => {
    const date = this.data().eventDate;
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return null;
    }
    const weekday = new Intl.DateTimeFormat('es-MX', { weekday: 'long' }).format(date);
    const day = new Intl.DateTimeFormat('es-MX', { day: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('es-MX', { month: 'long' }).format(date);
    return `${weekday} ${day} de ${month}`.toUpperCase();
  });

  protected readonly timeLabel = computed(() => {
    const time = this.data().ceremony.time?.trim() ?? '';
    if (!time || time === 'Por confirmar') {
      return null;
    }
    return time;
  });

  protected readonly venueName = computed(() => {
    const name = this.data().ceremony.name?.trim() ?? '';
    if (!name || name === 'Ubicación') {
      return null;
    }
    return name;
  });

  protected readonly venueAddress = computed(() => {
    const address = this.data().ceremony.address?.trim() ?? '';
    if (!address || address === 'Ubicación por confirmar') {
      return null;
    }
    return address;
  });

  protected readonly hasVenueBlock = computed(
    () => !!this.dateLabel() || !!this.timeLabel() || !!this.venueName() || !!this.venueAddress(),
  );

  protected readonly mapsUrl = computed(() => this.data().ceremony.mapsUrl);

  protected readonly coverImage = computed(() => this.data().coverImageUrl ?? null);

  protected readonly hasBackgroundImage = computed(() => !!this.data().backgroundImageUrl);

  protected requestRsvp(): void {
    if (!this.canRsvp()) {
      return;
    }
    this.rsvpRequested.emit();
  }
}
