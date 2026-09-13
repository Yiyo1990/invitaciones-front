import { Component, input } from '@angular/core';

import { EVENT_STATUS_LABELS, EventStatus } from '../../../core/models/event-status';

@Component({
  selector: 'app-event-status-badge',
  templateUrl: './event-status-badge.html',
  styleUrl: './event-status-badge.css',
})
export class EventStatusBadge {
  status = input.required<EventStatus>();

  protected readonly labels = EVENT_STATUS_LABELS;

  badgeClasses(): string {
    switch (this.status()) {
      case EventStatus.Published:
        return 'bg-emerald-50 text-emerald-700';
      case EventStatus.Finished:
        return 'bg-slate-100 text-slate-500';
      case EventStatus.Draft:
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }
}
