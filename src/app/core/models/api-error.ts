/**
 * Error body returned by invitaciones-api `HttpExceptionFilter`.
 * Always uses a single string `message` (validation arrays are joined server-side).
 */
export interface ApiError {
  timestamp: string;
  statusCode: number;
  path: string;
  method: string;
  message: string;
}

export function isApiError(value: unknown): value is ApiError {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<ApiError>;
  return (
    typeof candidate.timestamp === 'string' &&
    typeof candidate.statusCode === 'number' &&
    typeof candidate.path === 'string' &&
    typeof candidate.method === 'string' &&
    typeof candidate.message === 'string'
  );
}
