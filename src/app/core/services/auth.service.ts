import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, shareReplay, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ACCESS_TOKEN_KEY, USER_KEY } from '../constants/auth-storage';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth';
import { AuthApiResponse, UserApiResponse } from '../models/auth-api';
import { User } from '../models/user';
import { mapAuthUserToUser } from '../utils/auth-user.mapper';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly currentUserSignal = signal<User | null>(null);
  private readonly accessTokenSignal = signal<string | null>(null);
  private readonly sessionReadySignal = signal(false);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly accessToken = this.accessTokenSignal.asReadonly();
  readonly sessionReady = this.sessionReadySignal.asReadonly();
  readonly isAuthenticated = computed(
    () => this.currentUserSignal() !== null && !!this.accessTokenSignal(),
  );

  private readonly authBaseUrl = `${environment.apiUrl}/auth`;
  private sessionInit$: Observable<void> | null = null;

  /**
   * Restores and validates the stored JWT against `GET /api/auth/me`.
   * Safe to call multiple times; shares a single in-flight bootstrap request.
   */
  initializeSession(): Observable<void> {
    if (this.sessionReady()) {
      return of(undefined);
    }

    if (this.sessionInit$) {
      return this.sessionInit$;
    }

    this.sessionInit$ = this.bootstrapSession().pipe(
      tap(() => this.sessionReadySignal.set(true)),
      shareReplay(1),
    );

    return this.sessionInit$;
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    const body: LoginRequest = {
      email: request.email.trim(),
      password: request.password,
    };

    return this.http.post<AuthApiResponse>(`${this.authBaseUrl}/login`, body).pipe(
      map((response) => this.mapAuthResponse(response)),
      tap((auth) => this.persistSession(auth)),
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    const body: RegisterRequest = {
      email: request.email.trim(),
      password: request.password,
      firstName: request.firstName.trim(),
    };

    const lastName = request.lastName?.trim();
    if (lastName) {
      body.lastName = lastName;
    }

    return this.http.post<AuthApiResponse>(`${this.authBaseUrl}/register`, body).pipe(
      map((response) => this.mapAuthResponse(response)),
      tap((auth) => this.persistSession(auth)),
    );
  }

  logout(): void {
    this.clearSession();
    this.sessionReadySignal.set(true);
    this.sessionInit$ = null;
  }

  getAccessToken(): string | null {
    return this.accessTokenSignal();
  }

  private bootstrapSession(): Observable<void> {
    const token = this.readStoredToken();

    if (!token) {
      this.clearSession();
      return of(undefined);
    }

    this.accessTokenSignal.set(token);

    const cachedUser = this.readStoredUser();
    if (cachedUser) {
      this.currentUserSignal.set(cachedUser);
    }

    return this.http.get<UserApiResponse>(`${this.authBaseUrl}/me`).pipe(
      tap((apiUser) => {
        const user = mapAuthUserToUser(apiUser);
        this.persistUser(user);
        this.currentUserSignal.set(user);
      }),
      map(() => undefined),
      catchError(() => {
        this.clearSession();
        return of(undefined);
      }),
    );
  }

  private mapAuthResponse(response: AuthApiResponse): AuthResponse {
    return {
      accessToken: response.accessToken,
      tokenType: response.tokenType,
      expiresIn: response.expiresIn,
      user: mapAuthUserToUser(response.user),
    };
  }

  private persistSession(auth: AuthResponse): void {
    this.persistToken(auth.accessToken);
    this.persistUser(auth.user);
    this.accessTokenSignal.set(auth.accessToken);
    this.currentUserSignal.set(auth.user);
    this.sessionReadySignal.set(true);
    this.sessionInit$ = null;
  }

  private persistToken(token: string): void {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch {
      // Ignore storage failures (private mode / quota).
    }
  }

  private persistUser(user: User): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // Ignore storage failures.
    }
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
      if (!parsed.id || !parsed.email || !parsed.firstName || !parsed.name) {
        return null;
      }

      return {
        id: parsed.id,
        email: parsed.email,
        name: parsed.name,
        firstName: parsed.firstName,
        lastName: parsed.lastName ?? null,
        role: parsed.role === 'ADMIN' ? 'ADMIN' : 'USER',
        isActive: parsed.isActive !== false,
      };
    } catch {
      return null;
    }
  }
}
