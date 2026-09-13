import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { EventGuestsPage, Guest, GuestFilterOptions, GuestListMetrics } from '../../../core/models/guest';
import { GuestStatus } from '../../../core/models/guest-status';

export interface GuestApiResponse {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  guestCode: string;
  maxCompanions: number;
  rsvpStatus: GuestStatus;
  confirmedCompanions: number;
  message: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuestRequest {
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  maxCompanions?: number;
}

export type UpdateGuestRequest = Partial<{
  firstName: string;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  maxCompanions: number;
}>;

@Injectable({ providedIn: 'root' })
export class GuestService {
  private readonly http = inject(HttpClient);

  getByEventId(eventId: string): Observable<EventGuestsPage> {
    return this.http
      .get<GuestApiResponse[]>(`${environment.apiUrl}/events/${eventId}/guests`)
      .pipe(
        map((guests) => ({
          eventId,
          eventName: `Evento`,
          guests: guests.map((guest) => this.mapGuest(guest)),
        })),
        catchError((error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 404) {
            return of({ eventId, eventName: 'Evento', guests: [] });
          }
          throw error;
        }),
      );
  }

  create(eventId: string, body: CreateGuestRequest): Observable<Guest> {
    return this.http
      .post<GuestApiResponse>(`${environment.apiUrl}/events/${eventId}/guests`, body)
      .pipe(map((guest) => this.mapGuest(guest)));
  }

  update(eventId: string, guestId: string, body: UpdateGuestRequest): Observable<Guest> {
    return this.http
      .patch<GuestApiResponse>(`${environment.apiUrl}/events/${eventId}/guests/${guestId}`, body)
      .pipe(map((guest) => this.mapGuest(guest)));
  }

  remove(eventId: string, guestId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/events/${eventId}/guests/${guestId}`);
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

    const confirmedPeople = confirmed.reduce((sum, guest) => sum + 1 + guest.companions, 0);

    return {
      totalGuests: guests.length,
      confirmed: confirmed.length,
      declined: declined.length,
      pending: pending.length,
      confirmedPeople,
    };
  }

  private mapGuest(api: GuestApiResponse): Guest {
    const fullName = [api.firstName, api.lastName].filter(Boolean).join(' ').trim();

    return {
      id: api.id,
      eventId: api.eventId,
      fullName: fullName || api.firstName,
      phone: api.phone ?? undefined,
      status: api.rsvpStatus,
      companions: api.confirmedCompanions || api.maxCompanions,
      confirmedAt: api.respondedAt ? new Date(api.respondedAt) : undefined,
      message: api.message ?? undefined,
    };
  }
}
