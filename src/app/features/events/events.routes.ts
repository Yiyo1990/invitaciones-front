import { Routes } from '@angular/router';

export const EVENTS_ROUTES: Routes = [
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/create-event/create-event').then((m) => m.CreateEventPage),
  },
  {
    path: ':id/guests',
    loadComponent: () =>
      import('../guests/pages/guest-list/guest-list').then((m) => m.GuestListPage),
  },
  {
    path: '',
    loadComponent: () => import('./pages/events-list/events-list').then((m) => m.EventsListPage),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/event-detail/event-detail').then((m) => m.EventDetailPage),
  },
];
