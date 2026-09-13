import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { EVENT_TYPE_OPTIONS, EventType } from '../../../../../../core/models/event-type';

@Component({
  selector: 'app-event-type-step',
  imports: [ReactiveFormsModule],
  templateUrl: './event-type-step.html',
  styleUrl: './event-type-step.css',
})
export class EventTypeStep {
  form = input.required<FormGroup>();

  protected readonly eventTypes = EVENT_TYPE_OPTIONS;

  selectType(type: EventType): void {
    this.form().get('eventType')?.setValue(type);
    this.form().get('eventType')?.markAsTouched();
  }

  isSelected(type: EventType): boolean {
    return this.form().get('eventType')?.value === type;
  }

  hasError(): boolean {
    const control = this.form().get('eventType');
    return !!control?.invalid && !!control?.touched;
  }
}
