import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { EventCard } from '../../../../shared/components/event-card/event-card';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { EventService } from '../../../events/services/event.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, StatCard, EventCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardPage {
  private readonly eventService = inject(EventService);

  protected readonly events = toSignal(this.eventService.getSummaries(), { initialValue: [] });

  protected readonly metrics = computed(() =>
    this.eventService.computeDashboardMetrics(this.events()),
  );
}
