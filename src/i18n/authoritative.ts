import type { TranslationKey } from './en';

/**
 * Keys that are always served in English, even when a translation exists.
 *
 * These are the statistical and legal disclaimers: the sentences that tell a
 * reader what this platform is not, what it may not be cited as, and who
 * alone can declare a result. Showing an unreviewed draft translation of one
 * of them, in the platform's own voice, would be worse than showing nothing:
 * a reader in Wolof would receive a weakened or mangled version of exactly
 * the warning they most need, with no way to tell.
 *
 * So the resolver refuses to translate them. It returns the English wording
 * with the status `english-authoritative`, and the interface prints a short
 * translated note above it (`disclaimer.englishOnly.note`) explaining why
 * this one block is not in the reader's language.
 *
 * A key leaves this list when a named native speaker has reviewed and signed
 * off the translated wording for every shipped locale, not before, and not
 * because the draft "reads fine".
 */
export const AUTHORITATIVE_EN_ONLY: readonly TranslationKey[] = [
  'disclaimer.model.title',
  'disclaimer.model.body',
  'disclaimer.model.methodologyLink',
  'regions.notice.title',
  'regions.notice.body',
  'regions.notice.estimates',
  'data.notice.title',
  'data.notice.body',
  'race.notice.title',
  'race.notice.body',
  'meth.limitation.title',
  'meth.limitation.body',
  'meth.limitation.notValidated',
  'meth.limitation.withinTheModel',
  'forecast.areas.notice',
  'forecast.areas.noticeModelled',
];

const authoritativeSet = new Set<string>(AUTHORITATIVE_EN_ONLY);

export function isAuthoritativeEnglishOnly(key: TranslationKey): boolean {
  return authoritativeSet.has(key);
}
