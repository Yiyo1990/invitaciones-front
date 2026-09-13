import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { InvitationTemplate } from '../../../../../../core/models/invitation-template';

@Component({
  selector: 'app-template-step',
  imports: [ReactiveFormsModule],
  templateUrl: './template-step.html',
  styleUrl: './template-step.css',
})
export class TemplateStep {
  form = input.required<FormGroup>();
  templates = input.required<InvitationTemplate[]>();

  selectTemplate(templateId: string): void {
    this.form().get('templateId')?.setValue(templateId);
    this.form().get('templateId')?.markAsTouched();
  }

  isSelected(templateId: string): boolean {
    return this.form().get('templateId')?.value === templateId;
  }

  hasError(): boolean {
    const control = this.form().get('templateId');
    return !!control?.invalid && !!control?.touched;
  }
}
