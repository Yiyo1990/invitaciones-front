import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-info-step',
  imports: [ReactiveFormsModule],
  templateUrl: './event-info-step.html',
  styleUrl: './event-info-step.css',
})
export class EventInfoStep {
  form = input.required<FormGroup>();

  isInvalid(field: string): boolean {
    const control = this.form().get(field);
    return !!control?.invalid && !!control?.touched;
  }
}
