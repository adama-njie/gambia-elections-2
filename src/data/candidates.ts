import type { Candidate2026 } from '@/types';

/**
 * The 2026 field.
 *
 * `status` matters: nominations run 3-14 November 2026, so until the IEC
 * publishes its certified list every entry here is declared at best. The
 * interface says so.
 *
 * Two different Darboes are contesting this election: Ousainou Darboe of
 * the UDP, who leads the Gambia First Coalition, and Lamin J. Darboe of the
 * NUP, who leads Team Gambia Grand Coalition. They are not related in any
 * reported sense and they lead rival blocs. Every candidate therefore
 * carries an explicit `shortName`, because a chart axis labelled from the
 * last word of each name would show "Darboe" twice.
 */
export const CANDIDATES_2026: Candidate2026[] = [
  {
    id: 'barrow',
    name: 'Adama Barrow',
    shortName: 'Barrow',
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
    shortName: 'O. Darboe',
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
    shortName: 'Bensouda',
    party: 'UNITE',
    coalition: 'coalition-2026',
    role: 'Mayor of Kanifing Municipal Council since 2018',
    bio: 'Flagbearer of Coalition 2026 since 8 August 2026, selected after Essa Faal withdrew hours before the vote. A former UDP figure who built UNITE as his own platform and has ruled out returning to the UDP. Polls strongest among urban and younger voters, where his municipal record is best known.',
    color: '#00ACC1',
    status: 'declared',
  },
  {
    id: 'lj-darboe',
    name: 'Lamin J. Darboe',
    shortName: 'L. J. Darboe',
    party: 'NUP',
    coalition: 'team-gambia',
    role: 'Leader of the National Unity Party; lawyer',
    bio: 'Elected flagbearer of Team Gambia Grand Coalition on 3 November 2026, after a consensus attempt failed and the bloc’s Good Governance Committee ran a vote among seven aspirants. Due to file his nomination with the IEC on 11 November. His selection complicates the memorandum his party signed with Talib Bensouda’s UNITE, which the NUP has publicly said still stands.',
    color: '#F06292',
    status: 'declared',
  },
  {
    id: 'gibba',
    name: 'Almameh Gibba',
    shortName: 'Gibba',
    party: 'APRC-NTA',
    coalition: 'no-to-alliance',
    role: 'National Assembly Member for Foni Kansala',
    bio: 'Standard-bearer of the APRC No To Alliance Movement, endorsed by Yahya Jammeh from exile. Sits for Foni Kansala, the constituency that gave Mama Kandeh his single strongest result in 2021 at 70.7 per cent. Has pledged to facilitate Jammeh’s return to The Gambia if elected, and that no foreign troops will remain.',
    color: '#7E57C2',
    status: 'declared',
  },
  {
    id: 'badjie',
    name: 'Bakary K. Badjie',
    shortName: 'Badjie',
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
    shortName: 'Bah',
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

/** A label safe to put on a chart axis, where two candidates share a surname. */
export function candidateShortName(id: string): string {
  return byId.get(id)?.shortName ?? id;
}

/** Candidates the forecast model simulates. Minor independents fold into "Other". */
export const MODELLED_CANDIDATES = ['barrow', 'darboe', 'bensouda', 'lj-darboe', 'gibba'] as const;

/**
 * Figures who moved into the incumbent alliance rather than standing.
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
    note: 'Stood as an independent in 2021; now leads APP-Sobeyaa. Withdrew from the Coalition 2026 flagbearer contest hours before the vote, then sealed an agreement with the NPP over objections within his own camp.',
    sources: ['standard-faal-alliance'],
  },
];
