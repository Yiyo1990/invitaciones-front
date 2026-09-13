import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';

import { CreateEventForm } from '../../../../core/models/create-event-form';
import { getApiErrorMessage } from '../../../../core/utils/api-error.util';
import { TemplateService } from '../../../templates/services/template.service';
import { EventFormComponent } from '../../components/event-form/event-form';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-create-event-page',
  imports: [EventFormComponent],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css',
})
export class CreateEventPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly templateService = inject(TemplateService);
  private readonly eventService = inject(EventService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);

  /** Pre-selects a template when arriving from `/events/new?template=ID`. */
  protected readonly initialValue = toSignal(
    this.route.queryParamMap.pipe(
      switchMap((params) => {
        const templateId = params.get('template')?.trim();
        if (!templateId) {
          return of(null);
        }

        return this.templateService.getById(templateId).pipe(
          map((template) => (template ? ({ templateId: template.id } as Partial<CreateEventForm>) : null)),
        );
      }),
    ),
    { initialValue: null },
  );

  protected onSubmit(payload: CreateEventForm): void {
    if (this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.formError.set(null);

    this.eventService
      .createFromForm(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (created) => {
          this.submitting.set(false);
          void this.router.navigate(['/events', created.id]);
        },
        error: (error: unknown) => {
          this.submitting.set(false);
          this.formError.set(getApiErrorMessage(error) || 'No se pudo crear el evento.');
        },
      });
  }
}
