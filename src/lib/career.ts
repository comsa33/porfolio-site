/**
 * Phrases in the intro that stay full-ink while the rest of the sentence
 * recedes to grey. Matched literally against the copy in profile.ts.
 */
export const LEDE_KEYWORDS = {
  ko: ['실행 런타임', '오케스트레이션', '메모리', '품질 평가'],
  en: ['execution runtime', 'orchestration', 'memory', 'quality evaluation'],
} as const;

/**
 * Career length is anchored to the measured figure (46 months of employment as of
 * 2026-07, which excludes the 2023.06–2023.11 gap) and accrues from there, so it
 * stays accurate instead of gaining a year every January.
 */
const CAREER_ANCHOR = { year: 2026, month: 7, months: 46 };

export function getCareerYears(): number {
  const now = new Date();
  const elapsedMonths =
    (now.getFullYear() - CAREER_ANCHOR.year) * 12 + (now.getMonth() + 1 - CAREER_ANCHOR.month);
  const totalMonths = CAREER_ANCHOR.months + Math.max(0, elapsedMonths);
  // Korean "N년차" counts the year in progress, hence the +1.
  return Math.floor(totalMonths / 12) + 1;
}

/**
 * Fills the `{years}` placeholder in the intro copy. The placeholder is explicit
 * so the copy can be rewritten freely — matching on a prose fragment used to make
 * the year silently vanish whenever the sentence changed.
 */
export function getCareerIntro(lang: 'ko' | 'en', introText: string): string {
  const years = getCareerYears();
  const token =
    lang === 'ko'
      ? String(years)
      : years === 1
        ? '1st-year'
        : years === 2
          ? '2nd-year'
          : years === 3
            ? '3rd-year'
            : `${years}th-year`;

  return introText.replace('{years}', token);
}
