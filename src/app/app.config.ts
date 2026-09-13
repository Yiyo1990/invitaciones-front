import { LOCALE_ID } from '@angular/core';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAuthInitializer } from './core/auth.initializer';
import { apiErrorInterceptor } from './core/interceptors/api-error.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { unauthorizedInterceptor } from './core/interceptors/unauthorized.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, apiErrorInterceptor, unauthorizedInterceptor]),
    ),
    provideAuthInitializer(),
    { provide: LOCALE_ID, useValue: 'es' },
  ],
};
