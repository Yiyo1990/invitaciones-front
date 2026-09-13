import { Component, input } from '@angular/core';

import { VenueInfo } from '../../../../core/models/invitation-public-data';

@Component({
  selector: 'app-invitation-venue',
  imports: [],
  templateUrl: './invitation-venue.html',
  styleUrl: './invitation-venue.css',
})
export class InvitationVenue {
  title = input.required<string>();
  venue = input.required<VenueInfo>();
}
