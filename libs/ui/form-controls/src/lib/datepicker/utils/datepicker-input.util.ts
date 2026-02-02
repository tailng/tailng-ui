import { TngDateAdapter } from "../adapters";

export type ParseResult =
  | { kind: 'empty' }
  | { kind: 'partial' } // user is still typing; do not error hard
  | { kind: 'invalid' } // definitely not a date
  | { kind: 'valid'; date: Date };

const DATE_TOKENS = ['YYYY', 'YY', 'MMMM', 'MMM', 'MM', 'M', 'DD', 'D'] as const;
type DateToken = (typeof DATE_TOKENS)[number];

type FormatPart = { kind: 'token'; token: DateToken } | { kind: 'lit'; text: string };

function tokenizeFormat(fmt: string): FormatPart[] {
  const parts: FormatPart[] = [];
  let i = 0;

  while (i < fmt.length) {
    let matched: DateToken | null = null;

    for (const t of DATE_TOKENS) {
      if (fmt.startsWith(t, i)) {
        matched = t;
        break;
      }
    }

    if (matched) {
      parts.push({ kind: 'token', token: matched });
      i += matched.length;
    } else {
      parts.push({ kind: 'lit', text: fmt[i] });
      i += 1;
    }
  }

  // merge adjacent literals
  const merged: FormatPart[] = [];
  for (const p of parts) {
    const last = merged[merged.length - 1];
    if (p.kind === 'lit' && last?.kind === 'lit') last.text += p.text;
    else merged.push(p);
  }

  return merged;
}

function normalizeFormat(fmt: string): string {
  // Keep only date tokens in order, drop literals.
  return tokenizeFormat(fmt)
    .filter((p) => p.kind === 'token')
    .map((p) => (p as { kind: 'token'; token: DateToken }).token)
    .join('');
}

function normalizeInputAlphaNum(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9]/g, '');
}

function hasLetters(raw: string): boolean {
  return /[a-zA-Z]/.test(raw);
}

function isLikelyPartial(raw: string): boolean {
  // Partial if:
  // - ends with a separator-like char
  // - contains letters but not enough letters for month names yet
  // - too short overall
  const t = raw.trim();
  if (!t) return true;
  if (/[-/.\s]$/.test(t)) return true;
  if (hasLetters(t) && t.length < 6) return true;
  if (normalizeInputAlphaNum(t).length < 6) return true;
  return false;
}

/**
 * Smart parse:
 * 1) Try strict parse of raw input using displayFormat (supports separators, MMM, etc.)
 * 2) If fails, try normalized input + normalized format (removes literals),
 *    e.g. "15-May-1981" -> "15May1981" with "DDMMMYYYY"
 *
 * Returns partial/invalid/valid.
 */
export function parseSmartDate(
  raw: string,
  displayFormat: string,
  adapter: TngDateAdapter,
  locale?: string
): ParseResult {
  const text = raw.trim();
  if (!text) return { kind: 'empty' };

  // 1) strict as-is parse
  const direct = adapter.parse(text, displayFormat, locale);
  if (direct && adapter.isValid(direct)) {
    return { kind: 'valid', date: adapter.startOfDay(direct) };
  }

  // If user is still typing, don't mark invalid aggressively
  if (isLikelyPartial(text)) return { kind: 'partial' };

  // 2) normalized parse (strip literals)
  const normFmt = normalizeFormat(displayFormat);
  const normInput = normalizeInputAlphaNum(text);
  if (!normInput) return { kind: 'empty' };

  const normalized = adapter.parse(normInput, normFmt, locale);
  if (normalized && adapter.isValid(normalized)) {
    return { kind: 'valid', date: adapter.startOfDay(normalized) };
  }

  // If contains letters, assume month still being typed (Ma, May, etc.)
  if (hasLetters(text) && text.length < 10) return { kind: 'partial' };

  return { kind: 'invalid' };
}

/**
 * Format a Date using displayFormat and locale.
 */
export function formatDate(
  date: Date,
  displayFormat: string,
  adapter: TngDateAdapter,
  locale?: string
): string {
  return adapter.format(date, displayFormat, locale);
}

/**
 * Caret preservation:
 * after we programmatically replace input.value, reposition caret to a logical place.
 *
 * Strategy:
 * - Count alphanumeric characters before caret in the "before" string.
 * - Find the position in "after" string that has the same count of alphanumerics.
 */
export function computeNextCaretPos(before: string, beforeCaret: number, after: string): number {
  const countAlphaNum = (s: string) => (s.match(/[a-zA-Z0-9]/g) ?? []).length;

  const beforeLeft = before.slice(0, beforeCaret);
  const targetCount = countAlphaNum(beforeLeft);

  if (targetCount === 0) return 0;

  let seen = 0;
  for (let i = 0; i < after.length; i++) {
    if (/[a-zA-Z0-9]/.test(after[i])) seen++;
    if (seen >= targetCount) return i + 1;
  }

  return after.length;
}
