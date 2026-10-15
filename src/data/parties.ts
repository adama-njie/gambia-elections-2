import type { Coalition, Party } from '@/types';

/**
 * Parties that matter to the 1996-2026 record. `id` is the stable key used
 * by results, forecasts and colour lookups everywhere else in the app.
 */
export const PARTIES: Party[] = [
  {
    id: 'NPP',
    name: "National People's Party",
    founded: 2019,
    leader: 'Adama Barrow',
    color: '#1F6F8B',
    profile:
      'Founded by President Barrow after the 2016 coalition dissolved. Campaigns on infrastructure delivery, institutional continuity and macroeconomic stability.',
    active: true,
  },
  {
    id: 'UDP',
    name: 'United Democratic Party',
    founded: 1996,
    leader: 'Ousainou Darboe',
    color: '#E08A3C',
    profile:
      'The oldest continuous opposition party and the largest single opposition force. Strong in Mandinka-majority areas and the Upper River.',
    active: true,
  },
  {
    id: 'UNITE',
    name: 'Unite Movement for Change (UNITE)',
    founded: 2025,
    leader: 'Talib Ahmed Bensouda',
    color: '#00ACC1',
    profile:
      'Registered party built around the Kanifing mayoralty. Formerly organised as the UMC platform; campaigns on anti-corruption, service delivery and youth employment.',
    active: true,
  },
  {
    id: 'PDOIS',
    name: "People's Democratic Organisation for Independence and Socialism",
    founded: 1986,
    leader: 'Halifa Sallah',
    color: '#F06292',
    profile:
      'Long-standing left-of-centre party known for constitutionalist and programmatic politics rather than mass mobilisation.',
    active: true,
  },
  {
    id: 'GDC',
    name: 'Gambia Democratic Congress',
    founded: 2016,
    leader: 'Mama Kandeh',
    color: '#546E7A',
    profile:
      'Built a substantial rural base in 2016-2021, particularly in Central and Upper River. Now aligned with the NPP-led alliance.',
    active: true,
  },
  {
    id: 'APP',
    name: 'All People’s Party (Sobeyaa)',
    founded: 2022,
    leader: 'Essa M. Faal',
    color: '#E57373',
    profile:
      'Formed around the former TRRC lead counsel after his 2021 independent run. Now aligned with the NPP-led alliance.',
    active: true,
  },
  {
    id: 'NUP',
    name: 'National Unity Party',
    founded: 2019,
    leader: 'Abdoulie Ebrima Jammeh',
    color: '#8D6E63',
    profile: 'Small party; signed a memorandum of understanding with UNITE for the 2026 race.',
    active: true,
  },
  {
    id: 'NRP',
    name: 'National Reconciliation Party',
    founded: 1996,
    leader: 'Hamat Bah',
    color: '#9575CD',
    profile: 'Long-running small party with a base in the North Bank; has served in government under Barrow.',
    active: true,
  },
  {
    id: 'APRC',
    name: 'Alliance for Patriotic Reorientation and Construction',
    founded: 1996,
    leader: 'Fabakary Tombong Jatta',
    color: '#81C784',
    profile: "Yahya Jammeh's former ruling party, in power 1996-2016. Retains a residual base in Foni.",
    active: true,
  },
  {
    id: 'PASTEF',
    name: 'PASTEF Gambia',
    color: '#4DB6AC',
    profile: 'Pan-Africanist movement modelled on its Senegalese namesake; member of Coalition 2026.',
    active: true,
  },
  {
    id: 'PRP',
    name: "People's Rights Party",
    color: '#7986CB',
    active: true,
  },
  {
    id: 'WAREF',
    name: 'WAREF',
    leader: 'Mohamed Al Amin Bah',
    color: '#A1887F',
    profile: 'Small party contesting 2026 outside the main blocs.',
    active: true,
  },
  {
    id: 'COALITION-2016',
    name: 'Coalition 2016',
    founded: 2016,
    color: '#90A4AE',
    profile:
      'The seven-party united front that fielded Adama Barrow and ended 22 years of APRC rule. Dissolved after 2017.',
    active: false,
  },
  {
    id: 'IND',
    name: 'Independent',
    color: '#B0BEC5',
    active: true,
  },
  {
    id: 'OTHER',
    name: 'Other candidates',
    color: '#CFD8DC',
    active: true,
  },
];

const partyById = new Map(PARTIES.map((p) => [p.id, p]));

export function getParty(id: string): Party | undefined {
  return partyById.get(id);
}

export const PARTY_COLORS: Record<string, string> = Object.fromEntries(
  PARTIES.map((p) => [p.id, p.color]),
);

export function partyColor(id: string): string {
  return PARTY_COLORS[id] ?? '#B0BEC5';
}

/* ------------------------------------------------------------------ */
/* The 2026 blocs                                                      */
/* ------------------------------------------------------------------ */

/**
 * Four blocs went into the November 2026 nomination window. Three of them
 * are opposition platforms formed after the all-party "Coalition 2026" talks
 * broke down, which is the single most important structural fact about this
 * election: the opposition vote is split three ways against a consolidated
 * incumbent alliance.
 */
export const COALITIONS: Coalition[] = [
  {
    id: 'npp-alliance',
    name: 'NPP-led Alliance',
    leadParty: 'NPP',
    flagbearer: 'barrow',
    members: ['NPP', 'GDC', 'APP', 'NRP'],
    formed: '2026-09',
    color: '#1F6F8B',
    cohesion: 'formal',
    summary:
      'The incumbent alliance. Mama Kandeh brought the GDC in during July 2026 after the all-party coalition talks collapsed, describing it as an alliance rather than a merger. Essa Faal and APP-Sobeyaa sealed their own agreement with the NPP in September 2026, over objections from part of his camp. On 2021 arithmetic the three blocs together polled roughly 67 per cent, which is the basis for the president’s claim that the race is already settled, a claim that assumes near-perfect vote transfer.',
    sources: ['point-kandeh-npp', 'standard-faal-alliance', 'standard-landscape'],
  },
  {
    id: 'gambia-first',
    name: 'Gambia First Coalition',
    leadParty: 'UDP',
    flagbearer: 'darboe',
    members: ['UDP'],
    formed: '2026-08-14',
    color: '#E08A3C',
    cohesion: 'formal',
    summary:
      'Led by the UDP, formed by memorandum on 14 August 2026 together with seven other parties and movements, with Ousainou Darboe as its candidate. It is the largest single opposition bloc by 2021 vote share, but it enters the race without the PDOIS and UNITE camps that a unified opposition would have needed.',
    sources: ['riotimes-three-camps', 'standard-landscape'],
  },
  {
    id: 'coalition-2026',
    name: 'Coalition 2026',
    leadParty: 'UNITE',
    flagbearer: 'bensouda',
    members: ['UNITE', 'PASTEF', 'PRP', 'NUP'],
    formed: '2026-08-20',
    color: '#00ACC1',
    cohesion: 'formal',
    summary:
      'Talib Bensouda emerged as flagbearer on 8 August 2026 after several parties withdrew from the wider talks, with partners signing on 20 August: PASTEF Gambia, Defending the Gambian Interest, the People’s Rights Party, FORWARD Gambia, the National Reform Congress, Gambia Movement for Progress, UNITE and Save The Gambia. UNITE separately signed a memorandum of understanding with the National Unity Party to contest 5 December jointly. Bensouda has ruled out rejoining the UDP while leaving the door open to opposition cooperation.',
    sources: ['point-talib-flagbearer', 'kerrfatou-unite-nup', 'standard-landscape'],
  },
  {
    id: 'team-gambia',
    name: 'Team Gambia Grand Coalition 2026',
    leadParty: 'PDOIS',
    flagbearer: 'pdois-flagbearer',
    members: ['PDOIS'],
    formed: '2026-09-12',
    color: '#F06292',
    cohesion: 'announced',
    summary:
      'Coordinated by Halifa Sallah and Sidia Jatta, founded on 12 September 2026 and announced on 18 September, with PDOIS among the party signatories. The bloc has said it will follow the 2016 model in which the flagbearer resigns from their party and stands as an independent, which means its ballot identity may differ from its party base.',
    sources: ['point-grand-coalition', 'riotimes-three-camps'],
  },
];

const coalitionById = new Map(COALITIONS.map((c) => [c.id, c]));

export function getCoalition(id: string | null): Coalition | undefined {
  return id ? coalitionById.get(id) : undefined;
}

/** Non-member movements named in reporting that are not registered parties. */
export const COALITION_MOVEMENTS: Record<string, string[]> = {
  'coalition-2026': [
    'Defending the Gambian Interest (GDI)',
    'FORWARD Gambia',
    'National Reform Congress (NRC)',
    'Gambia Movement for Progress',
    'Save The Gambia',
  ],
  'gambia-first': ['Seven further parties and movements (memorandum of 14 August 2026)'],
  'team-gambia': ['Further party and movement signatories announced 18 September 2026'],
};
