import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CreateEventForm } from '../../../../core/models/create-event-form';
import { TemplateService } from '../../services/template.service';
import { EventInfoStep } from './components/event-info-step/event-info-step';
import { EventTypeStep } from './components/event-type-step/event-type-step';
import { SummaryStep } from './components/summary-step/summary-step';
import { TemplateStep } from './components/template-step/template-step';
import { WizardProgress, WizardStep } from './components/wizard-progress/wizard-progress';

@Component({
  selector: 'app-create-event-page',
  imports: [
    ReactiveFormsModule,
    WizardProgress,
    EventTypeStep,
    EventInfoStep,
    TemplateStep,
    SummaryStep,
  ],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css',
})
export class CreateEventPage {
  private readonly fb = inject(FormBuilder);
  private readonly templateService = inject(TemplateService);

  protected readonly currentStep = signal(1);
  protected readonly totalSteps = 4;
  protected readonly templates = toSignal(this.templateService.getAll(), { initialValue: [] });

  protected readonly steps: WizardStep[] = [
    { label: 'Tipo' },
    { label: 'Información' },
    { label: 'Plantilla' },
    { label: 'Resumen' },
  ];

  protected readonly form: FormGroup = this.fb.group({
    eventType: ['', Validators.required],
    eventName: ['', Validators.required],
    honoreeName: ['', Validators.required],
    eventDate: ['', Validators.required],
    eventTime: ['', Validators.required],
    venueName: ['', Validators.required],
    venueAddress: ['', Validators.required],
    templateId: ['', Validators.required],
  });

  private readonly stepFields: Record<number, (keyof CreateEventForm)[]> = {
    1: ['eventType'],
    2: ['eventName', 'honoreeName', 'eventDate', 'eventTime', 'venueName', 'venueAddress'],
    3: ['templateId'],
    4: [],
  };

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
      return;
    }

    const payload: CreateEventForm = this.form.getRawValue();
    console.log('Create invitation payload:', payload);
  }

  private validateCurrentStep(): boolean {
    const fields = this.stepFields[this.currentStep()] ?? [];

    fields.forEach((field) => {
      this.form.get(field)?.markAsTouched();
    });

    return fields.every((field) => this.form.get(field)?.valid);
  }
}
