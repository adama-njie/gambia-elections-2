import type { PartialDictionary } from './en';

/**
 * Pulaar / Fula — UNREVIEWED DRAFT, and thin.
 *
 * Provenance, stated plainly: drafted by a machine, not by a Pulaar speaker,
 * and reviewed by nobody. Coverage is deliberately narrow. Keys that could
 * not be rendered with any confidence are left out rather than guessed; they
 * fall back to English, `resolve()` in ./core.ts reports the fallback, and
 * the banner in Layout.tsx counts it and says so to the reader.
 *
 * Orthography note for reviewers: this file uses the standard Pulaar
 * characters ɓ, ɗ, ƴ and ŋ. If the review settles on a different
 * orthography for The Gambia specifically, change it here and the whole
 * interface follows — nothing outside this file encodes Pulaar spelling.
 *
 * The statistical and legal disclaimers are not here and cannot be put here:
 * see ./authoritative.ts.
 */
export const ff: PartialDictionary = {
  /* Language switching */
  'lang.label': 'Ɗemngal',
  'lang.choose': 'Suɓo ɗemngal',

  /* Navigation */
  'nav.race': 'Woote 2026',
  'nav.regions': 'Diiwanuuji',
  'nav.history': 'Taariika',
  'nav.data': 'Kabaruuji',
  /* nav.overview, nav.forecast, nav.methodology: no confident rendering —
     falls back to English and is counted as untranslated. */

  /* Page titles */
  'race.title': 'Woote 2026',
  'history.title': 'Taariika woote',
  'data.title': 'Kabaruuji e iwdi majji',

  /* Provenance labels */
  'prov.official.label': 'Ofisiyel',
  'prov.reported.label': 'Kabaaru',
  /* prov.modelled.label, prov.poll.label: no confident rendering. Highest
     review priority, because these two words are what stop a modelled
     estimate being read as a count. */

  /* The plain-language gloss that sits above the English disclaimer */
  'disclaimer.gloss.title': 'E raɓɓiɗinaade',
  'disclaimer.gloss.body':
    'Ɗum wonaa njeñtudi woote. Ko hiisa ordinateer waɗi. Ko IEC tan waawi wiide hay to foolii. Hoto wiide tonngoode woo ɗoo ko njeñtudi woote.',

  /* Common controls */
  'common.yes': 'Eey',
  'common.no': 'Alaa',
  'common.sources': 'Iwdi: ',
  'chrome.menu': 'Menu',

  /* Offline */
  'offline.badge': 'Alaa internet',
};
