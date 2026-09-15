import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import { InvitationPublicData } from '../../../../core/models/invitation-public-data';
import { getNameInitial, parseCoupleNames } from '../../utils/couple-names.util';

const TEMPLATE_PRIMARY = '#3D4A3A';
const TEMPLATE_SECONDARY = '#A7B89F';
const TEMPLATE_BACKGROUND = '#F4F0E6';
const TEMPLATE_MUTED = '#8B8B7A';
const TEMPLATE_OLIVE = '#6B7F64';
const DEFAULT_QUOTE = 'El amor hace que cada momento sea eterno.';
const DEFAULT_CLOSING = 'Esperamos celebrar contigo';

@Component({
  selector: 'app-wedding-eternal-garden',
  imports: [],
  templateUrl: './wedding-eternal-garden.html',
  styleUrl: './wedding-eternal-garden.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeddingEternalGarden {
  readonly data = input.required<InvitationPublicData>();
  readonly canRsvp = input(false);

  readonly rsvpRequested = output<void>();

  protected readonly quote = DEFAULT_QUOTE;
  protected readonly closingMessage = DEFAULT_CLOSING;

  protected readonly themeStyles = computed(() => {
    const invitation = this.data();
    const primary = invitation.invitationPrimaryColor ?? TEMPLATE_PRIMARY;
    const secondary = invitation.invitationSecondaryColor ?? TEMPLATE_SECONDARY;
    return {
      '--invitation-primary': primary,
      '--invitation-secondary': secondary,
      '--invitation-background': TEMPLATE_BACKGROUND,
      '--invitation-text': TEMPLATE_PRIMARY,
      '--invitation-muted': TEMPLATE_MUTED,
      '--invitation-olive': TEMPLATE_OLIVE,
    };
  });

  protected readonly couple = computed(() => {
    const invitation = this.data();
    const fromHeadline = parseCoupleNames(invitation.headline);
    if (fromHeadline.second) {
      return fromHeadline;
    }

    const stripped = invitation.names.replace(/^(boda|wedding|xv(?:\s+años)?|cumplea(?:ñ|n)os)\s+/i, '');
    const fromStripped = parseCoupleNames(stripped);
    if (fromStripped.second || stripped !== invitation.names) {
      return fromStripped;
    }

    return parseCoupleNames(invitation.names);
  });

  protected readonly initials = computed(() => {
    const { first, second } = this.couple();
    const firstInitial = getNameInitial(first);
    const secondInitial = getNameInitial(second);
    return {
      first: firstInitial,
      second: secondInitial,
      label: [firstInitial, secondInitial].filter(Boolean).join(' | '),
    };
  });

  protected readonly dateParts = computed(() => {
    const date = this.data().eventDate;
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return null;
    }

    const weekday = new Intl.DateTimeFormat('es-MX', { weekday: 'long' }).format(date);
    const month = new Intl.DateTimeFormat('es-MX', { month: 'long' }).format(date);
    const day = new Intl.DateTimeFormat('es-MX', { day: 'numeric' }).format(date);
    const year = new Intl.DateTimeFormat('es-MX', { year: 'numeric' }).format(date);

    return {
      weekday: weekday.toUpperCase(),
      month: month.toUpperCase(),
      day,
      year,
    };
  });

  protected readonly heroSrc = computed(() => {
    const invitation = this.data();
    return invitation.coverImageUrl || invitation.backgroundImageUrl || null;
  });

  protected readonly closingPhotoSrc = computed(() => {
    const invitation = this.data();
    const hero = this.heroSrc();
    const background = invitation.backgroundImageUrl ?? null;
    const galleryExtra = invitation.galleryImages.find((image) => image !== hero) ?? null;

    if (galleryExtra) {
      return galleryExtra;
    }
    if (background && background !== hero) {
      return background;
    }
    return null;
  });

  protected readonly hasVenue = computed(() => {
    const venue = this.data().ceremony;
    const hasName = !!venue.name?.trim() && venue.name.trim() !== 'Ubicación';
    const hasAddress =
      !!venue.address?.trim() && venue.address.trim() !== 'Ubicación por confirmar';
    const hasTime = !!venue.time?.trim() && venue.time.trim() !== 'Por confirmar';
    return hasName || hasAddress || hasTime;
  });

  /** Only show a second venue block when reception differs from ceremony. */
  protected readonly hasDistinctReception = computed(() => {
    const { ceremony, reception } = this.data();
    return (
      ceremony.name !== reception.name ||
      ceremony.address !== reception.address ||
      ceremony.time !== reception.time ||
      ceremony.mapsUrl !== reception.mapsUrl
    );
  });

  protected readonly hasDressCode = computed(() => {
    const code = this.data().dressCode?.trim() ?? '';
    return code.length > 0 && code !== 'Por confirmar';
  });

  protected readonly hasGiftRegistry = computed(() => this.data().giftRegistry.length > 0);

  protected requestRsvp(): void {
    if (!this.canRsvp()) {
      return;
    }
    this.rsvpRequested.emit();
  }
}
