import { Component, input } from '@angular/core';

import { GUEST_STATUS_LABELS, GuestStatus } from '../../../../core/models/guest-status';

@Component({
  selector: 'app-guest-status-badge',
  imports: [],
  templateUrl: './guest-status-badge.html',
  styleUrl: './guest-status-badge.css',
})
export class GuestStatusBadge {
  status = input.required<GuestStatus>();

  protected readonly labels = GUEST_STATUS_LABELS;

  badgeClasses(): string {
    switch (this.status()) {
      case GuestStatus.Confirmed:
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      case GuestStatus.Declined:
        return 'bg-rose-50 text-rose-700 ring-rose-600/20';
      case GuestStatus.Pending:
      default:
        return 'bg-amber-50 text-amber-700 ring-amber-600/20';
    }
  }
}
