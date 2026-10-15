import { en, type TranslationKey } from '@/i18n/en';
import type { Provenance } from '@/types';

/**
 * Numbers and dates stay in en-GB regardless of the interface language.
 *
 * Mandinka, Wolof and Pulaar have no CLDR month names or number formats to
 * draw on, so an Intl locale built from the language tag would silently fall
 * back to the browser default, which on a phone configured in French would
 * render a Wolof page's dates in French. One stable, documented format is
 * more honest than that, and digits are read the same way in all four
 * languages. Revisit if and when CLDR data lands.
 */
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

/**
 * Provenance labels and help text, derived from the English dictionary so
 * the two cannot drift apart.
 *
 * These are the English wordings, used where no React context is available:
 * the CSV and JSON exports, and the data contract tests. Inside the
 * interface, components read `prov.*.label` and `prov.*.help` through the
 * i18n layer instead, so the badge follows the reader's language.
 */
export const PROVENANCE_LABEL: Record<Provenance, string> = {
  official: en['prov.official.label'],
  reported: en['prov.reported.label'],
  modelled: en['prov.modelled.label'],
  poll: en['prov.poll.label'],
};

export const PROVENANCE_HELP: Record<Provenance, string> = {
  official: en['prov.official.help'],
  reported: en['prov.reported.help'],
  modelled: en['prov.modelled.help'],
  poll: en['prov.poll.help'],
};

/** The i18n keys for a provenance level, for components that translate. */
export const PROVENANCE_LABEL_KEY = {
  official: 'prov.official.label',
  reported: 'prov.reported.label',
  modelled: 'prov.modelled.label',
  poll: 'prov.poll.label',
} as const satisfies Record<Provenance, TranslationKey>;

export const PROVENANCE_HELP_KEY = {
  official: 'prov.official.help',
  reported: 'prov.reported.help',
  modelled: 'prov.modelled.help',
  poll: 'prov.poll.help',
} as const satisfies Record<Provenance, TranslationKey>;

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
