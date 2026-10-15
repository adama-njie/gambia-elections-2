import { DATA_LAST_UPDATED } from '@/data/freshness';
import { T, useT } from '@/i18n';
import { formatDate } from '@/lib/format';
import { useOfflineState } from '@/pwa/useOffline';

/** Days between an ISO timestamp and now. Negative values clamp to zero. */
function daysSince(iso: string): number {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 0;
  return Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
}

/** Full date and time, for "this copy was saved on …". */
function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** Anything cached for longer than this gets an explicit staleness warning. */
const STALE_AFTER_DAYS = 7;

/**
 * The offline and update banner.
 *
 * Rendered directly under the header on every page. It exists to keep one
 * promise: the app may be served from a copy on the device, but it will not
 * pretend that copy is current. When offline it names the date the copy was
 * saved, and past a week it says how long ago that was and points at the
 * IEC.
 */
export function OfflineNotice() {
  const t = useT();
  const { online, meta, updateReady, applyUpdate } = useOfflineState();

  if (updateReady) {
    return (
      <div className="no-print border-b border-sky-300/70 bg-sky-50 text-sky-950 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 text-sm sm:px-6">
          <span className="font-semibold">{t('offline.updateTitle')}</span>
          <span className="min-w-0">{t('offline.updateBody')}</span>
          <button
            type="button"
            onClick={applyUpdate}
            className="ml-auto shrink-0 rounded-lg bg-sky-700 px-3 py-1 text-xs font-semibold text-white transition hover:bg-sky-800 dark:bg-sky-600 dark:hover:bg-sky-500"
          >
            {t('offline.updateAction')}
          </button>
        </div>
      </div>
    );
  }

  if (online) return null;

  const stale = meta?.cachedAt ? daysSince(meta.cachedAt) : null;

  return (
    <div
      role="status"
      className="no-print border-b border-amber-300/70 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100"
    >
      <div className="mx-auto max-w-7xl px-4 py-2 text-sm leading-relaxed sm:px-6">
        <p>
          <span className="mr-2 inline-flex items-center rounded bg-amber-200/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide dark:bg-amber-500/25">
            {t('offline.badge')}
          </span>
          <span className="font-semibold">{t('offline.title')}</span> {t('offline.body')}
        </p>
        <p className="mt-0.5 text-xs">
          {t('freshness.dataAsOf', { date: formatDate(DATA_LAST_UPDATED) })}{' '}
          {meta?.cachedAt
            ? t('freshness.cachedAt', { date: formatDateTime(meta.cachedAt) })
            : t('freshness.unknown')}
          {stale !== null && stale >= STALE_AFTER_DAYS && (
            <>
              {' '}
              <T
                k="freshness.staleWarning"
                vars={{
                  days: stale,
                  iec: (
                    <a
                      href="https://iec.gm/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline underline-offset-2"
                    >
                      {t('common.iecName')}
                    </a>
                  ),
                }}
              />
            </>
          )}
        </p>
      </div>
    </div>
  );
}

/**
 * The standing freshness line: what the dataset is, and when this copy of
 * it was saved. Rendered in the footer of every page and on the Data page,
 * so the answer to "how old is this?" is never more than one scroll away.
 */
export function DataFreshness({ className = '' }: { className?: string }) {
  const t = useT();
  const { online, controlled, meta } = useOfflineState();

  return (
    <p className={`muted text-xs leading-relaxed ${className}`}>
      {t('freshness.dataAsOf', { date: formatDate(DATA_LAST_UPDATED) })}
      {controlled && meta?.cachedAt && (
        <> {t('freshness.cachedAt', { date: formatDateTime(meta.cachedAt) })}</>
      )}
      {!controlled && online && <> {t('freshness.installBody')}</>}
    </p>
  );
}
