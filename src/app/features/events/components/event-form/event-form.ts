import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CreateEventForm } from '../../../../core/models/create-event-form';
import { TemplateService } from '../../../templates/services/template.service';
import {
  createEventFormGroup,
  EVENT_FORM_STEP_FIELDS,
} from '../../utils/event-form.factory';
import { EventInfoStep } from './event-info-step/event-info-step';
import { EventTypeStep } from './event-type-step/event-type-step';
import { SummaryStep } from './summary-step/summary-step';
import { TemplateStep } from './template-step/template-step';
import { WizardProgress, WizardStep } from './wizard-progress/wizard-progress';

export type EventFormMode = 'create' | 'edit';

@Component({
  selector: 'app-event-form',
  imports: [
    ReactiveFormsModule,
    WizardProgress,
    EventTypeStep,
    EventInfoStep,
    TemplateStep,
    SummaryStep,
  ],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly templateService = inject(TemplateService);
  private readonly destroyRef = inject(DestroyRef);

  mode = input<EventFormMode>('create');
  initialValue = input<Partial<CreateEventForm> | null>(null);

  formSubmit = output<CreateEventForm>();
  cancelled = output<void>();

  protected readonly currentStep = signal(1);
  protected readonly totalSteps = 4;
  protected readonly templates = toSignal(this.templateService.getAll(), { initialValue: [] });
  protected readonly isDirty = signal(false);

  protected readonly steps: WizardStep[] = [
    { label: 'Tipo' },
    { label: 'Información' },
    { label: 'Plantilla' },
    { label: 'Resumen' },
  ];

  protected readonly form: FormGroup = createEventFormGroup(this.fb);

  constructor() {
    effect(() => {
      const value = this.initialValue();
      if (!value) {
        return;
      }

      this.form.reset({
        eventType: value.eventType ?? '',
        eventName: value.eventName ?? '',
        honoreeName: value.honoreeName ?? '',
        eventDate: value.eventDate ?? '',
        eventTime: value.eventTime ?? '',
        venueName: value.venueName ?? '',
        venueAddress: value.venueAddress ?? '',
        latitude: value.latitude ?? null,
        longitude: value.longitude ?? null,
        placeId: value.placeId ?? null,
        googleMapsUrl: value.googleMapsUrl ?? null,
        dressCode: value.dressCode ?? '',
        templateId: value.templateId ?? '',
      });
      this.form.markAsPristine();
      this.form.markAsUntouched();
      this.isDirty.set(false);
      this.currentStep.set(1);
    });

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.isDirty.set(this.form.dirty);
    });
  }

  protected nextStep(): void {
    if (!this.validateCurrentStep()) {
      return;
    }

    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update((step) => step + 1);
    }
  }

  protected prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((step) => step - 1);
    }
  }

  protected submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.currentStep.set(this.firstInvalidStep());
      return;
    }

    if (this.mode() === 'edit' && !this.form.dirty) {
      return;
    }

    const payload: CreateEventForm = this.form.getRawValue();
    this.formSubmit.emit(payload);
  }

  protected onCancel(): void {
    this.cancelled.emit();
  }

  protected submitLabel(): string {
    return this.mode() === 'edit' ? 'Guardar cambios' : 'Crear invitación';
  }

  protected reviewHint(): string {
    return this.mode() === 'edit'
      ? 'Revisa la información antes de guardar los cambios.'
      : 'Revisa la información antes de crear tu invitación.';
  }

  protected canSubmit(): boolean {
    return this.mode() === 'create' || this.isDirty();
  }

  private validateCurrentStep(): boolean {
    const fields = EVENT_FORM_STEP_FIELDS[this.currentStep()] ?? [];

    fields.forEach((field) => {
      this.form.get(field)?.markAsTouched();
    });

    return fields.every((field) => this.form.get(field)?.valid);
  }

  private firstInvalidStep(): number {
    for (let step = 1; step <= this.totalSteps; step++) {
      const fields = EVENT_FORM_STEP_FIELDS[step] ?? [];
      const hasInvalid = fields.some((field) => this.form.get(field)?.invalid);
      if (hasInvalid) {
        return step;
      }
    }
    return this.totalSteps;
  }
}
