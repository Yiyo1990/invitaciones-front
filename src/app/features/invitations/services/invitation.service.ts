import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { InvitationPublicData } from '../../../core/models/invitation-public-data';
import { MOCK_INVITATIONS } from '../data/mock-invitations';

@Injectable({ providedIn: 'root' })
export class InvitationService {
  getBySlug(slug: string): Observable<InvitationPublicData | null> {
    const invitation = MOCK_INVITATIONS[slug] ?? null;

    // Simulates a future HTTP call; replace with HttpClient when API is ready.
    return of(invitation).pipe(delay(200));
  }
}
