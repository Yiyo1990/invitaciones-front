import { Routes } from '@angular/router';

export const GUESTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/guest-list/guest-list').then((m) => m.GuestListPage),
  },
];
