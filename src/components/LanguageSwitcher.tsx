import { LOCALES, LOCALE_LIST, isLocale, useI18n, useT } from '@/i18n';

/**
 * The language switcher, next to the theme toggle in the header.
 *
 * A native `<select>` on purpose: it is keyboard-accessible, it works at any
 * viewport width without a popover, it renders in the platform's own list UI
 * on a phone, and it costs nothing. The option labels are each language's
 * own name, since a reader looking for Wolof is looking for "Wolof", not for
 * whatever English calls it.
 */
export default function LanguageSwitcher() {
  const t = useT();
  const { locale, setLocale } = useI18n();

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t('lang.label')}</span>
      <span aria-hidden="true" className="muted pointer-events-none absolute left-2 text-sm">
        ⌾
      </span>
      <select
        value={locale}
        onChange={(event) => {
          const next = event.target.value;
          if (isLocale(next)) setLocale(next);
        }}
        title={t('lang.choose')}
        className="hairline cursor-pointer appearance-none rounded-lg border bg-transparent py-1.5 pl-7 pr-2 text-sm font-medium transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:hover:bg-white/5 dark:focus-visible:outline-accent"
      >
        {LOCALE_LIST.map((meta) => (
          <option key={meta.code} value={meta.code}>
            {meta.nativeName}
            {meta.status === 'unreviewed-draft' ? ' (draft)' : ''}
          </option>
        ))}
      </select>
    </label>
  );
}

/**
 * The draft-translation banner.
 *
 * Shown on every page while a non-English locale is active, because a reader
 * is entitled to know that the interface they are reading has not been
 * checked by anyone who speaks their language. The numbers come from
 * `coverage()`, so they are a fact about this build rather than a vague
 * apology, and they fall as the translation is reviewed.
 */
export function DraftLocaleBanner() {
  const t = useT();
  const { locale, coverage } = useI18n();
  const meta = LOCALES[locale];

  if (meta.status === 'complete') return null;

  const language = meta.nativeName;

  return (
    /* Informational, not a warning: amber is reserved for the offline and
       not-official notices, so a reader can tell the two apart at a glance
       when both are showing. */
    <div className="no-print border-b border-sky-300/70 bg-sky-50 text-sky-950 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100">
      <div className="mx-auto max-w-7xl px-4 py-2 text-xs leading-relaxed sm:px-6">
        <p>
          <span className="font-semibold">{t('i18n.draft.title', { language })}</span>{' '}
          {t('i18n.draft.body', {
            language,
            translated: coverage.translated,
            total: coverage.translatable,
          })}
        </p>
        <p className="mt-0.5">{t('i18n.draft.reviewNote', { language })}</p>
      </div>
    </div>
  );
}
