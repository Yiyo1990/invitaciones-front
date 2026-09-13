import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';

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

  protected readonly invitation = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('slug') ?? ''),
      switchMap((slug) => this.invitationService.getBySlug(slug)),
    ),
  );

  protected openRsvpModal(): void {
    this.rsvpModalOpen.set(true);
  }

  protected closeRsvpModal(): void {
    this.rsvpModalOpen.set(false);
  }
}
