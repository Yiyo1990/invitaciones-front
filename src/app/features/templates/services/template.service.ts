import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { EventType } from '../../../core/models/event-type';
import { InvitationTemplate } from '../../../core/models/invitation-template';
import { INVITATION_TEMPLATES_MOCK } from '../data/invitation-templates.mock';

export interface TemplateFilterOptions {
  query?: string;
  category?: EventType | 'ALL';
  activeOnly?: boolean;
}

@Injectable({ providedIn: 'root' })
export class TemplateService {
  getAll(): Observable<InvitationTemplate[]> {
    // No NestJS templates catalog endpoint exists yet; keep local catalog.
    return of(INVITATION_TEMPLATES_MOCK).pipe(delay(0));
  }

  getById(id: string): Observable<InvitationTemplate | null> {
    const template = INVITATION_TEMPLATES_MOCK.find((item) => item.id === id) ?? null;
    return of(template).pipe(delay(0));
  }

  filterTemplates(
    templates: InvitationTemplate[],
    options: TemplateFilterOptions = {},
  ): InvitationTemplate[] {
    const query = options.query?.trim().toLowerCase() ?? '';
    const category = options.category ?? 'ALL';
    const activeOnly = options.activeOnly ?? true;

    return templates.filter((template) => {
      if (activeOnly && !template.isActive) {
        return false;
      }

      const matchesCategory = category === 'ALL' || template.category === category;
      const matchesQuery =
        !query ||
        template.name.toLowerCase().includes(query) ||
        (template.description?.toLowerCase().includes(query) ?? false);

      return matchesCategory && matchesQuery;
    });
  }
}
