import React from 'react';
import { Link } from 'react-router-dom';
import { getSources } from '@/data/sources';
import { PROVENANCE_HELP, PROVENANCE_LABEL, formatPercent } from '@/lib/format';
import type { Provenance } from '@/types';

/* ------------------------------------------------------------------ */
/* Provenance badge                                                    */
/* ------------------------------------------------------------------ */

const PROVENANCE_STYLE: Record<Provenance, string> = {
  official: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300',
  reported: 'bg-sky-100 text-sky-900 dark:bg-sky-500/15 dark:text-sky-300',
  modelled: 'bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300',
  poll: 'bg-violet-100 text-violet-900 dark:bg-violet-500/15 dark:text-violet-300',
};

/**
 * The single most important component in the app. Any figure that is not a
 * primary official record has to wear one of these, so a reader can never
 * mistake a projection for a result.
 */
export function ProvenanceBadge({
  provenance,
  className = '',
}: {
  provenance: Provenance;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${PROVENANCE_STYLE[provenance]} ${className}`}
      title={PROVENANCE_HELP[provenance]}
    >
      {PROVENANCE_LABEL[provenance]}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Layout primitives                                                   */
/* ------------------------------------------------------------------ */

export function Card({
  children,
  className = '',
  as: Tag = 'section',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article' | 'aside';
}) {
  return <Tag className={`card card-pad ${className}`}>{children}</Tag>;
}

export function SectionHeading({
  title,
  subtitle,
  provenance,
  action,
  id,
}: {
  title: string;
  subtitle?: React.ReactNode;
  provenance?: Provenance;
  action?: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2
          id={id}
          className="flex flex-wrap items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl"
        >
          {title}
          {provenance && <ProvenanceBadge provenance={provenance} />}
        </h2>
        {subtitle && <p className="muted mt-1 text-sm">{subtitle}</p>}
      </div>
      {action && <div className="no-print shrink-0">{action}</div>}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-6 animate-fade-in">
      {eyebrow && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary dark:text-accent">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      {lede && <p className="muted mt-2 max-w-3xl text-sm leading-relaxed sm:text-base">{lede}</p>}
      {children}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Stat tile                                                           */
/* ------------------------------------------------------------------ */

export function Stat({
  label,
  value,
  sub,
  provenance,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  provenance?: Provenance;
  accent?: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="muted text-xs font-medium uppercase tracking-wide">{label}</p>
        {provenance && <ProvenanceBadge provenance={provenance} />}
      </div>
      <p
        className="tabular mt-2 text-2xl font-bold leading-tight sm:text-3xl"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      {sub && <p className="muted mt-1 text-xs leading-snug">{sub}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Share bar                                                           */
/* ------------------------------------------------------------------ */

export function ShareBar({
  label,
  share,
  color,
  secondary,
  max = 100,
  interval,
}: {
  label: React.ReactNode;
  share: number;
  color: string;
  secondary?: React.ReactNode;
  max?: number;
  /** Lower and upper bound as percentages, drawn as a whisker. */
  interval?: [number, number];
}) {
  const width = Math.max(0, Math.min(100, (share / max) * 100));
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
        <span className="min-w-0 truncate font-medium">{label}</span>
        <span className="tabular shrink-0 font-semibold">{formatPercent(share)}</span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-black/[.07] dark:bg-white/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
      {interval && (
        <div className="relative mt-1 h-1.5 w-full" aria-hidden="true">
          <div
            className="absolute top-1/2 h-px -translate-y-1/2 bg-current opacity-30"
            style={{
              left: `${Math.max(0, Math.min(100, (interval[0] / max) * 100))}%`,
              width: `${Math.max(0, Math.min(100, ((interval[1] - interval[0]) / max) * 100))}%`,
            }}
          />
        </div>
      )}
      {secondary && <p className="muted mt-0.5 text-xs">{secondary}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Citations                                                           */
/* ------------------------------------------------------------------ */

export function Citations({ ids, className = '' }: { ids: string[]; className?: string }) {
  const sources = getSources(ids);
  if (sources.length === 0) return null;
  return (
    <p className={`muted text-xs leading-relaxed ${className}`}>
      <span className="font-semibold">Sources: </span>
      {sources.map((source, index) => (
        <React.Fragment key={source.id}>
          {index > 0 && '; '}
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted underline-offset-2 hover:text-primary dark:hover:text-accent"
          >
            {source.publisher}
          </a>
        </React.Fragment>
      ))}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Notices                                                             */
/* ------------------------------------------------------------------ */

export function Notice({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warn';
  title?: string;
  children: React.ReactNode;
}) {
  const style =
    tone === 'warn'
      ? 'border-amber-300/70 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100'
      : 'border-sky-300/70 bg-sky-50 text-sky-950 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100';
  return (
    <div className={`rounded-xl border p-4 text-sm leading-relaxed ${style}`}>
      {title && <p className="mb-1 font-semibold">{title}</p>}
      {children}
    </div>
  );
}

/** The standing disclaimer. Rendered in the footer of every page. */
export function ModelDisclaimer() {
  return (
    <Notice tone="warn" title="This is a projection, not a prediction of the result">
      Forecasts on this platform are produced by an openly documented statistical model from
      historical results, published polling and user-set assumptions. They are not forecasts of
      certified results, they are not endorsed by the Independent Electoral Commission, and they
      should never be cited as a count. Only the IEC can declare a result. Read the{' '}
      <Link to="/methodology" className="font-semibold underline underline-offset-2">
        methodology
      </Link>{' '}
      before quoting any figure.
    </Notice>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs                                                               */
/* ------------------------------------------------------------------ */

export function TabList<T extends string>({
  tabs,
  active,
  onChange,
  label,
}: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="no-print flex flex-wrap gap-1">
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              selected
                ? 'bg-primary text-white'
                : 'hover:bg-black/5 dark:hover:bg-white/5 muted'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="hairline rounded-xl border border-dashed p-8 text-center">
      <p className="font-medium">{title}</p>
      {children && <p className="muted mx-auto mt-1 max-w-md text-sm">{children}</p>}
    </div>
  );
}
