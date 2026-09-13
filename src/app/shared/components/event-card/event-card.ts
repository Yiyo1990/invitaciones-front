import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EventSummary } from '../../../core/models/event-summary';
import { EVENT_TYPE_LABELS } from '../../../core/models/event-type';
import { EventStatusBadge } from '../event-status-badge/event-status-badge';

@Component({
  selector: 'app-event-card',
  imports: [DatePipe, RouterLink, EventStatusBadge],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
})
export class EventCard {
  event = input.required<EventSummary>();

  protected readonly typeLabels = EVENT_TYPE_LABELS;
}
