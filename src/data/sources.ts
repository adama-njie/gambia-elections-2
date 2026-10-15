import type { Source } from '@/types';

/**
 * Every figure in this app points at one of these. If a claim cannot be
 * traced to an entry here, it does not belong in the dataset.
 */
export const SOURCES: Source[] = [
  {
    id: 'iec',
    title: 'Independent Electoral Commission of The Gambia',
    publisher: 'IEC',
    url: 'https://iec.gm/',
    date: '2026',
  },
  {
    id: 'iec-candidates',
    title: 'Candidate list and registration',
    publisher: 'IEC',
    url: 'https://iec.gm/registration/candidate-list/',
    date: '2026',
  },
  {
    id: 'eu-eom-2021',
    title: 'European Union Election Observation Mission, The Gambia 2021 — Final Report',
    publisher: 'European Union',
    url: 'https://www.eeas.europa.eu/eom-gambia-2021_en',
    date: '2022-02',
  },
  {
    id: 'wiki-2026',
    title: '2026 Gambian presidential election',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/2026_Gambian_presidential_election',
    date: '2026-10',
  },
  {
    id: 'wiki-2021',
    title: '2021 Gambian presidential election',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/2021_Gambian_presidential_election',
    date: '2026-10',
  },
  {
    id: 'wiki-2016',
    title: '2016 Gambian presidential election',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/2016_Gambian_presidential_election',
    date: '2026-10',
  },
  {
    id: 'point-kandeh-npp',
    title: 'Mama Kandeh joins NPP-led alliance',
    publisher: 'The Point',
    url: 'https://thepoint.gm/africa/gambia/headlines/mama-kandeh-joins-npp-led-alliance',
    date: '2026-07',
  },
  {
    id: 'standard-faal-alliance',
    title: 'Faal says Barrow victory assured as parties tie alliance',
    publisher: 'The Standard',
    url: 'https://standard.gm/faal-says-barrows-victory-assured-as-parties-tie-alliance/',
    date: '2026-09',
  },
  {
    id: 'point-talib-flagbearer',
    title: 'Talib Ahmed Bensouda emerges flagbearer of Coalition 2026',
    publisher: 'The Point',
    url: 'https://thepoint.gm/africa/gambia/headlines/talib-ahmed-bensouda-emerges-flagbearer-of-coalition-2026',
    date: '2026-08-08',
  },
  {
    id: 'kerrfatou-unite-nup',
    title: 'Talib Bensouda says UNITE-NUP alliance is driven by national interest',
    publisher: 'Kerr Fatou',
    url: 'https://www.kerrfatou.com/talib-bensouda-says-unite-nup-alliance-is-driven-by-national-interest-not-political-convenience/',
    date: '2026-09',
  },
  {
    id: 'point-grand-coalition',
    title: 'Grand Coalition 2026 vows to return Gambia to citizens',
    publisher: 'The Point',
    url: 'https://thepoint.gm/africa/gambia/headlines/grand-coalition-2026-vows-to-return-gambia-to-citizens',
    date: '2026-09-18',
  },
  {
    id: 'riotimes-three-camps',
    title: 'Gambia opposition coalition count rises to three as President Barrow seeks third term',
    publisher: 'Rio Times',
    url: 'https://www.riotimesonline.com/gambia-opposition-coalition-three-camps-barrow-third-term-2026',
    date: '2026-09',
  },
  {
    id: 'standard-landscape',
    title: 'The political landscape ahead of Gambia 2026 presidential election',
    publisher: 'The Standard',
    url: 'https://standard.gm/the-political-landscape-ahead-of-gambias-2026-presidential-election/',
    date: '2026',
  },
  {
    id: 'kerrfatou-poll',
    title: 'Opinion poll reveals Gambians divided ahead of 2026 presidential election',
    publisher: 'Kerr Fatou',
    url: 'https://www.kerrfatou.com/opinion-poll-reveals-gambians-divided-ahead-of-2026-presidential-election/',
    date: '2026-08',
  },
  {
    id: 'malagen-nomination',
    title: 'Explainer: How candidates will be nominated for The Gambia 2026 presidential election',
    publisher: 'MaLaGen',
    url: 'https://malagen.org/media-monitoring/explainer-how-candidates-will-be-nominated-for-the-gambias-2026-presidential-election/',
    date: '2026-09',
  },
  {
    id: 'malagen-hub',
    title: 'Explainer: Inside The Gambia 2026 election race',
    publisher: 'MaLaGen',
    url: 'https://malagen.org/election-hub/inside-the-gambias-2026-election-race/',
    date: '2026',
  },
  {
    id: 'voice-nomination',
    title: 'IEC tightens verification rules ahead of presidential nominations',
    publisher: 'The Voice',
    url: 'https://www.voicegambia.com/iec-tightens-verification-rules-ahead-of-presidential-nominations/',
    date: '2026-09',
  },
  {
    id: 'dubawa-parties',
    title: 'Gambia 2026 presidential election: who are the main political parties and what do they stand for?',
    publisher: 'Dubawa',
    url: 'https://dubawa.org/gambias-2026-presidential-election-who-are-the-main-political-parties-and-what-do-they-stand-for/',
    date: '2026',
  },
  {
    id: 'gbos',
    title: 'Gambia Bureau of Statistics — population and housing census',
    publisher: 'GBoS',
    url: 'https://www.gbosdata.org/',
    date: '2024',
  },
  {
    id: 'standard-demography',
    title: '13 years after the 2013 census: Gambia changing demography and the electoral map of 2026',
    publisher: 'The Standard',
    url: 'https://standard.gm/13-after-the-2013-census-a-look-at-gambias-changing-demography-and-the-electoral-map-of-2026/',
    date: '2026',
  },
  {
    id: 'model',
    title: 'Platform forecast model (see Methodology)',
    publisher: 'This platform',
    url: '#/methodology',
    date: '2026',
  },
];

const byId = new Map(SOURCES.map((s) => [s.id, s]));

export function getSource(id: string): Source | undefined {
  return byId.get(id);
}

export function getSources(ids: string[]): Source[] {
  return ids.map((id) => byId.get(id)).filter((s): s is Source => Boolean(s));
}
