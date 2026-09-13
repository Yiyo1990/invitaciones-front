import { Routes } from '@angular/router';

export const TEMPLATES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/template-list/template-list').then((m) => m.TemplateListPage),
  },
];
