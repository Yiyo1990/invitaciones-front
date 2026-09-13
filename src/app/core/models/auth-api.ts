/**
 * API contracts matching invitaciones-api Auth module DTOs.
 */

export type ApiUserRole = 'USER' | 'ADMIN';

/** Body for `POST /api/auth/login` (`LoginDto`). */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Body for `POST /api/auth/register` (`RegisterDto`). */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}

/** `user` nested in `AuthResponseDto`. */
export interface AuthUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  role: ApiUserRole;
  isActive: boolean;
}

/** Response from `POST /api/auth/login` and `POST /api/auth/register`. */
export interface AuthApiResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: AuthUserResponse;
}

/** Response from `GET /api/auth/me` (`UserResponseDto`). */
export interface UserApiResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  role: ApiUserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
