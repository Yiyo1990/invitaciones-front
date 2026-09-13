import { Component, input, output } from '@angular/core';

import { EVENT_TYPE_LABELS } from '../../../../core/models/event-type';
import { InvitationTemplate } from '../../../../core/models/invitation-template';

@Component({
  selector: 'app-template-card',
  templateUrl: './template-card.html',
  styleUrl: './template-card.css',
})
export class TemplateCard {
  template = input.required<InvitationTemplate>();

  preview = output<InvitationTemplate>();
  useTemplate = output<InvitationTemplate>();

  protected readonly typeLabels = EVENT_TYPE_LABELS;

  protected onPreview(): void {
    this.preview.emit(this.template());
  }

  protected onUse(): void {
    this.useTemplate.emit(this.template());
  }
}
