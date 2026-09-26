import type React from 'react';

/**
 * Whether a click on a list row should toggle it. Clicks that land on a link
 * or button inside the row belong to that control, and a click that ends a
 * text selection is the reader copying something, not asking to fold the row.
 */
export function isRowToggleClick(e: React.MouseEvent<HTMLElement>): boolean {
  const target = e.target as HTMLElement;
  if (target.closest('a, button, input, select, textarea, [role="button"]')) return false;
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) return false;
  return true;
}
