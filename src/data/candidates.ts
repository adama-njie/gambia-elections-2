import type { Candidate2026 } from '@/types';

/**
 * The 2026 field. `status` matters: nominations run 3-14 November 2026, so
 * until the IEC publishes its certified list every entry here is "declared"
 * at best. The UI must say so.
 */
export const CANDIDATES_2026: Candidate2026[] = [
  {
    id: 'barrow',
    name: 'Adama Barrow',
    party: 'NPP',
    coalition: 'npp-alliance',
    role: 'President of The Gambia since 2017',
    bio: 'Seeking a third term. Came to office as the Coalition 2016 flagbearer, then founded the NPP in 2019. Campaigns on road, bridge and energy delivery and on institutional stability, now at the head of an alliance that absorbed the GDC and APP-Sobeyaa.',
    share2021: 53.23,
    color: '#1F6F8B',
    status: 'declared',
  },
  {
    id: 'darboe',
    name: 'Ousainou Darboe',
    party: 'UDP',
    coalition: 'gambia-first',
    role: 'Vice President 2018-2019; UDP leader',
    bio: 'The veteran of Gambian opposition politics, a presidential candidate in every competitive election since 1996. Leads the Gambia First Coalition. His candidacy is also the main obstacle cited by rival opposition camps to a single unified ticket.',
    share2021: 27.72,
    color: '#E08A3C',
    status: 'declared',
  },
  {
    id: 'bensouda',
    name: 'Talib Ahmed Bensouda',
    party: 'UNITE',
    coalition: 'coalition-2026',
    role: 'Mayor of Kanifing Municipal Council since 2018',
    bio: 'Flagbearer of Coalition 2026 since 8 August 2026. A former UDP figure who built UNITE as his own platform and has ruled out returning to the UDP. Polls strongest among urban and younger voters, where his municipal record is best known.',
    color: '#00ACC1',
    status: 'declared',
  },
  {
    id: 'pdois-flagbearer',
    name: 'Team Gambia flagbearer',
    party: 'PDOIS',
    coalition: 'team-gambia',
    role: 'Coordinated by Halifa Sallah and Sidia Jatta',
    bio: 'The Grand Coalition has said it will use the 2016 model, under which its flagbearer resigns from their party and stands as an independent. At the time of writing the bloc had not publicly confirmed who that will be, so this entry stands for the bloc rather than a named individual. PDOIS polled 3.77 per cent in 2021 under Halifa Sallah.',
    share2021: 3.77,
    color: '#F06292',
    status: 'prospective',
  },
  {
    id: 'badjie',
    name: 'Bakary K. Badjie',
    party: 'IND',
    coalition: null,
    role: 'National Assembly Member for Foni Bintang Karanai since 2022',
    bio: 'Standing as an independent outside the four blocs.',
    color: '#8D6E63',
    status: 'declared',
  },
  {
    id: 'bah',
    name: 'Mohamed Al Amin Bah',
    party: 'WAREF',
    coalition: null,
    role: 'Leader of WAREF',
    bio: 'Leader of the WAREF party, contesting outside the main alliances.',
    color: '#A1887F',
    status: 'declared',
  },
];

const byId = new Map(CANDIDATES_2026.map((c) => [c.id, c]));

export function getCandidate(id: string): Candidate2026 | undefined {
  return byId.get(id);
}

/** Candidates the forecast model simulates. Minor independents fold into "Other". */
export const MODELLED_CANDIDATES = ['barrow', 'darboe', 'bensouda', 'pdois-flagbearer'] as const;

/**
 * Figures that moved into the incumbent alliance rather than standing.
 * Shown in the UI so the 2021-to-2026 arithmetic is legible.
 */
export const REALIGNED_2026 = [
  {
    name: 'Mama Kandeh',
    party: 'GDC',
    share2021: 12.32,
    movedTo: 'npp-alliance',
    when: 'July 2026',
    note: 'Described the arrangement as an alliance, not a dissolution of the GDC into the NPP.',
    sources: ['point-kandeh-npp'],
  },
  {
    name: 'Essa M. Faal',
    party: 'APP',
    share2021: 2.0,
    movedTo: 'npp-alliance',
    when: 'September 2026',
    note: 'Stood as an independent in 2021; now leads APP-Sobeyaa. The alliance drew objections within his own camp.',
    sources: ['standard-faal-alliance'],
  },
];
