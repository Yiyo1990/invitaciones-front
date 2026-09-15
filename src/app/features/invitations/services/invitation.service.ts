import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  CreateInvitationRequest,
  InvitationApiResponse,
  PublicInvitationApiResponse,
  UpdateInvitationCustomizationRequest,
  UpdateInvitationRequest,
} from '../../../core/models/event-api';
import { InvitationPublicData } from '../../../core/models/invitation-public-data';
import { GuestStatus } from '../../../core/models/guest-status';
import { mapPublicInvitation } from '../utils/map-public-invitation.util';

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

/** @deprecated Prefer UpdateInvitationCustomizationRequest from core/models/event-api. */
export type InvitationCustomizationRequest = UpdateInvitationCustomizationRequest;
@Injectable({ providedIn: 'root' })
export class InvitationService {
  private readonly http = inject(HttpClient);

  private eventsInvitationUrl(eventId: string): string {
    return `${environment.apiUrl}/events/${eventId}/invitation`;
  }

  /** Authenticated: `GET /api/events/:eventId/invitation`. Returns null on 404. */
  getByEventId(eventId: string): Observable<InvitationApiResponse | null> {
    return this.http.get<InvitationApiResponse>(this.eventsInvitationUrl(eventId)).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return of(null);
        }
        throw error;
      }),
    );
  }

  /** Authenticated: `POST /api/events/:eventId/invitation`. */
  create(eventId: string, body: CreateInvitationRequest = {}): Observable<InvitationApiResponse> {
    return this.http.post<InvitationApiResponse>(this.eventsInvitationUrl(eventId), body);
  }

  /** Authenticated: `PATCH /api/events/:eventId/invitation`. */
  update(
    eventId: string,
    body: UpdateInvitationRequest,
  ): Observable<InvitationApiResponse> {
    return this.http.patch<InvitationApiResponse>(this.eventsInvitationUrl(eventId), body);
  }

  /** Authenticated: `PATCH /api/events/:eventId/invitation` (Nest `UpdateInvitationDto`). */
  updateCustomization(
    eventId: string,
    body: UpdateInvitationCustomizationRequest,
  ): Observable<InvitationApiResponse> {
    return this.update(eventId, body);
  }

  /**
   * Saves customization fields.
   * Prefer PATCH when the invitation already exists (normal after event creation).
   * Falls back to POST only when GET returned 404.
   */
  saveCustomization(
    eventId: string,
    body: UpdateInvitationCustomizationRequest,
    options: { createIfMissing: boolean },
  ): Observable<InvitationApiResponse> {
    if (options.createIfMissing) {
      const createBody: CreateInvitationRequest = {};
      if (body.welcomeMessage) {
        createBody.welcomeMessage = body.welcomeMessage;
      }
      if (body.primaryColor) {
        createBody.primaryColor = body.primaryColor;
      }
      if (body.secondaryColor) {
        createBody.secondaryColor = body.secondaryColor;
      }
      if (body.backgroundImageUrl) {
        createBody.backgroundImageUrl = body.backgroundImageUrl;
      }
      if (body.coverImageUrl) {
        createBody.coverImageUrl = body.coverImageUrl;
      }
      if (body.musicUrl) {
        createBody.musicUrl = body.musicUrl;
      }
      return this.create(eventId, createBody);
    }
    return this.updateCustomization(eventId, body);
  }

  /** Authenticated: `POST /api/events/:eventId/invitation/publish`. */
  publish(eventId: string): Observable<InvitationApiResponse> {
    return this.http.post<InvitationApiResponse>(
      `${this.eventsInvitationUrl(eventId)}/publish`,
      {},
    );
  }

  /** Authenticated: `POST /api/events/:eventId/invitation/unpublish`. */
  unpublish(eventId: string): Observable<InvitationApiResponse> {
    return this.http.post<InvitationApiResponse>(
      `${this.eventsInvitationUrl(eventId)}/unpublish`,
      {},
    );
  }

  getBySlug(slug: string): Observable<InvitationPublicData | null> {
    return this.http
      .get<PublicInvitationApiResponse>(`${environment.apiUrl}/public/events/${slug}`)
      .pipe(
        map((response) => mapPublicInvitation(response)),
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
}
