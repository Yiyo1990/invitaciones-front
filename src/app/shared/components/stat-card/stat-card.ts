import { Component, input } from '@angular/core';

export type StatCardIcon = 'events' | 'guests' | 'confirmed' | 'pending' | 'declined' | 'people';

const ICON_STYLES: Record<StatCardIcon, string> = {
  events: 'bg-indigo-50 text-indigo-600',
  guests: 'bg-violet-50 text-violet-600',
  confirmed: 'bg-emerald-50 text-emerald-600',
  pending: 'bg-amber-50 text-amber-600',
  declined: 'bg-rose-50 text-rose-600',
  people: 'bg-sky-50 text-sky-600',
};

@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {
  label = input.required<string>();
  value = input.required<number>();
  icon = input<StatCardIcon>('events');

  iconStyles(): string {
    return ICON_STYLES[this.icon()];
  }
}
