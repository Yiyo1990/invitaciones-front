import { Routes } from '@angular/router';

export const EVENTS_ROUTES: Routes = [
  {
    path: 'new',
    loadComponent: () => import('./event-create/event-create').then((m) => m.EventCreate),
  },
  {
    path: '',
    loadComponent: () => import('./event-list/event-list').then((m) => m.EventList),
  },
  {
    path: ':id/guests',
    loadComponent: () =>
      import('../guests/event-guests/event-guests').then((m) => m.EventGuests),
  },
  {
    path: ':id',
    loadComponent: () => import('./event-detail/event-detail').then((m) => m.EventDetail),
  },
];
