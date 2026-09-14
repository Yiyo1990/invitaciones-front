/** Visual defaults for invitation editor/preview when backend values are null. */
export const DEFAULT_INVITATION_PRIMARY_COLOR = '#8B5CF6';
export const DEFAULT_INVITATION_SECONDARY_COLOR = '#F3E8FF';

export const INVITATION_WELCOME_MESSAGE_MAX_LENGTH = 3000;

export function resolveInvitationColor(
  value: string | null | undefined,
  fallback: string,
): string {
  const trimmed = value?.trim() ?? '';
  return /^#[0-9A-Fa-f]{6}$/.test(trimmed) ? trimmed : fallback;
}

/** Maps empty form strings to `null` so Nest can clear optional invitation fields. */
export function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
}
