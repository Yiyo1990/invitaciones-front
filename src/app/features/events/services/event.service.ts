import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { EventDetail } from '../../../core/models/event-detail';
import { EventStatus } from '../../../core/models/event-status';
import { EventSummary } from '../../../core/models/event-summary';
import { MOCK_EVENT_DETAILS, MOCK_FALLBACK_EVENT_DETAIL } from '../data/mock-event-details';
import { MOCK_EVENTS } from '../data/mock-events';

export interface DashboardMetrics {
  activeEvents: number;
  totalGuests: number;
  confirmedGuests: number;
  pendingGuests: number;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  getSummaries(): Observable<EventSummary[]> {
    // Simulates a future HTTP call; replace with HttpClient when API is ready.
    return of(MOCK_EVENTS).pipe(delay(0));
  }

  getById(id: string): Observable<EventSummary | null> {
    const event = MOCK_EVENTS.find((item) => item.id === id) ?? null;
    return of(event).pipe(delay(0));
  }

  getDetail(id: string): Observable<EventDetail | null> {
    if (!id) {
      return of(null);
    }

    const found = MOCK_EVENT_DETAILS.find((item) => item.id === id);
    if (found) {
      return of(found).pipe(delay(150));
    }

    // Demo fallback so routes like /events/123 remain usable with mock data.
    return of({ ...MOCK_FALLBACK_EVENT_DETAIL, id }).pipe(delay(150));
  }

  computeDashboardMetrics(events: EventSummary[]): DashboardMetrics {
    const totalGuests = events.reduce((sum, event) => sum + event.totalGuests, 0);
    const confirmedGuests = events.reduce((sum, event) => sum + event.confirmedGuests, 0);

    return {
      activeEvents: events.filter((event) => event.status === EventStatus.Published).length,
      totalGuests,
      confirmedGuests,
      pendingGuests: totalGuests - confirmedGuests,
    };
  }
}
