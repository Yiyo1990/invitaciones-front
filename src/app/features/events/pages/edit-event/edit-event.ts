import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';

import { CreateEventForm } from '../../../../core/models/create-event-form';
import { EventFormComponent } from '../../components/event-form/event-form';
import { EventService } from '../../services/event.service';
import { TemplateService } from '../../../templates/services/template.service';
import { mapEventDetailToFormValue } from '../../utils/event-form.mapper';

@Component({
  selector: 'app-edit-event-page',
  imports: [RouterLink, EventFormComponent],
  templateUrl: './edit-event.html',
  styleUrl: './edit-event.css',
})
export class EditEventPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventService = inject(EventService);
  private readonly templateService = inject(TemplateService);

  protected readonly saveSuccess = signal(false);

  private readonly eventId$ = this.route.paramMap.pipe(map((params) => params.get('id') ?? ''));

  private readonly pageData = toSignal(
    this.eventId$.pipe(
      switchMap((id) => {
        if (!id) {
          return of(null);
        }

        return this.templateService.getAll().pipe(
          switchMap((templates) =>
            this.eventService.getDetail(id).pipe(
              map((event) =>
                event
                  ? {
                      event,
                      formValue: mapEventDetailToFormValue(event, templates),
                    }
                  : null,
              ),
            ),
          ),
          catchError(() => of(null)),
        );
      }),
    ),
  );

  protected readonly loading = computed(() => this.pageData() === undefined);
  protected readonly event = computed(() => this.pageData()?.event ?? null);
  protected readonly formValue = computed(() => this.pageData()?.formValue ?? null);
  protected readonly eventId = computed(() => this.event()?.id ?? '');

  protected onSubmit(payload: CreateEventForm): void {
    const event = this.event();
    if (!event) {
      return;
    }

    const updated = {
      id: event.id,
      slug: event.slug,
      status: event.status,
      ...payload,
    };

    console.log('Update event payload:', updated);

    this.saveSuccess.set(true);

    setTimeout(() => {
      void this.router.navigate(['/events', event.id]);
    }, 800);
  }

  protected onCancel(): void {
    const id = this.eventId();
    if (id) {
      void this.router.navigate(['/events', id]);
    } else {
      void this.router.navigate(['/events']);
    }
  }
}
