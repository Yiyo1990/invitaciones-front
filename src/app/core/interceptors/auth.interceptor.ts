import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/**
 * Attaches `Authorization: Bearer <token>` for requests to the NestJS API only.
 * Matches invitaciones-api JWT strategy (`ExtractJwt.fromAuthHeaderAsBearerToken()`).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  if (!token || !isApiRequest(req.url)) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};

function isApiRequest(url: string): boolean {
  return url.startsWith(environment.apiUrl);
}
