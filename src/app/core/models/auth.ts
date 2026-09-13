import { User } from './user';

/** Session-oriented auth result used by the frontend after mapping the API response. */
export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: User;
}

export type { LoginRequest, RegisterRequest } from './auth-api';
