import { Routes } from '@angular/router';

export const INVITATIONS_ROUTES: Routes = [
  {
    path: ':slug',
    loadComponent: () =>
      import('./invitation-public/invitation-public').then((m) => m.InvitationPublic),
  },
];
