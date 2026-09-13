import { DatePipe } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';

import { Guest, GuestStatusFilter } from '../../../../core/models/guest';
import { GuestStatus, GUEST_STATUS_LABELS } from '../../../../core/models/guest-status';
import { getApiErrorMessage } from '../../../../core/utils/api-error.util';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { GuestCard } from '../../components/guest-card/guest-card';
import { GuestStatusBadge } from '../../components/guest-status-badge/guest-status-badge';
import { GuestService } from '../../services/guest.service';

@Component({
  selector: 'app-guest-list-page',
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    StatCard,
    GuestCard,
    GuestStatusBadge,
  ],
  templateUrl: './guest-list.html',
  styleUrl: './guest-list.css',
})
export class GuestListPage {
  private readonly route = inject(ActivatedRoute);
  private readonly guestService = inject(GuestService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly GuestStatus = GuestStatus;
  protected readonly statusLabels = GUEST_STATUS_LABELS;

  protected readonly searchQuery = signal('');
  protected readonly statusFilter = signal<GuestStatusFilter>('ALL');
  protected readonly actionError = signal<string | null>(null);
  private readonly reloadToken = signal(0);

  private readonly eventId$ = this.route.paramMap.pipe(map((params) => params.get('id') ?? ''));

  protected readonly page = toSignal(
    combineLatest([this.eventId$, toObservable(this.reloadToken)]).pipe(
      switchMap(([eventId]) => {
        if (!eventId) {
          return of({ eventId: '', eventName: 'Evento', guests: [] as Guest[] });
        }

        return this.guestService.getByEventId(eventId).pipe(
          catchError((error: unknown) => {
            this.actionError.set(
              getApiErrorMessage(error) || 'No se pudieron cargar los invitados.',
            );
            return of({
              eventId,
              eventName: 'Evento',
              guests: [] as Guest[],
            });
          }),
        );
      }),
    ),
  );

  protected readonly loading = computed(() => this.page() === undefined);
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
    const eventId = this.page()?.eventId;
    if (!eventId) {
      return;
    }

    const firstName = window.prompt('Nombre del invitado');
    if (!firstName?.trim()) {
      return;
    }

    const lastName = window.prompt('Apellido (opcional)') ?? undefined;
    this.actionError.set(null);

    this.guestService
      .create(eventId, {
        firstName: firstName.trim(),
        ...(lastName?.trim() ? { lastName: lastName.trim() } : {}),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.reloadToken.update((value) => value + 1),
        error: (error: unknown) => {
          this.actionError.set(getApiErrorMessage(error) || 'No se pudo agregar el invitado.');
        },
      });
  }

  protected onEditGuest(guest: Guest): void {
    const eventId = this.page()?.eventId;
    if (!eventId) {
      return;
    }

    const firstName = window.prompt(
      'Nombre del invitado',
      guest.fullName.split(' ')[0] ?? guest.fullName,
    );
    if (!firstName?.trim()) {
      return;
    }

    this.actionError.set(null);
    this.guestService
      .update(eventId, guest.id, { firstName: firstName.trim() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.reloadToken.update((value) => value + 1),
        error: (error: unknown) => {
          this.actionError.set(getApiErrorMessage(error) || 'No se pudo actualizar el invitado.');
        },
      });
  }

  protected onRemoveGuest(guest: Guest): void {
    const eventId = this.page()?.eventId;
    if (!eventId) {
      return;
    }

    const confirmed = window.confirm(`¿Eliminar a ${guest.fullName}?`);
    if (!confirmed) {
      return;
    }

    this.actionError.set(null);
    this.guestService
      .remove(eventId, guest.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.reloadToken.update((value) => value + 1),
        error: (error: unknown) => {
          this.actionError.set(getApiErrorMessage(error) || 'No se pudo eliminar el invitado.');
        },
      });
  }
}
