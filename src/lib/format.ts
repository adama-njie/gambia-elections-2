import type { Provenance } from '@/types';

const numberFormat = new Intl.NumberFormat('en-GB');

export function formatNumber(value: number): string {
  return numberFormat.format(Math.round(value));
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatSigned(value: number, digits = 1): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${Math.abs(value).toFixed(digits)}`;
}

export function formatDate(iso: string): string {
  // Accept bare years and year-months as well as full dates.
  const parts = iso.split('-');
  if (parts.length === 1) return iso;
  const date = new Date(parts.length === 2 ? `${iso}-01` : iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    day: parts.length === 3 ? 'numeric' : undefined,
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatDateRange(start: string, end?: string): string {
  if (!end) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export const PROVENANCE_LABEL: Record<Provenance, string> = {
  official: 'Official',
  reported: 'Reported',
  modelled: 'Modelled',
  poll: 'Survey',
};

export const PROVENANCE_HELP: Record<Provenance, string> = {
  official: 'Published by the IEC or another primary official record.',
  reported:
    'The IEC announced these figures, but has not published them in a machine-readable archive. Recorded consistently by observer missions and standard secondary tables.',
  modelled:
    'Produced by this platform’s model from official inputs. Not a real-world observation. See Methodology.',
  poll: 'Survey data from a named pollster, subject to its own margin of error.',
};

/**
 * Win probabilities, never stated as a flat 0 or 100.
 *
 * This model is not validated against out-of-sample elections, so claiming
 * certainty would overstate what it can know. A bloc that leads every
 * simulation is reported as "greater than 99 per cent", which is both
 * honest and standard practice in published forecasting.
 */
export function formatProbability(value: number): string {
  if (value >= 99.5) return '>99%';
  if (value <= 0.5 && value > 0) return '<1%';
  if (value === 0) return '<1%';
  return `${Math.round(value)}%`;
}

/** Days between today and an ISO date. Negative once the date has passed. */
export function daysUntil(iso: string, from: Date = new Date()): number {
  const target = new Date(`${iso}T00:00:00Z`);
  const today = new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()),
  );
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

/** Download a string as a file, client-side. */
export function downloadFile(filename: string, contents: string, mime: string): void {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/** Minimal CSV writer: quotes fields containing a comma, quote or newline. */
export function toCsv(rows: (string | number)[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const text = String(cell);
          return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
        })
        .join(','),
    )
    .join('\n');
}
