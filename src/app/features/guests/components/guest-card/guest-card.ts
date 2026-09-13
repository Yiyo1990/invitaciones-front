import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { Guest } from '../../../../core/models/guest';
import { GuestStatusBadge } from '../guest-status-badge/guest-status-badge';

@Component({
  selector: 'app-guest-card',
  imports: [DatePipe, GuestStatusBadge],
  templateUrl: './guest-card.html',
  styleUrl: './guest-card.css',
})
export class GuestCard {
  guest = input.required<Guest>();

  edit = output<Guest>();
  remove = output<Guest>();

  onEdit(): void {
    this.edit.emit(this.guest());
  }

  onRemove(): void {
    this.remove.emit(this.guest());
  }
}
