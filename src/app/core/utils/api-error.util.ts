import { HttpErrorResponse } from '@angular/common/http';

import { ApiError, isApiError } from '../models/api-error';

/**
 * Normalizes NestJS API errors and generic HTTP failures into a single shape.
 * Prefer this helper over reading `HttpErrorResponse.error` in feature components.
 */
export function extractApiError(error: unknown): ApiError {
  if (error instanceof HttpErrorResponse) {
    if (isApiError(error.error)) {
      return error.error;
    }

    return {
      timestamp: new Date().toISOString(),
      statusCode: error.status || 0,
      path: error.url ?? '',
      method: '',
      message: resolveFallbackMessage(error),
    };
  }

  if (isApiError(error)) {
    return error;
  }

  return {
    timestamp: new Date().toISOString(),
    statusCode: 0,
    path: '',
    method: '',
    message: error instanceof Error ? error.message : 'Error de red desconocido',
  };
}

export function getApiErrorMessage(error: unknown): string {
  return extractApiError(error).message;
}

function resolveFallbackMessage(error: HttpErrorResponse): string {
  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }

  if (error.status === 0) {
    return 'No se pudo conectar con el servidor. Verifica que la API esté en ejecución.';
  }

  return error.message || 'Ocurrió un error inesperado';
}
