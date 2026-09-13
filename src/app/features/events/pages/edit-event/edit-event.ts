import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';

import { CreateEventForm } from '../../../../core/models/create-event-form';
import { getApiErrorMessage } from '../../../../core/utils/api-error.util';
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
  private readonly destroyRef = inject(DestroyRef);

  protected readonly saveSuccess = signal(false);
  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly loadError = signal<string | null>(null);

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
          catchError((error: unknown) => {
            this.loadError.set(getApiErrorMessage(error) || 'No se pudo cargar el evento.');
            return of(null);
          }),
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
    if (!event || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.formError.set(null);

    this.eventService
      .updateFromForm(event.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.saveSuccess.set(true);
          void this.router.navigate(['/events', event.id]);
        },
        error: (error: unknown) => {
          this.submitting.set(false);
          this.formError.set(getApiErrorMessage(error) || 'No se pudieron guardar los cambios.');
        },
      });
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
