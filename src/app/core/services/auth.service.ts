import { Injectable, computed, signal } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';

import { ACCESS_TOKEN_KEY, USER_KEY } from '../constants/auth-storage';
import { AuthResponse, LoginCredentials, RegisterPayload } from '../models/auth';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly accessTokenSignal = signal<string | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly accessToken = this.accessTokenSignal.asReadonly();
  readonly isAuthenticated = computed(
    () => this.currentUserSignal() !== null && !!this.accessTokenSignal(),
  );

  constructor() {
    this.restoreSession();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Mock auth — replace with HttpClient POST /auth/login when the API is ready.
    const response: AuthResponse = {
      accessToken: 'mock-access-token',
      user: {
        id: '1',
        name: this.deriveDisplayName(credentials.email),
        email: credentials.email.trim(),
      },
    };

    return of(response).pipe(
      delay(500),
      tap((auth) => this.persistSession(auth)),
    );
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    // Mock auth — replace with HttpClient POST /auth/register when the API is ready.
    const response: AuthResponse = {
      accessToken: 'mock-access-token',
      user: {
        id: crypto.randomUUID(),
        name: payload.name.trim(),
        email: payload.email.trim(),
      },
    };

    return of(response).pipe(
      delay(500),
      tap((auth) => this.persistSession(auth)),
    );
  }

  logout(): void {
    this.clearSession();
  }

  getAccessToken(): string | null {
    return this.accessTokenSignal();
  }

  private restoreSession(): void {
    const token = this.readStoredToken();
    const user = this.readStoredUser();

    if (token && user) {
      this.accessTokenSignal.set(token);
      this.currentUserSignal.set(user);
      return;
    }

    // Clear inconsistent leftover keys without a full valid session.
    this.clearSession();
  }

  private persistSession(auth: AuthResponse): void {
    // Temporary localStorage persistence until backend auth is integrated.
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
    } catch {
      // Ignore storage failures (private mode / quota).
    }
    this.accessTokenSignal.set(auth.accessToken);
    this.currentUserSignal.set(auth.user);
  }

  private clearSession(): void {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // Ignore storage failures.
    }
    this.accessTokenSignal.set(null);
    this.currentUserSignal.set(null);
  }

  private readStoredToken(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private readStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as Partial<User>;
      if (!parsed.id || !parsed.name || !parsed.email) {
        return null;
      }

      return {
        id: parsed.id,
        name: parsed.name,
        email: parsed.email,
      };
    } catch {
      return null;
    }
  }

  private deriveDisplayName(email: string): string {
    const localPart = email.split('@')[0]?.trim();
    if (!localPart) {
      return 'Usuario';
    }

    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  }
}
