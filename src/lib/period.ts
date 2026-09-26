/**
 * Timeline dates are written '2022.05 ~ 2023.06', or '2024.08 ~' while still
 * running. The open end is filled in per language here rather than stored, so
 * a Korean page never shows 'Current' and an English one never shows '현재'.
 */
export const formatPeriod = (date: string, lang: 'ko' | 'en'): string =>
  date.trimEnd().endsWith('~') ? `${date.trimEnd()} ${lang === 'ko' ? '현재' : 'Present'}` : date;
