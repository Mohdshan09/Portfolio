const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function formatMonthYear(value: string): string {
  const [year, month] = value.split('-').map(Number);
  const monthLabel = MONTHS[(month ?? 1) - 1] ?? '';
  return `${monthLabel} ${String(year).slice(2)}`;
}

/** `2026-09-23` → `23 SEP 2026` */
export function formatDay(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return `${String(day).padStart(2, '0')} ${MONTHS[(month ?? 1) - 1] ?? ''} ${year}`;
}

/** Whole days between an ISO date (`YYYY-MM-DD`) and now. */
export function daysSince(value: string, now: Date = new Date()): number {
  const then = new Date(`${value}T00:00:00`);
  return Math.max(0, Math.floor((now.getTime() - then.getTime()) / 86_400_000));
}
