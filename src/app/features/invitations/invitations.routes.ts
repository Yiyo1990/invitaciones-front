import { Routes } from '@angular/router';

export const INVITATIONS_ROUTES: Routes = [
  {
    path: ':slug',
    loadComponent: () =>
      import('./pages/public-invitation/public-invitation').then((m) => m.PublicInvitationPage),
  },
];
