/** Shared between the /api/match route and the page that calls it. */

export const MAX_JD_CHARS = 4000;
/** Shorter than this is a title or a keyword, not something to rank against. */
export const MIN_JD_CHARS = 30;

/** Every way /api/match can refuse; the page has a sentence for each. */
export type MatchError =
  | 'too_short'
  | 'too_long'
  | 'not_posting'
  | 'rate_limited'
  | 'unavailable'
  | 'upstream'
  | 'invalid';

export interface MatchScore {
  id: string;
  /** 0–3: unrelated, tangential, some requirements, core requirements. */
  score: number;
  confidence: number;
}

export type MatchLevel = 'core' | 'partial';

/*
 * Cut points from the Korean trial (2026-10): projects a person would call a
 * fit scored 2.15–2.98, the nearest misses 1.7–1.98. Below 2 no badge — the
 * project stays in the list, it just is not claimed as a match.
 */
export function matchLevel(score: number): MatchLevel | null {
  if (score >= 2.5) return 'core';
  if (score >= 2) return 'partial';
  return null;
}

export const MATCH_LABEL: Record<MatchLevel, { ko: string; en: string }> = {
  core: { ko: '핵심 일치', en: 'Core match' },
  partial: { ko: '일부 일치', en: 'Partial match' },
};
