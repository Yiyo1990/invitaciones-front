import { DatePipe } from '@angular/common';
import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';

import { getApiErrorMessage } from '../../../../core/utils/api-error.util';
import { Modal } from '../../../../shared/components/modal/modal';
import { InvitationCountdown } from '../../components/invitation-countdown/invitation-countdown';
import { InvitationVenue } from '../../components/invitation-venue/invitation-venue';
import { RsvpFormComponent } from '../../components/rsvp-form/rsvp-form';
import { InvitationService } from '../../services/invitation.service';
import { WeddingEternalGarden } from '../../templates/wedding-eternal-garden/wedding-eternal-garden';
import { BirthdayAdventure } from '../../templates/birthday-adventure/birthday-adventure';
import { resolveInvitationRenderer } from '../../utils/invitation-renderer.registry';

@Component({
  selector: 'app-public-invitation-page',
  imports: [
    DatePipe,
    InvitationCountdown,
    InvitationVenue,
    Modal,
    RsvpFormComponent,
    WeddingEternalGarden,
    BirthdayAdventure,
  ],
  templateUrl: './public-invitation.html',
  styleUrl: './public-invitation.css',
})
export class PublicInvitationPage {
  private readonly route = inject(ActivatedRoute);
  private readonly invitationService = inject(InvitationService);

  private readonly musicAudio = viewChild<ElementRef<HTMLAudioElement>>('musicAudio');

  protected readonly rsvpModalOpen = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly musicPlaying = signal(false);

  private readonly routeData$ = combineLatest([
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    this.route.queryParamMap.pipe(map((params) => params.get('guest')?.trim() || null)),
  ]);

  protected readonly invitation = toSignal(
    this.routeData$.pipe(
      switchMap(([slug]) => {
        this.loadError.set(null);
        this.musicPlaying.set(false);
        if (!slug) {
          return of(null);
        }

        return this.invitationService.getBySlug(slug).pipe(
          catchError((error: unknown) => {
            this.loadError.set(
              getApiErrorMessage(error) || 'No se pudo cargar la invitación.',
            );
            return of(null);
          }),
        );
      }),
    ),
  );

  protected readonly guestCode = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('guest')?.trim() || null)),
    { initialValue: null },
  );

  protected readonly canRsvp = computed(() => !!this.guestCode());

  protected readonly pageState = computed(() => {
    const data = this.invitation();
    if (data === undefined) {
      return 'LOADING' as const;
    }
    if (data === null) {
      return this.loadError() ? ('ERROR' as const) : ('NOT_FOUND' as const);
    }
    return 'READY' as const;
  });

  /** Template-based renderer key; unknown templates fall back to generic. */
  protected readonly rendererKey = computed(() =>
    resolveInvitationRenderer(this.invitation()?.templateId),
  );

  protected readonly themeStyles = computed(() => {
    const data = this.invitation();
    if (!data) {
      return {};
    }
    return {
      '--invitation-primary': data.primaryColor,
      '--invitation-secondary': data.secondaryColor,
    };
  });

  protected openRsvpModal(): void {
    if (!this.canRsvp()) {
      return;
    }
    this.rsvpModalOpen.set(true);
  }

  protected closeRsvpModal(): void {
    this.rsvpModalOpen.set(false);
  }

  protected async toggleMusic(): Promise<void> {
    const audio = this.musicAudio()?.nativeElement;
    if (!audio) {
      return;
    }

    try {
      if (audio.paused) {
        await audio.play();
        this.musicPlaying.set(true);
      } else {
        audio.pause();
        this.musicPlaying.set(false);
      }
    } catch {
      this.musicPlaying.set(false);
    }
  }

  protected onMusicEnded(): void {
    this.musicPlaying.set(false);
  }
}
