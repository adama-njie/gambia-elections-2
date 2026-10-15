import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_LOCALE,
  LOCALES,
  coverage,
  isLocale,
  resolve,
  type Coverage,
  type Locale,
  type Resolved,
  type Vars,
} from './core';
import type { TranslationKey } from './en';

/**
 * The React binding for the i18n layer. Three things only:
 *
 *   t(key, vars)   the string, for attributes and plain text
 *   tr(key, vars)  the full Resolved record, when a caller needs to know
 *                  whether it is looking at a translation or a fallback
 *   <T k vars />   the same lookup, but placeholders may be React nodes,
 *                  so a sentence with a link or a bold run stays one entry
 *                  in the dictionary instead of three fragments
 *
 * Deliberately not a dependency: this is ~120 lines against ~40kB of
 * i18next, and the app needs none of the rest of it.
 */

const STORAGE_KEY = 'gm26:locale';

interface I18nValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: TranslationKey, vars?: Vars) => string;
  tr: (key: TranslationKey, vars?: Vars) => Resolved;
  coverage: Coverage;
}

const I18nContext = createContext<I18nValue | null>(null);

/** Same try/catch shape as useTheme: blocked storage must not break the app. */
function readStored(): Locale | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    // Private browsing or blocked storage. Fall back to the browser setting.
    return null;
  }
}

/** The browser's preferred language, if it is one we ship. */
function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const candidates = [navigator.language, ...(navigator.languages ?? [])];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const base = candidate.toLowerCase().split('-')[0];
    if (isLocale(base)) return base;
    // Mandinka also appears as "man" (Mandingo) in some browser builds.
    if (base === 'man') return 'mnk';
  }
  return DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStored() ?? detectLocale());

  useEffect(() => {
    // The html lang attribute drives screen-reader pronunciation and
    // hyphenation, so it has to follow the switcher.
    document.documentElement.lang = LOCALES[locale].htmlLang;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Not fatal: the choice still applies for this session.
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);

  const tr = useCallback(
    (key: TranslationKey, vars?: Vars): Resolved => {
      const resolved = resolve(locale, key, vars);
      if (resolved.resolution === 'missing' && import.meta.env.DEV) {
        // A key with no English entry is a bug, not a translation gap.
        console.error(`[i18n] no English entry for key "${key}"`);
      }
      return resolved;
    },
    [locale],
  );

  const t = useCallback((key: TranslationKey, vars?: Vars) => tr(key, vars).text, [tr]);

  const value = useMemo<I18nValue>(
    () => ({ locale, setLocale, t, tr, coverage: coverage(locale) }),
    [locale, setLocale, t, tr],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside <I18nProvider>');
  return value;
}

/** The common case: just the string. */
export function useT(): (key: TranslationKey, vars?: Vars) => string {
  return useI18n().t;
}

/**
 * Split a template on its `{name}` placeholders and substitute React nodes.
 * Unknown placeholders are left visible as `{name}`, which makes a mismatch
 * between a translation and its call site obvious on screen rather than
 * silently dropping content.
 */
function renderTemplate(
  template: string,
  nodes: Record<string, React.ReactNode> | undefined,
): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const pattern = /\{(\w+)\}/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(template)) !== null) {
    if (match.index > last) out.push(template.slice(last, match.index));
    const name = match[1]!;
    const node = nodes?.[name];
    out.push(
      node === undefined ? (
        match[0]
      ) : (
        <React.Fragment key={`${name}-${(index += 1)}`}>{node}</React.Fragment>
      ),
    );
    last = match.index + match[0].length;
  }
  if (last < template.length) out.push(template.slice(last));
  return out;
}

/**
 * A translated sentence whose placeholders may be React nodes.
 *
 * Note that this reads `template`, not `text`: substitution happens here so
 * that a `<Link>` or `<strong>` can be passed in, which is what keeps a
 * whole sentence in one dictionary entry.
 */
export function T({
  k,
  vars,
}: {
  k: TranslationKey;
  vars?: Record<string, React.ReactNode>;
}) {
  const { tr } = useI18n();
  return <>{renderTemplate(tr(k).template, vars)}</>;
}
