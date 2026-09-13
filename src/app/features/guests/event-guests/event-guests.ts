import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { Guest, GuestStatusFilter } from '../../../core/models/guest';
import { GuestStatus, GUEST_STATUS_LABELS } from '../../../core/models/guest-status';
import { StatCard } from '../../../shared/components/stat-card/stat-card';
import { GuestCard } from '../components/guest-card/guest-card';
import { GuestStatusBadge } from '../components/guest-status-badge/guest-status-badge';
import { GuestService } from '../services/guest.service';

@Component({
  selector: 'app-event-guests',
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    StatCard,
    GuestCard,
    GuestStatusBadge,
  ],
  templateUrl: './event-guests.html',
  styleUrl: './event-guests.css',
})
export class EventGuests {
  private readonly route = inject(ActivatedRoute);
  private readonly guestService = inject(GuestService);

  protected readonly GuestStatus = GuestStatus;
  protected readonly statusLabels = GUEST_STATUS_LABELS;

  protected readonly searchQuery = signal('');
  protected readonly statusFilter = signal<GuestStatusFilter>('ALL');

  private readonly eventId$ = this.route.paramMap.pipe(map((params) => params.get('id') ?? ''));

  protected readonly page = toSignal(
    this.eventId$.pipe(switchMap((eventId) => this.guestService.getByEventId(eventId))),
  );

  protected readonly metrics = computed(() => {
    const guests = this.page()?.guests ?? [];
    return this.guestService.computeMetrics(guests);
  });

  protected readonly filteredGuests = computed(() =>
    this.guestService.filterGuests(this.page()?.guests ?? [], {
      query: this.searchQuery(),
      status: this.statusFilter(),
    }),
  );

  protected onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  protected onStatusFilter(value: string): void {
    this.statusFilter.set(value as GuestStatusFilter);
  }

  protected onAddGuest(): void {
    console.log('Add guest for event:', this.page()?.eventId);
  }

  protected onEditGuest(guest: Guest): void {
    console.log('Edit guest:', guest);
  }

  protected onRemoveGuest(guest: Guest): void {
    console.log('Remove guest:', guest);
  }
}
