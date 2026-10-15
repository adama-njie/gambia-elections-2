import type { Poll, TimelineEvent } from '@/types';

/**
 * Published national polling for the 2026 race. The Gambian polling market
 * is thin: two published surveys from one organisation, both with large
 * undecided shares. The forecast model therefore treats polls as one input
 * among several rather than as the baseline, and the `pollWeight` lever
 * lets a user see exactly how much the polls are doing.
 */
export const POLLS: Poll[] = [
  {
    id: 'ceprass-2025-07',
    pollster: 'CepRass',
    commissionedBy: 'Gambia Participates',
    fieldworkEnd: '2025-07-31',
    sampleSize: 1_556,
    marginOfError: 2.5,
    shares: {
      barrow: 31,
      darboe: 12,
      bensouda: 18,
      'pdois-flagbearer': 3,
      other: 6,
    },
    undecided: 29,
    sources: ['wiki-2026'],
    note: 'Fieldwork predates the August-September 2026 coalition realignments. Sources differ on whether this is a July or August 2025 survey.',
  },
  {
    id: 'gp-2026-08',
    pollster: 'Gambia Participates',
    fieldworkEnd: '2026-08-10',
    sampleSize: 1_556,
    marginOfError: 2.5,
    shares: {
      barrow: 32,
      darboe: 25,
      bensouda: 19,
      'pdois-flagbearer': 2,
      other: 5,
    },
    undecided: 17,
    sources: ['kerrfatou-poll', 'wiki-2026'],
    note: 'Fieldwork ended 10 August 2026, before the Essa Faal alliance in September. Mama Kandeh polled 2 per cent and Essa Faal 3 per cent as separate candidates; both have since joined the NPP-led alliance, so those shares are folded into "other" here rather than attributed to a standing candidate.',
  },
];

export const LATEST_POLL = POLLS[POLLS.length - 1]!;

/**
 * The IEC calendar. Where outlets report conflicting windows, the later and
 * more specific reporting is used and the conflict is noted.
 */
export const TIMELINE: TimelineEvent[] = [
  {
    id: 'registration-close',
    date: '2026-05-28',
    title: 'Voter registration closes',
    description:
      'End of the supplementary registration period for the 2026 cycle. The size of the final register is the single biggest unknown in any turnout projection.',
    kind: 'legal',
    sources: ['malagen-hub'],
  },
  {
    id: 'forms-available',
    date: '2026-09-21',
    title: 'Nomination forms issued',
    description: 'The IEC makes nomination forms available to prospective presidential candidates.',
    kind: 'legal',
    sources: ['voice-nomination'],
  },
  {
    id: 'nominations',
    date: '2026-11-03',
    endDate: '2026-11-14',
    title: 'Nomination of candidates',
    description:
      'Candidates file with the IEC. Requirements include a one million dalasi deposit, a declaration of assets, a tax clearance certificate, nomination by registered voters with a minimum drawn from each administrative area, Gambian citizenship by birth, a minimum age of 30 and at least senior secondary education. Reporting conflicts on the per-area nominator threshold, so the IEC text governs. Only after this window closes does a certified field exist.',
    kind: 'legal',
    sources: ['malagen-nomination', 'voice-nomination', 'iec-candidates'],
  },
  {
    id: 'campaign',
    date: '2026-11-16',
    endDate: '2026-12-03',
    title: 'Official campaign period',
    description: 'Public campaigning runs for eighteen days under IEC rules on access to media and public spaces.',
    kind: 'campaign',
    sources: ['malagen-nomination'],
  },
  {
    id: 'cooling-off',
    date: '2026-12-04',
    title: 'Cooling-off day',
    description: 'Campaigning ceases. No rallies, broadcasts or canvassing.',
    kind: 'campaign',
    sources: ['malagen-nomination'],
  },
  {
    id: 'election-day',
    date: '2026-12-05',
    title: 'Presidential election',
    description:
      'Single-round, first-past-the-post vote for a five-year term. The Gambia votes with marbles dropped into drums rather than paper ballots, counted at the polling station in front of party agents.',
    kind: 'poll',
    sources: ['wiki-2026', 'iec'],
  },
];
