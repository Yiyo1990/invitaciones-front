import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { EVENT_TYPE_LABELS } from '../../../core/models/event-type';
import { PublicInvitationApiResponse } from '../../../core/models/event-api';
import { InvitationPublicData } from '../../../core/models/invitation-public-data';
import { GuestStatus } from '../../../core/models/guest-status';

export interface PublicGuestApiResponse {
  guestCode: string;
  firstName: string;
  lastName: string | null;
  maxCompanions: number;
  rsvpStatus: GuestStatus;
  confirmedCompanions: number;
  message: string | null;
  respondedAt: string | null;
}

export interface RespondRsvpRequest {
  status: 'CONFIRMED' | 'DECLINED';
  confirmedCompanions?: number;
  message?: string | null;
}

@Injectable({ providedIn: 'root' })
export class InvitationService {
  private readonly http = inject(HttpClient);

  getBySlug(slug: string): Observable<InvitationPublicData | null> {
    return this.http
      .get<PublicInvitationApiResponse>(`${environment.apiUrl}/public/events/${slug}`)
      .pipe(
        map((response) => this.mapPublicInvitation(response)),
        catchError((error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 404) {
            return of(null);
          }
          throw error;
        }),
      );
  }

  getGuestByCode(guestCode: string): Observable<PublicGuestApiResponse | null> {
    return this.http
      .get<PublicGuestApiResponse>(`${environment.apiUrl}/public/guests/${guestCode}`)
      .pipe(
        catchError((error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 404) {
            return of(null);
          }
          throw error;
        }),
      );
  }

  submitRsvp(guestCode: string, body: RespondRsvpRequest): Observable<PublicGuestApiResponse> {
    return this.http.patch<PublicGuestApiResponse>(
      `${environment.apiUrl}/public/guests/${guestCode}/rsvp`,
      body,
    );
  }

  private mapPublicInvitation(api: PublicInvitationApiResponse): InvitationPublicData {
    const locationParts = [
      api.event.venueName,
      api.event.address,
      api.event.city,
      api.event.state,
      api.event.country,
    ].filter((part): part is string => !!part && part.trim().length > 0);

    const address = locationParts.join(', ') || 'Ubicación por confirmar';
    const timeLabel = api.event.eventTime ? `${api.event.eventTime} hrs` : '';
    const names =
      api.invitation.title?.trim() ||
      api.event.name ||
      EVENT_TYPE_LABELS[api.event.eventType] ||
      'Invitación';

    return {
      slug: api.slug,
      heroImage:
        api.invitation.coverImageUrl ||
        api.invitation.backgroundImageUrl ||
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80',
      names,
      headline: api.invitation.subtitle?.trim() || EVENT_TYPE_LABELS[api.event.eventType] || 'Te invitamos',
      eventDate: new Date(api.event.eventDate),
      welcomeMessage:
        api.invitation.welcomeMessage?.trim() ||
        api.event.description?.trim() ||
        'Nos encantaría contar con tu presencia.',
      ceremony: {
        name: api.event.venueName || 'Ceremonia',
        time: timeLabel || 'Por confirmar',
        address,
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      },
      reception: {
        name: api.event.venueName || 'Recepción',
        time: timeLabel || 'Por confirmar',
        address,
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      },
      dressCode: api.event.dressCode?.trim() || 'Por confirmar',
      galleryImages: api.invitation.coverImageUrl ? [api.invitation.coverImageUrl] : [],
      giftRegistry: [],
      footerMessage: 'Gracias por acompañarnos en este momento especial.',
    };
  }
}
