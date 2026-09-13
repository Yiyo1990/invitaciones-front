import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { EventSummary } from '../../../core/models/event-summary';
import {
  DashboardMetrics,
  EventService,
} from '../../events/services/event.service';

/**
 * Global dashboard data.
 *
 * Backend only exposes `GET /api/events/:eventId/dashboard` (per-event).
 * There is no aggregate `/dashboard` endpoint, so this service uses
 * `GET /api/events` and derives UI metrics from event summaries.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly eventService = inject(EventService);

  getOverview(): Observable<{
    events: EventSummary[];
    metrics: DashboardMetrics;
  }> {
    return this.eventService.getSummaries().pipe(
      map((events) => ({
        events,
        metrics: this.eventService.computeDashboardMetrics(events),
      })),
    );
  }
}
