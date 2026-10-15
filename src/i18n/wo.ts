import type { PartialDictionary } from './en';

/**
 * Wolof, UNREVIEWED DRAFT.
 *
 * Provenance of this file, stated plainly because it matters: these strings
 * were drafted by a machine, not by a Wolof speaker. Nobody has reviewed
 * them. They are shipped because a reader who navigates in Wolof is better
 * served by a labelled draft than by nothing, and because a draft in the
 * repository is reviewable while an absence is not.
 *
 * What is covered: navigation, provenance labels, the scenario levers, the
 * common controls, and the short plain-language "this is not a result"
 * gloss. Longer analytical prose is deliberately absent and falls back to
 * English, see `resolve()` in ./core.ts, which reports that fallback rather
 * than hiding it, and the banner in Layout.tsx, which counts it.
 *
 * What is deliberately NOT here: the statistical and legal disclaimers. They
 * are listed in ./authoritative.ts and are always served in English. Adding
 * them to this file has no effect; the resolver will not use them.
 *
 * For reviewers: every entry below should be read as a question, not an
 * assertion. Civic and statistical vocabulary is the hardest part, where a
 * borrowing from English or French is what Wolof speakers actually use for a
 * technical term, prefer the borrowing over a coined native term.
 */
export const wo: PartialDictionary = {
  /* Language switching */
  'lang.label': 'Làkk',
  'lang.choose': 'Tànn ab làkk',

  /* Brand and navigation */
  'brand.tagline': 'Xibaaru wote',
  'nav.overview': 'Tënk',
  'nav.race': 'Wote bu 2026',
  'nav.forecast': 'Xaymab ëllëg',
  'nav.regions': 'Diiwaan yi',
  'nav.history': 'Taariix',
  'nav.methodology': 'Anam wi',
  'nav.data': 'Dàtta yi',

  /* Page titles */
  'overview.title': 'Gambi dem na wote',
  'race.title': 'Wote bu 2026',
  'forecast.title': 'Xaymab 2026',
  'regions.title': 'Kaartu wote bi',
  'history.title': 'Taariixu wote yi',
  'meth.title': 'Anam wi',
  'data.title': 'Dàtta ak fi mu jóge',

  /* Provenance labels, the core vocabulary of the platform */
  'prov.official.label': 'Ofisiel',
  'prov.reported.label': 'Yégle',
  'prov.modelled.label': 'Xayma',
  'prov.poll.label': 'Laaj',

  /* The plain-language gloss that sits above the English disclaimer */
  'disclaimer.gloss.title': 'Ci lu gàtt',
  'disclaimer.gloss.body':
    'Lii du njariñu wote. Mooy xayma bu ordinatëer defar. IEC rekk mën na wax ku ko moom. Bul wax benn limu fii ne mooy njariñu wote.',

  /* Scenario levers */
  'lever.transferEfficiency.label': 'Toxalub kàrt yi',
  'lever.oppositionConsolidation.label': 'Boole opposition bi',
  'lever.undecidedToChallengers.label': 'Ñi tànnul ñu dem ci ñi bëre',
  'lever.pollWeight.label': 'Diisaayu laaj yi',
  'lever.incumbentApproval.label': 'Nangub njiit li',
  'lever.infrastructureRating.label': 'Natt liggéeyu yoon ak mbëj',
  'lever.turnout.label': 'Ñi wote ci réew mi',
  'lever.youthTurnoutSwing.label': 'Ndaw ñi wote lu ëpp',
  'lever.newVoterEffect.label': 'Wotekat yu bees ak diaspora',
  'lever.inflation.label': 'Yokkub njëg yi',
  'lever.gdpGrowth.label': 'Yokkub koom-koom bi',
  'lever.youthUnemployment.label': 'Ñakk liggéey ci ndaw ñi',
  'lever.iterations.label': 'Limu jéego yi',

  /* Common controls and vocabulary */
  'common.clear': 'Far',
  'common.reset': 'Delloo',
  'common.sources': 'Fi mu jóge: ',
  'common.undecided': 'Tànnuwul',
  'common.turnout': 'Ñi wote',
  'common.yes': 'Waaw',
  'common.no': 'Déedéet',
  'common.reload': 'Yeesal',
  'chrome.menu': 'Menu',
  'chrome.loading': 'Mu ngi ñëw',
  'chrome.skipToContent': 'Dem ci biir bi',

  /* Offline */
  'offline.badge': 'Amul internet',
  'offline.title': 'Amuloo internet.',
  'offline.updateAction': 'Yeesal léegi',
};
