import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import {
  EventGuestsPage,
  Guest,
  GuestFilterOptions,
  GuestListMetrics,
} from '../../../core/models/guest';
import { GuestStatus } from '../../../core/models/guest-status';
import { MOCK_EVENT_NAMES, MOCK_GUESTS } from '../data/mock-guests';

@Injectable({ providedIn: 'root' })
export class GuestService {
  getByEventId(eventId: string): Observable<EventGuestsPage> {
    const guests = MOCK_GUESTS.filter((guest) => guest.eventId === eventId);
    const eventName = MOCK_EVENT_NAMES[eventId] ?? `Evento ${eventId}`;

    const page: EventGuestsPage = {
      eventId,
      eventName,
      guests,
    };

    // Simulates a future HTTP call; replace with HttpClient when API is ready.
    return of(page).pipe(delay(200));
  }

  filterGuests(guests: Guest[], options: GuestFilterOptions = {}): Guest[] {
    const query = options.query?.trim().toLowerCase() ?? '';
    const status = options.status ?? 'ALL';

    return guests.filter((guest) => {
      const matchesStatus = status === 'ALL' || guest.status === status;
      const matchesQuery =
        !query ||
        guest.fullName.toLowerCase().includes(query) ||
        (guest.phone?.toLowerCase().includes(query) ?? false);

      return matchesStatus && matchesQuery;
    });
  }

  computeMetrics(guests: Guest[]): GuestListMetrics {
    const confirmed = guests.filter((g) => g.status === GuestStatus.Confirmed);
    const declined = guests.filter((g) => g.status === GuestStatus.Declined);
    const pending = guests.filter((g) => g.status === GuestStatus.Pending);

    const confirmedPeople = confirmed.reduce(
      (sum, guest) => sum + 1 + guest.companions,
      0,
    );

    return {
      totalGuests: guests.length,
      confirmed: confirmed.length,
      declined: declined.length,
      pending: pending.length,
      confirmedPeople,
    };
  }
}
