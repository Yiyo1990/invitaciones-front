import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Matches NestJS `UpdateInvitationDto` HEX rule: `#` + 6 hex digits. Empty is valid (optional). */
export function optionalHexColorValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = typeof control.value === 'string' ? control.value.trim() : '';
    if (!value) {
      return null;
    }
    return /^#[0-9A-Fa-f]{6}$/.test(value) ? null : { hexColor: true };
  };
}

/** Optional absolute/relative URL string; empty is valid. */
export function optionalHttpUrlValidator(maxLength = 2048): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = typeof control.value === 'string' ? control.value.trim() : '';
    if (!value) {
      return null;
    }

    if (value.length > maxLength) {
      return { maxlength: { requiredLength: maxLength, actualLength: value.length } };
    }

    try {
      const parsed = new URL(value, value.startsWith('/') ? 'https://example.local' : undefined);
      if (!value.startsWith('/') && !['http:', 'https:'].includes(parsed.protocol)) {
        return { url: true };
      }
      return null;
    } catch {
      return { url: true };
    }
  };
}
