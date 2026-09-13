import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { EventCard } from '../../../../shared/components/event-card/event-card';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-events-list-page',
  imports: [RouterLink, EventCard],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
})
export class EventsListPage {
  private readonly eventService = inject(EventService);

  protected readonly events = toSignal(this.eventService.getSummaries(), { initialValue: [] });
}
