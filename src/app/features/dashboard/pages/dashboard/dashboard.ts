import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';

import { EventSummary } from '../../../../core/models/event-summary';
import { getApiErrorMessage } from '../../../../core/utils/api-error.util';
import { EventCard } from '../../../../shared/components/event-card/event-card';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { DashboardMetrics } from '../../../events/services/event.service';
import { DashboardService } from '../../services/dashboard.service';

interface DashboardLoadState {
  events: EventSummary[];
  metrics: DashboardMetrics;
  error: string | null;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, StatCard, EventCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardPage {
  private readonly dashboardService = inject(DashboardService);
  private readonly reloadToken = signal(0);

  private readonly loadState = toSignal(
    toObservable(this.reloadToken).pipe(
      switchMap(() =>
        this.dashboardService.getOverview().pipe(
          map(
            (overview): DashboardLoadState => ({
              events: overview.events,
              metrics: overview.metrics,
              error: null,
            }),
          ),
          catchError((error: unknown) =>
            of({
              events: [] as EventSummary[],
              metrics: {
                activeEvents: 0,
                totalGuests: 0,
                confirmedGuests: 0,
                pendingGuests: 0,
              },
              error: getApiErrorMessage(error) || 'No se pudo cargar el dashboard.',
            } satisfies DashboardLoadState),
          ),
        ),
      ),
    ),
  );

  protected readonly loading = computed(() => this.loadState() === undefined);
  protected readonly events = computed(() => this.loadState()?.events ?? []);
  protected readonly metrics = computed(
    () =>
      this.loadState()?.metrics ?? {
        activeEvents: 0,
        totalGuests: 0,
        confirmedGuests: 0,
        pendingGuests: 0,
      },
  );
  protected readonly errorMessage = computed(() => this.loadState()?.error ?? null);

  protected retry(): void {
    this.reloadToken.update((value) => value + 1);
  }
}
