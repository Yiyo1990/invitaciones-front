import { Routes } from '@angular/router';

export const EVENTS_ROUTES: Routes = [
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/create-event/create-event').then((m) => m.CreateEventPage),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/edit-event/edit-event').then((m) => m.EditEventPage),
  },
  {
    path: ':id/invitation/edit',
    loadComponent: () =>
      import('../invitations/pages/edit-invitation/edit-invitation').then(
        (m) => m.EditInvitationPage,
      ),
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
