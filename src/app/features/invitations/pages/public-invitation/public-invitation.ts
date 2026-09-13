import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';

import { getApiErrorMessage } from '../../../../core/utils/api-error.util';
import { Modal } from '../../../../shared/components/modal/modal';
import { InvitationCountdown } from '../../components/invitation-countdown/invitation-countdown';
import { InvitationVenue } from '../../components/invitation-venue/invitation-venue';
import { RsvpFormComponent } from '../../components/rsvp-form/rsvp-form';
import { InvitationService } from '../../services/invitation.service';

@Component({
  selector: 'app-public-invitation-page',
  imports: [DatePipe, InvitationCountdown, InvitationVenue, Modal, RsvpFormComponent],
  templateUrl: './public-invitation.html',
  styleUrl: './public-invitation.css',
})
export class PublicInvitationPage {
  private readonly route = inject(ActivatedRoute);
  private readonly invitationService = inject(InvitationService);

  protected readonly rsvpModalOpen = signal(false);
  protected readonly loadError = signal<string | null>(null);

  private readonly routeData$ = combineLatest([
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    this.route.queryParamMap.pipe(map((params) => params.get('guest')?.trim() || null)),
  ]);

  protected readonly invitation = toSignal(
    this.routeData$.pipe(
      switchMap(([slug]) => {
        this.loadError.set(null);
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

  protected openRsvpModal(): void {
    if (!this.canRsvp()) {
      return;
    }
    this.rsvpModalOpen.set(true);
  }

  protected closeRsvpModal(): void {
    this.rsvpModalOpen.set(false);
  }
}
