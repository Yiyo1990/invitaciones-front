import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { EVENT_TYPE_LABELS, EVENT_TYPE_OPTIONS, EventType } from '../../../../core/models/event-type';
import { InvitationTemplate } from '../../../../core/models/invitation-template';
import { Modal } from '../../../../shared/components/modal/modal';
import { TemplateCard } from '../../components/template-card/template-card';
import { TemplateService } from '../../services/template.service';

type CategoryFilter = EventType | 'ALL';

@Component({
  selector: 'app-template-list-page',
  imports: [FormsModule, RouterLink, TemplateCard, Modal],
  templateUrl: './template-list.html',
  styleUrl: './template-list.css',
})
export class TemplateListPage {
  private readonly templateService = inject(TemplateService);
  private readonly router = inject(Router);

  protected readonly typeOptions = EVENT_TYPE_OPTIONS;
  protected readonly typeLabels = EVENT_TYPE_LABELS;

  protected readonly searchQuery = signal('');
  protected readonly categoryFilter = signal<CategoryFilter>('ALL');
  protected readonly previewTemplate = signal<InvitationTemplate | null>(null);

  private readonly templates = toSignal(this.templateService.getAll(), { initialValue: [] });

  protected readonly filteredTemplates = computed(() =>
    this.templateService.filterTemplates(this.templates(), {
      query: this.searchQuery(),
      category: this.categoryFilter(),
      activeOnly: true,
    }),
  );

  protected readonly hasActiveFilters = computed(
    () => this.searchQuery().trim().length > 0 || this.categoryFilter() !== 'ALL',
  );

  protected onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  protected onCategoryFilter(value: CategoryFilter): void {
    this.categoryFilter.set(value);
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.categoryFilter.set('ALL');
  }

  protected openPreview(template: InvitationTemplate): void {
    this.previewTemplate.set(template);
  }

  protected closePreview(): void {
    this.previewTemplate.set(null);
  }

  protected useTemplate(template: InvitationTemplate): void {
    this.closePreview();
    void this.router.navigate(['/events/new'], {
      queryParams: { template: template.id },
    });
  }
}
