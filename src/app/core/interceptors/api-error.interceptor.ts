import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { extractApiError } from '../utils/api-error.util';

/**
 * Ensures HTTP failures expose the NestJS `ApiError` contract via `HttpErrorResponse.error`.
 * Feature services can then call `extractApiError` / `getApiErrorMessage` consistently.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      const apiError = extractApiError(error);

      return throwError(
        () =>
          new HttpErrorResponse({
            error: apiError,
            headers: error.headers,
            status: apiError.statusCode || error.status,
            statusText: error.statusText,
            url: error.url ?? undefined,
          }),
      );
    }),
  );
};
