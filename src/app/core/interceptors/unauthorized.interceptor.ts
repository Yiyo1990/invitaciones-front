import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/**
 * On HTTP 401 from protected API calls: clear session and redirect to login.
 * Skips credential endpoints and public invitation routes to avoid redirect loops.
 */
export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }

      if (!req.url.startsWith(environment.apiUrl) || isCredentialAuthRequest(req.url)) {
        return throwError(() => error);
      }

      // Session bootstrap failures are handled by AuthService / AuthGuard.
      if (req.url.includes('/auth/me')) {
        authService.logout();
        return throwError(() => error);
      }

      const hadSession = authService.isAuthenticated();
      authService.logout();

      if (hadSession && !isAuthShellRoute(router.url) && !isPublicInvitationRoute(router.url)) {
        const returnUrl = router.url.startsWith('/login') ? undefined : router.url;
        void router.navigate(['/login'], {
          queryParams: returnUrl ? { returnUrl } : undefined,
        });
      }

      return throwError(() => error);
    }),
  );
};

function isCredentialAuthRequest(url: string): boolean {
  return url.endsWith('/auth/login') || url.endsWith('/auth/register');
}

function isAuthShellRoute(url: string): boolean {
  return url.startsWith('/login') || url.startsWith('/register');
}

function isPublicInvitationRoute(url: string): boolean {
  return url.startsWith('/invitacion');
}
