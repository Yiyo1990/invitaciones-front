import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { EVENT_TYPE_LABELS, EventType } from '../../../../../core/models/event-type';
import { InvitationTemplate } from '../../../../../core/models/invitation-template';

@Component({
  selector: 'app-summary-step',
  imports: [DatePipe],
  templateUrl: './summary-step.html',
  styleUrl: './summary-step.css',
})
export class SummaryStep {
  form = input.required<FormGroup>();
  templates = input.required<InvitationTemplate[]>();

  protected readonly eventTypeLabels = EVENT_TYPE_LABELS;

  selectedTemplate(): InvitationTemplate | undefined {
    const templateId = this.form().get('templateId')?.value;
    return this.templates().find((template) => template.id === templateId);
  }

  eventTypeLabel(): string {
    const eventType = this.form().get('eventType')?.value as EventType;
    return eventType ? this.eventTypeLabels[eventType] : '—';
  }
}
