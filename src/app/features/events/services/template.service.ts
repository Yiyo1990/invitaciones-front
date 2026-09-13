import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { InvitationTemplate } from '../../../core/models/invitation-template';
import { MOCK_TEMPLATES } from '../data/mock-templates';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  getAll(): Observable<InvitationTemplate[]> {
    // Simulates a future HTTP call; replace with HttpClient when API is ready.
    return of(MOCK_TEMPLATES).pipe(delay(0));
  }
}
