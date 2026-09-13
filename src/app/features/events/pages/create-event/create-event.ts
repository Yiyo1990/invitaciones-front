import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, of, switchMap } from 'rxjs';

import { CreateEventForm } from '../../../../core/models/create-event-form';
import { TemplateService } from '../../../templates/services/template.service';
import { EventFormComponent } from '../../components/event-form/event-form';

@Component({
  selector: 'app-create-event-page',
  imports: [EventFormComponent],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css',
})
export class CreateEventPage {
  private readonly route = inject(ActivatedRoute);
  private readonly templateService = inject(TemplateService);

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
    console.log('Create invitation payload:', payload);
  }
}
