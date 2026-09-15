/**
 * Stable template ids from the catalog (mock today; API later).
 * Appearance should follow templateId, not only Event.type.
 */
export type InvitationRendererKey =
  | 'generic'
  | 'wedding-eternal-garden'
  | 'birthday-adventure';

const INVITATION_RENDERERS: Record<string, InvitationRendererKey> = {
  'wedding-classic': 'generic',
  'wedding-modern': 'generic',
  'wedding-floral': 'generic',
  'wedding-eternal-garden': 'wedding-eternal-garden',
  'quince-elegant': 'generic',
  'quince-rose': 'generic',
  'birthday-kids': 'generic',
  'birthday-adventure': 'birthday-adventure',
  'baby-shower-soft': 'generic',
  'baptism-classic': 'generic',
  'graduation-modern': 'generic',
  'corporate-minimal': 'generic',
};

/**
 * Resolves which public invitation renderer to use.
 * Unknown / null templateId → generic (never blank).
 */
export function resolveInvitationRenderer(
  templateId: string | null | undefined,
): InvitationRendererKey {
  if (!templateId) {
    return 'generic';
  }
  return INVITATION_RENDERERS[templateId] ?? 'generic';
}
