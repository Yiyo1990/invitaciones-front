import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CreateEventForm } from '../../../core/models/create-event-form';
import {
  CreateInvitationRequest,
  EventApiResponse,
  EventDashboardApiResponse,
  InvitationApiResponse,
  UpdateInvitationRequest,
} from '../../../core/models/event-api';
import { EventDetail } from '../../../core/models/event-detail';
import { EventStatus } from '../../../core/models/event-status';
import { EventSummary } from '../../../core/models/event-summary';
import {
  extractHonoreeFromDescription,
  mapEventApiToDetail,
  mapEventApiToSummary,
  mapFormToCreateEventRequest,
  mapFormToUpdateEventRequest,
} from '../../../core/utils/event.mapper';
import { TemplateService } from '../../templates/services/template.service';

export interface DashboardMetrics {
  activeEvents: number;
  totalGuests: number;
  confirmedGuests: number;
  pendingGuests: number;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly templateService = inject(TemplateService);

  private readonly eventsUrl = `${environment.apiUrl}/events`;

  getSummaries(): Observable<EventSummary[]> {
    return this.http.get<EventApiResponse[]>(this.eventsUrl).pipe(
      map((events) => events.map(mapEventApiToSummary)),
    );
  }

  getById(id: string): Observable<EventSummary | null> {
    return this.http.get<EventApiResponse>(`${this.eventsUrl}/${id}`).pipe(
      map(mapEventApiToSummary),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return of(null);
        }
        throw error;
      }),
    );
  }

  getDetail(id: string): Observable<EventDetail | null> {
    if (!id) {
      return of(null);
    }

    return this.http.get<EventApiResponse>(`${this.eventsUrl}/${id}`).pipe(
      switchMap((event) =>
        forkJoin({
          event: of(event),
          invitation: this.getInvitation(id).pipe(catchError(() => of(null))),
          dashboard: this.getEventDashboard(id).pipe(catchError(() => of(null))),
          templates: this.templateService.getAll().pipe(catchError(() => of([]))),
        }),
      ),
      map(({ event, invitation, dashboard, templates }) => {
        const template = templates.find((item) => item.id === invitation?.templateId);
        const detail = mapEventApiToDetail(event, {
          invitation,
          dashboard,
          templateName: template?.name,
          templatePreview: template?.previewImage,
        });
        detail.honoreeName = extractHonoreeFromDescription(event.description);
        return detail;
      }),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return of(null);
        }
        throw error;
      }),
    );
  }

  createFromForm(form: CreateEventForm): Observable<EventApiResponse> {
    const body = mapFormToCreateEventRequest(form);

    return this.http.post<EventApiResponse>(this.eventsUrl, body).pipe(
      switchMap((created) => {
        if (!form.templateId) {
          return of(created);
        }

        const invitationBody: CreateInvitationRequest = {
          templateId: form.templateId,
          title: form.eventName.trim(),
          subtitle: form.honoreeName.trim() || undefined,
        };

        return this.http
          .post<InvitationApiResponse>(`${this.eventsUrl}/${created.id}/invitation`, invitationBody)
          .pipe(
            map(() => created),
            catchError(() => of(created)),
          );
      }),
    );
  }

  updateFromForm(id: string, form: CreateEventForm): Observable<EventApiResponse> {
    const body = mapFormToUpdateEventRequest(form);

    return this.http.patch<EventApiResponse>(`${this.eventsUrl}/${id}`, body).pipe(
      switchMap((updated) => this.syncInvitationTemplate(id, form).pipe(map(() => updated))),
    );
  }

  getEventDashboard(eventId: string): Observable<EventDashboardApiResponse> {
    return this.http.get<EventDashboardApiResponse>(`${this.eventsUrl}/${eventId}/dashboard`);
  }

  getInvitation(eventId: string): Observable<InvitationApiResponse | null> {
    return this.http.get<InvitationApiResponse>(`${this.eventsUrl}/${eventId}/invitation`).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return of(null);
        }
        throw error;
      }),
    );
  }

  computeDashboardMetrics(events: EventSummary[]): DashboardMetrics {
    const totalGuests = events.reduce((sum, event) => sum + event.totalGuests, 0);
    const confirmedGuests = events.reduce((sum, event) => sum + event.confirmedGuests, 0);

    return {
      activeEvents: events.filter((event) => event.status === EventStatus.Published).length,
      totalGuests,
      confirmedGuests,
      pendingGuests: Math.max(totalGuests - confirmedGuests, 0),
    };
  }

  private syncInvitationTemplate(eventId: string, form: CreateEventForm): Observable<unknown> {
    if (!form.templateId) {
      return of(null);
    }

    return this.getInvitation(eventId).pipe(
      switchMap((existing) => {
        if (existing) {
          const body: UpdateInvitationRequest = {
            templateId: form.templateId,
            title: form.eventName.trim(),
            subtitle: form.honoreeName.trim() || null,
          };
          return this.http.patch(`${this.eventsUrl}/${eventId}/invitation`, body);
        }

        const body: CreateInvitationRequest = {
          templateId: form.templateId,
          title: form.eventName.trim(),
          subtitle: form.honoreeName.trim() || undefined,
        };
        return this.http.post(`${this.eventsUrl}/${eventId}/invitation`, body);
      }),
      catchError(() => of(null)),
    );
  }
}
