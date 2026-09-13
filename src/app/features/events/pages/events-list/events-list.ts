import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';

import { EventSummary } from '../../../../core/models/event-summary';
import { getApiErrorMessage } from '../../../../core/utils/api-error.util';
import { EventCard } from '../../../../shared/components/event-card/event-card';
import { EventService } from '../../services/event.service';

interface EventsLoadState {
  events: EventSummary[];
  error: string | null;
}

@Component({
  selector: 'app-events-list-page',
  imports: [RouterLink, EventCard],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
})
export class EventsListPage {
  private readonly eventService = inject(EventService);
  private readonly reloadToken = signal(0);

  private readonly loadState = toSignal(
    toObservable(this.reloadToken).pipe(
      switchMap(() =>
        this.eventService.getSummaries().pipe(
          map(
            (events): EventsLoadState => ({
              events,
              error: null,
            }),
          ),
          catchError((error: unknown) =>
            of({
              events: [] as EventSummary[],
              error: getApiErrorMessage(error) || 'No se pudieron cargar los eventos.',
            } satisfies EventsLoadState),
          ),
        ),
      ),
    ),
  );

  protected readonly loading = computed(() => this.loadState() === undefined);
  protected readonly events = computed(() => this.loadState()?.events ?? []);
  protected readonly errorMessage = computed(() => this.loadState()?.error ?? null);

  protected retry(): void {
    this.reloadToken.update((value) => value + 1);
  }
}
