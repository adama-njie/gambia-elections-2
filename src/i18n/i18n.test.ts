import { describe, expect, it } from 'vitest';
import { AUTHORITATIVE_EN_ONLY } from './authoritative';
import {
  DICTIONARIES,
  LOCALES,
  LOCALE_CODES,
  coverage,
  interpolate,
  isLocale,
  resolve,
  type Locale,
} from './core';
import { EN_KEYS, en, type TranslationKey } from './en';

/**
 * The i18n contract. Two rules do the real work:
 *
 *   - English is complete, and is the only dictionary allowed to define a
 *     key. A locale cannot introduce a string the interface never asks for.
 *   - Fallback is explicit. Every lookup reports whether it returned a
 *     translation, an English fallback, or English on purpose, and the
 *     disclaimers can only ever return the last of those.
 */

const NON_EN = LOCALE_CODES.filter((code): code is Exclude<Locale, 'en'> => code !== 'en');

describe('English dictionary', () => {
  it('has no empty entries', () => {
    for (const key of EN_KEYS) {
      expect(en[key].length, `empty English entry for "${key}"`).toBeGreaterThan(0);
    }
  });

  it('has no duplicate keys', () => {
    expect(new Set(EN_KEYS).size).toBe(EN_KEYS.length);
  });

  it('is the complete dictionary: every key resolves as a translation', () => {
    for (const key of EN_KEYS) {
      expect(resolve('en', key).resolution).toBe('translated');
    }
  });
});

describe('locale coverage', () => {
  it.each(NON_EN)('%s declares no key that English lacks', (locale) => {
    const englishKeys = new Set<string>(EN_KEYS);
    const unknown = Object.keys(DICTIONARIES[locale]).filter((key) => !englishKeys.has(key));
    expect(unknown, `${locale} declares keys absent from English`).toEqual([]);
  });

  it.each(NON_EN)('%s has no empty entries', (locale) => {
    for (const [key, value] of Object.entries(DICTIONARIES[locale])) {
      expect(value?.length, `empty ${locale} entry for "${key}"`).toBeGreaterThan(0);
    }
  });

  it.each(NON_EN)('%s falls back to English for every key it does not define', (locale) => {
    const dictionary = DICTIONARIES[locale];
    for (const key of EN_KEYS) {
      const resolved = resolve(locale, key);
      const defined = dictionary[key] !== undefined;
      const authoritative = (AUTHORITATIVE_EN_ONLY as readonly string[]).includes(key);

      if (authoritative) {
        expect(resolved.resolution).toBe('english-authoritative');
        expect(resolved.text).toBe(en[key]);
      } else if (defined) {
        expect(resolved.resolution).toBe('translated');
      } else {
        expect(resolved.resolution).toBe('fallback-en');
        expect(resolved.text).toBe(en[key]);
      }
    }
  });

  it('never returns an empty string for any key in any locale', () => {
    for (const locale of LOCALE_CODES) {
      for (const key of EN_KEYS) {
        expect(resolve(locale, key).text.length).toBeGreaterThan(0);
      }
    }
  });

  it('counts coverage consistently with the dictionaries', () => {
    for (const locale of LOCALE_CODES) {
      const report = coverage(locale);
      expect(report.translated + report.fallback + report.authoritativeEnglish).toBe(
        EN_KEYS.length,
      );
      expect(report.translatable).toBe(EN_KEYS.length - report.authoritativeEnglish);
    }
    // English is complete by construction.
    expect(coverage('en').fallback).toBe(0);
    expect(coverage('en').translated).toBe(EN_KEYS.length);
  });
});

describe('authoritative English-only keys', () => {
  it('all exist in the English dictionary', () => {
    for (const key of AUTHORITATIVE_EN_ONLY) {
      expect(EN_KEYS).toContain(key);
    }
  });

  it('are never served from a translation, even when one is defined', () => {
    // Simulate a locale that has drafted a disclaimer anyway.
    const key: TranslationKey = 'disclaimer.model.body';
    const draft = DICTIONARIES.wo as Record<string, string>;
    draft[key] = 'A drafted rendering that must never be shown.';
    try {
      const resolved = resolve('wo', key);
      expect(resolved.resolution).toBe('english-authoritative');
      expect(resolved.text).toBe(en[key]);
    } finally {
      delete draft[key];
    }
  });

  it('covers the model disclaimer and every page-level not-official notice', () => {
    for (const key of [
      'disclaimer.model.title',
      'disclaimer.model.body',
      'regions.notice.body',
      'data.notice.body',
      'race.notice.body',
      'meth.limitation.body',
      'forecast.areas.notice',
    ] as TranslationKey[]) {
      expect(AUTHORITATIVE_EN_ONLY).toContain(key);
    }
  });

  it('leaves the plain-language gloss translatable, so the core warning can reach readers', () => {
    expect(AUTHORITATIVE_EN_ONLY).not.toContain('disclaimer.gloss.body');
    for (const locale of NON_EN) {
      expect(resolve(locale, 'disclaimer.gloss.body').resolution).toBe('translated');
    }
  });
});

describe('placeholders', () => {
  it('substitutes named values', () => {
    expect(interpolate('{a} and {b}', { a: 'one', b: 2 })).toBe('one and 2');
  });

  it('leaves an unknown placeholder visible rather than dropping content', () => {
    expect(interpolate('{a} and {b}', { a: 'one' })).toBe('one and {b}');
  });

  it('every placeholder in a translation also exists in its English entry', () => {
    const names = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]!).sort();
    for (const locale of NON_EN) {
      for (const [key, value] of Object.entries(DICTIONARIES[locale])) {
        if (value === undefined) continue;
        const english = en[key as TranslationKey];
        expect(names(value), `${locale} "${key}" placeholders`).toEqual(names(english));
      }
    }
  });
});

describe('locale metadata', () => {
  it('describes every shipped locale', () => {
    for (const code of LOCALE_CODES) {
      const meta = LOCALES[code];
      expect(meta.code).toBe(code);
      expect(meta.nativeName.length).toBeGreaterThan(0);
      expect(meta.englishName.length).toBeGreaterThan(0);
      expect(meta.htmlLang.length).toBeGreaterThan(0);
    }
  });

  it('marks English complete and every other locale an unreviewed draft', () => {
    expect(LOCALES.en.status).toBe('complete');
    for (const code of NON_EN) {
      expect(
        LOCALES[code].status,
        `${code} must stay an unreviewed draft until a native speaker signs it off`,
      ).toBe('unreviewed-draft');
    }
  });

  it('recognises its own codes and rejects others', () => {
    for (const code of LOCALE_CODES) expect(isLocale(code)).toBe(true);
    for (const value of ['fr', '', 'EN', null, undefined, 7]) expect(isLocale(value)).toBe(false);
  });
});

describe('unknown keys', () => {
  it('reports "missing" and shows the key rather than an empty space', () => {
    const resolved = resolve('en', 'not.a.real.key' as TranslationKey);
    expect(resolved.resolution).toBe('missing');
    expect(resolved.text).toBe('not.a.real.key');
  });
});
