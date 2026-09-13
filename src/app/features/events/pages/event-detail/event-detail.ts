import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';

import { EventStatus } from '../../../../core/models/event-status';
import { EVENT_TYPE_LABELS } from '../../../../core/models/event-type';
import { Guest } from '../../../../core/models/guest';
import { EventStatusBadge } from '../../../../shared/components/event-status-badge/event-status-badge';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { GuestStatusBadge } from '../../../guests/components/guest-status-badge/guest-status-badge';
import { GuestService } from '../../../guests/services/guest.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-detail-page',
  imports: [DatePipe, RouterLink, EventStatusBadge, StatCard, GuestStatusBadge],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})
export class EventDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly eventService = inject(EventService);
  private readonly guestService = inject(GuestService);

  protected readonly typeLabels = EVENT_TYPE_LABELS;

  protected readonly linkCopied = signal(false);
  private copyResetTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly eventId$ = this.route.paramMap.pipe(map((params) => params.get('id') ?? ''));

  private readonly detailData = toSignal(
    this.eventId$.pipe(
      switchMap((id) => {
        if (!id) {
          return of({ event: null, guests: [] as Guest[] });
        }

        return forkJoin({
          event: this.eventService.getDetail(id),
          guestsPage: this.guestService.getByEventId(id),
        }).pipe(
          map(({ event, guestsPage }) => ({
            event,
            guests: guestsPage.guests,
          })),
        );
      }),
    ),
  );

  protected readonly loading = computed(() => this.detailData() === undefined);
  protected readonly event = computed(() => this.detailData()?.event ?? null);
  protected readonly guests = computed(() => this.detailData()?.guests ?? []);

  protected readonly recentGuests = computed(() => {
    const guests = [...this.guests()];
    guests.sort((a, b) => {
      const aTime = a.confirmedAt?.getTime() ?? 0;
      const bTime = b.confirmedAt?.getTime() ?? 0;
      return bTime - aTime;
    });
    return guests.slice(0, 5);
  });

  protected readonly publicPath = computed(() => {
    const slug = this.event()?.slug;
    return slug ? `/invitacion/${slug}` : null;
  });

  protected readonly invitationPublished = computed(
    () => this.event()?.status === EventStatus.Published || this.event()?.status === EventStatus.Finished,
  );

  protected peopleCount(guest: Guest): number {
    return 1 + guest.companions;
  }

  protected async copyPublicLink(): Promise<void> {
    const slug = this.event()?.slug;
    if (!slug) {
      return;
    }

    const url = `${window.location.origin}/invitacion/${slug}`;

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    this.linkCopied.set(true);
    if (this.copyResetTimer) {
      clearTimeout(this.copyResetTimer);
    }
    this.copyResetTimer = setTimeout(() => this.linkCopied.set(false), 2500);
  }
}
