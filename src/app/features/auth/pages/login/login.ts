import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { getApiErrorMessage } from '../../../../core/utils/api-error.util';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loading = signal(false);
  protected readonly submitted = signal(false);
  protected readonly formError = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected isInvalid(field: 'email' | 'password'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected onSubmit(): void {
    this.submitted.set(true);
    this.formError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    const { email, password } = this.form.getRawValue();

    this.authService
      .login({ email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          void this.router.navigateByUrl(this.resolveReturnUrl());
        },
        error: (error: unknown) => {
          this.loading.set(false);
          this.formError.set(this.resolveLoginError(error));
        },
      });
  }

  private resolveLoginError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return 'Correo o contraseña incorrectos.';
      }
      if (error.status === 403) {
        return getApiErrorMessage(error) || 'Tu cuenta está desactivada.';
      }
      if (error.status === 0) {
        return 'No se pudo conectar con el servidor. Intenta de nuevo más tarde.';
      }
    }

    const message = getApiErrorMessage(error);
    return message || 'No se pudo iniciar sesión. Intenta de nuevo.';
  }

  private resolveReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
      return returnUrl;
    }
    return '/dashboard';
  }
}
