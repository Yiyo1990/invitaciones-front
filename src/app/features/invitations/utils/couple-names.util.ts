/** Extracts the first letter for monogram display (letters/numbers only). */
export function getNameInitial(name: string | null | undefined): string {
  const trimmed = name?.trim() ?? '';
  if (!trimmed) {
    return '';
  }
  const match = trimmed.match(/[\p{L}\p{N}]/u);
  return match ? match[0].toUpperCase() : '';
}

export interface CoupleDisplayNames {
  first: string;
  second: string | null;
}

/**
 * Splits invitation display names into couple parts.
 * Supports "Ana & Carlos", "Ana y Carlos", "Ana and Carlos", or a single name.
 */
export function parseCoupleNames(names: string | null | undefined): CoupleDisplayNames {
  const trimmed = names?.trim() ?? '';
  if (!trimmed) {
    return { first: '', second: null };
  }

  const parts = trimmed.split(/\s*(?:&| y | and )\s*/i).map((part) => part.trim()).filter(Boolean);

  if (parts.length >= 2) {
    return { first: parts[0], second: parts.slice(1).join(' ') };
  }

  return { first: trimmed, second: null };
}
