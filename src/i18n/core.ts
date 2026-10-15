import { isAuthoritativeEnglishOnly } from './authoritative';
import { en, type Dictionary, type PartialDictionary, type TranslationKey } from './en';
import { ff } from './ff';
import { mnk } from './mnk';
import { wo } from './wo';

/* ------------------------------------------------------------------ */
/* Locales                                                             */
/* ------------------------------------------------------------------ */

export const LOCALE_CODES = ['en', 'mnk', 'wo', 'ff'] as const;
export type Locale = (typeof LOCALE_CODES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export interface LocaleMeta {
  code: Locale;
  /** The language's own name, which is what belongs in a language switcher. */
  nativeName: string;
  /** English name, for the `title` attribute and for screen readers in English. */
  englishName: string;
  /** Value for the html `lang` attribute. */
  htmlLang: string;
  /**
   * Whether a native speaker has reviewed this locale. `complete` means the
   * dictionary is the source of truth; `unreviewed-draft` means every string
   * in it is a machine draft awaiting review, and the interface says so.
   */
  status: 'complete' | 'unreviewed-draft';
}

export const LOCALES: Record<Locale, LocaleMeta> = {
  en: {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
    htmlLang: 'en',
    status: 'complete',
  },
  mnk: {
    code: 'mnk',
    nativeName: 'Mandinka',
    englishName: 'Mandinka',
    htmlLang: 'mnk',
    status: 'unreviewed-draft',
  },
  wo: {
    code: 'wo',
    nativeName: 'Wolof',
    englishName: 'Wolof',
    htmlLang: 'wo',
    status: 'unreviewed-draft',
  },
  ff: {
    code: 'ff',
    nativeName: 'Pulaar',
    englishName: 'Pulaar (Fula)',
    htmlLang: 'ff',
    status: 'unreviewed-draft',
  },
};

export const LOCALE_LIST: LocaleMeta[] = LOCALE_CODES.map((code) => LOCALES[code]);

/** The dictionaries themselves. English is the only complete one. */
export const DICTIONARIES: { en: Dictionary } & Record<
  Exclude<Locale, 'en'>,
  PartialDictionary
> = { en, mnk, wo, ff };

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALE_CODES as readonly string[]).includes(value);
}

/* ------------------------------------------------------------------ */
/* Resolution: the explicit-fallback contract                         */
/* ------------------------------------------------------------------ */

/**
 * Why a string reads the way it does. Every lookup returns one of these, so
 * fallback is a stated outcome rather than something that quietly happens
 * inside a `??`.
 *
 * - `translated`            the active locale supplied this string.
 * - `fallback-en`          the active locale has no entry, so English is
 *                           shown. Expected and acceptable; counted and
 *                           reported to the reader, never silent.
 * - `english-authoritative` the key is in AUTHORITATIVE_EN_ONLY, so English
 *                           is shown deliberately even if a draft exists.
 * - `missing`               the key is not in English either. A bug: the
 *                           type system should make it unreachable, and it
 *                           is logged loudly in development.
 */
export type Resolution =
  | 'translated'
  | 'fallback-en'
  | 'english-authoritative'
  | 'missing';

export interface Resolved {
  /** The text to render, after placeholder substitution. */
  text: string;
  /** The raw template, before substitution. Useful in tests and tooling. */
  template: string;
  resolution: Resolution;
  key: TranslationKey;
  locale: Locale;
}

export type Vars = Record<string, string | number>;

/** Substitute `{name}` placeholders. Unknown placeholders are left intact. */
export function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : whole,
  );
}

/**
 * The single lookup path for the whole app. Returns the text *and* why.
 *
 * Nothing here falls back silently: a caller that only wants the string uses
 * `resolve(...).text`, and the `resolution` field is still computed, so the
 * banner and the dev-mode warning can both see it.
 */
export function resolve(locale: Locale, key: TranslationKey, vars?: Vars): Resolved {
  const english = en[key] as string | undefined;

  if (english === undefined) {
    // Unreachable through the type system; reachable through a cast or a
    // dictionary loaded at runtime. Show the key rather than an empty space,
    // so the break is obvious instead of invisible.
    return { text: key, template: key, resolution: 'missing', key, locale };
  }

  if (locale === 'en' || isAuthoritativeEnglishOnly(key)) {
    return {
      text: interpolate(english, vars),
      template: english,
      resolution: locale === 'en' ? 'translated' : 'english-authoritative',
      key,
      locale,
    };
  }

  const translated = DICTIONARIES[locale][key];
  if (translated === undefined || translated.length === 0) {
    return {
      text: interpolate(english, vars),
      template: english,
      resolution: 'fallback-en',
      key,
      locale,
    };
  }

  return {
    text: interpolate(translated, vars),
    template: translated,
    resolution: 'translated',
    key,
    locale,
  };
}

/* ------------------------------------------------------------------ */
/* Coverage reporting                                                  */
/* ------------------------------------------------------------------ */

export interface Coverage {
  locale: Locale;
  /** Keys this locale supplies and the resolver actually uses. */
  translated: number;
  /** Keys falling back to English because the locale has no entry. */
  fallback: number;
  /** Keys held in English on purpose. Not a gap. */
  authoritativeEnglish: number;
  /** Keys eligible for translation at all, i.e. total minus authoritative. */
  translatable: number;
  total: number;
}

/**
 * Count, for a locale, how much of the interface is actually in that
 * language. This drives the banner: a reader is told "412 of 486 strings are
 * still in English", which is a fact about the build, not a guess.
 */
export function coverage(locale: Locale): Coverage {
  const keys = Object.keys(en) as TranslationKey[];
  let translated = 0;
  let fallback = 0;
  let authoritativeEnglish = 0;

  for (const key of keys) {
    switch (resolve(locale, key).resolution) {
      case 'translated':
        translated += 1;
        break;
      case 'fallback-en':
        fallback += 1;
        break;
      case 'english-authoritative':
        authoritativeEnglish += 1;
        break;
      case 'missing':
        break;
    }
  }

  return {
    locale,
    translated,
    fallback,
    authoritativeEnglish,
    translatable: keys.length - authoritativeEnglish,
    total: keys.length,
  };
}
