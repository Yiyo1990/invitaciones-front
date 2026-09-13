import { Component, input } from '@angular/core';

export interface WizardStep {
  label: string;
}

@Component({
  selector: 'app-wizard-progress',
  imports: [],
  templateUrl: './wizard-progress.html',
  styleUrl: './wizard-progress.css',
})
export class WizardProgress {
  steps = input.required<WizardStep[]>();
  currentStep = input.required<number>();
}
