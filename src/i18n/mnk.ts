import type { PartialDictionary } from './en';

/**
 * Mandinka — UNREVIEWED DRAFT, and thinner than the Wolof draft.
 *
 * Provenance, stated plainly: these strings were drafted by a machine, not
 * by a Mandinka speaker, and nobody has reviewed them. The coverage here is
 * narrower than Wolof on purpose. Where a plausible-looking rendering could
 * not be produced with any confidence, the key is simply left out rather
 * than filled with a guess: it then falls back to English, the fallback is
 * reported by `resolve()` in ./core.ts, and the banner in Layout.tsx counts
 * it and tells the reader. A visible gap is reviewable. A confident-sounding
 * wrong translation of "Modelled" on an election figure is not — it is the
 * exact failure mode this platform exists to avoid.
 *
 * Mandinka is the most widely spoken first language in The Gambia, so this
 * file is the highest-value review target in the repository.
 *
 * The statistical and legal disclaimers are not here and cannot be put here:
 * see ./authoritative.ts.
 */
export const mnk: PartialDictionary = {
  /* Language switching */
  'lang.label': 'Kaŋo',
  'lang.choose': 'Kaŋo tomboŋ',

  /* Navigation */
  'nav.overview': 'Kuwolu bee',
  'nav.race': '2026 Tomboŋo',
  'nav.regions': 'Tundoolu',
  'nav.history': 'Taarikoo',
  'nav.data': 'Kibaaroolu',
  /* nav.forecast, nav.methodology: no confident rendering — falls back to
     English and is counted as untranslated. */

  /* Page titles */
  'race.title': '2026 Tomboŋo',
  'regions.title': 'Tomboŋo tundoolu',
  'history.title': 'Tomboŋolu taarikoo',
  'data.title': 'Kibaaroolu niŋ a daalu',

  /* Provenance labels */
  'prov.official.label': 'Ofisiyeli',
  'prov.reported.label': 'Kibaaroo',
  /* prov.modelled.label, prov.poll.label: no confident rendering. These two
     are the most important words on the platform, so a guess is worse than
     the English fallback. Highest review priority. */

  /* The plain-language gloss that sits above the English disclaimer */
  'disclaimer.gloss.title': 'Kuma sutuŋo',
  'disclaimer.gloss.body':
    'Ñiŋ maŋ ke tomboŋo kuntewo ti. A mu masiŋo la kaañaŋo le ti. IEC dammaa si a fo noo meŋ ye nɔɔ soto. Kana a fo ko ñiŋ limoolu mu tomboŋo kuntewo le ti.',

  /* Common controls */
  'common.yes': 'Haa',
  'common.no': 'Hanii',
  'common.sources': 'A daalu: ',
  'chrome.menu': 'Menu',

  /* Offline */
  'offline.badge': 'Internet te keriŋ',
};
