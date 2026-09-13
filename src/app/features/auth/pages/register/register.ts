import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { getApiErrorMessage } from '../../../../core/utils/api-error.util';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly loading = signal(false);
  protected readonly submitted = signal(false);
  protected readonly formError = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator() },
  );

  protected isInvalid(
    field: 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword',
  ): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected showPasswordMismatch(): boolean {
    return (
      this.form.hasError('passwordMismatch') &&
      (this.form.controls.confirmPassword.touched || this.submitted())
    );
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
    const { firstName, lastName, email, password } = this.form.getRawValue();

    this.authService
      .register({
        firstName,
        email,
        password,
        ...(lastName.trim() ? { lastName: lastName.trim() } : {}),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          void this.router.navigateByUrl('/dashboard');
        },
        error: (error: unknown) => {
          this.loading.set(false);
          this.formError.set(this.resolveRegisterError(error));
        },
      });
  }

  private resolveRegisterError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 409) {
        return getApiErrorMessage(error) || 'Ya existe una cuenta con este correo.';
      }
      if (error.status === 0) {
        return 'No se pudo conectar con el servidor. Intenta de nuevo más tarde.';
      }
      if (error.status === 400) {
        return getApiErrorMessage(error) || 'Revisa los datos del formulario.';
      }
    }

    return getApiErrorMessage(error) || 'No se pudo crear la cuenta. Intenta de nuevo.';
  }
}
