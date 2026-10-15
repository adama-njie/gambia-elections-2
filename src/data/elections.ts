import type { ElectionResult } from '@/types';

/**
 * Presidential results, 1996-2021.
 *
 * National figures are the IEC's announced totals as recorded by observer
 * missions and the standard secondary tables. They are tagged `reported`
 * rather than `official` for one specific reason: the EU Election
 * Observation Mission's 2021 final report notes that the IEC published no
 * results on its website and recommends polling-station-level publication.
 * Until the IEC publishes its own machine-readable archive, nothing here can
 * honestly be called official.
 *
 * Regional breakdowns: no official area-level dataset exists in the public
 * record for any of these elections. Rather than invent one, `regional` is
 * populated only for 2016 and 2021, is explicitly tagged `modelled`, and is
 * derived as documented in docs/METHODOLOGY.md. Earlier years carry no
 * regional detail at all.
 */
export const ELECTIONS: ElectionResult[] = [
  {
    year: 1996,
    date: '1996-09-26',
    registeredVoters: 446_274,
    validVotes: 394_494,
    turnout: 88.4,
    national: [
      { candidate: 'Yahya Jammeh', party: 'APRC', votes: 220_011, share: 55.77 },
      { candidate: 'Ousainou Darboe', party: 'UDP', votes: 141_387, share: 35.84 },
      { candidate: 'Hamat Bah', party: 'NRP', votes: 21_759, share: 5.52 },
      { candidate: 'Sidia Jatta', party: 'PDOIS', votes: 11_337, share: 2.87 },
    ],
    regional: [],
    winner: 'Yahya Jammeh',
    winningParty: 'APRC',
    margin: 19.93,
    provenance: 'reported',
    sources: ['iec', 'wiki-2021'],
    context: {
      title: 'Return to civilian rule after the 1994 coup',
      description:
        'The first election after the July 1994 coup. Yahya Jammeh stood for the newly formed APRC, having lifted the ban on political activity only weeks earlier while the three main pre-coup parties remained proscribed. Ousainou Darboe contested for a UDP founded that same year, beginning a run of candidacies that continues in 2026.',
    },
  },
  {
    year: 2001,
    date: '2001-10-18',
    registeredVoters: 511_053,
    validVotes: 458_379,
    turnout: 89.7,
    national: [
      { candidate: 'Yahya Jammeh', party: 'APRC', votes: 242_302, share: 52.84 },
      { candidate: 'Ousainou Darboe', party: 'UDP', votes: 149_448, share: 32.6 },
      { candidate: 'Hamat Bah', party: 'NRP', votes: 35_671, share: 7.78 },
      { candidate: 'Sheriff Mustapha Dibba', party: 'OTHER', votes: 17_271, share: 3.77 },
      { candidate: 'Sidia Jatta', party: 'PDOIS', votes: 13_687, share: 2.99 },
    ],
    regional: [],
    winner: 'Yahya Jammeh',
    winningParty: 'APRC',
    margin: 20.24,
    provenance: 'reported',
    sources: ['iec', 'wiki-2021'],
    context: {
      title: 'Incumbent consolidation, opposition at its 20th-century peak',
      description:
        'Darboe ran on a UDP-PPP-GPP alliance ticket and recorded the strongest opposition showing of the Jammeh era in absolute votes. Jammeh still won comfortably on very high turnout. The pattern of a divided opposition splitting roughly a sixth of the vote between minor candidates was already established.',
    },
  },
  {
    year: 2006,
    date: '2006-09-22',
    registeredVoters: 670_336,
    validVotes: 392_685,
    turnout: 58.6,
    national: [
      { candidate: 'Yahya Jammeh', party: 'APRC', votes: 264_404, share: 67.33 },
      { candidate: 'Ousainou Darboe', party: 'UDP', votes: 104_808, share: 26.69 },
      { candidate: 'Halifa Sallah', party: 'PDOIS', votes: 23_473, share: 5.98 },
    ],
    regional: [],
    winner: 'Yahya Jammeh',
    winningParty: 'APRC',
    margin: 40.64,
    provenance: 'reported',
    sources: ['iec', 'wiki-2021'],
    context: {
      title: 'Collapsed turnout and a fractured opposition',
      description:
        'The NADD opposition alliance fell apart before polling day, leaving Darboe and Halifa Sallah to run separately. Turnout fell by more than thirty points from 2001 to the lowest level of the period, and Jammeh took two thirds of a much smaller vote. The clearest illustration in the record that opposition fragmentation and demobilisation compound each other.',
    },
  },
  {
    year: 2011,
    date: '2011-11-24',
    registeredVoters: 796_929,
    validVotes: 657_787,
    turnout: 83.0,
    national: [
      { candidate: 'Yahya Jammeh', party: 'APRC', votes: 470_550, share: 71.54 },
      { candidate: 'Ousainou Darboe', party: 'UDP', votes: 114_177, share: 17.36 },
      { candidate: 'Hamat Bah', party: 'NRP', votes: 73_060, share: 11.11 },
    ],
    regional: [],
    winner: 'Yahya Jammeh',
    winningParty: 'APRC',
    margin: 54.18,
    provenance: 'reported',
    sources: ['iec', 'wiki-2021'],
    context: {
      title: 'The high-water mark of APRC dominance',
      description:
        'Jammeh took over 71 per cent, his largest share. ECOWAS declined to send observers, stating that the preparations and political environment did not permit a free and fair contest. The UDP vote fell to its lowest point, and the opposition entered the next cycle with the fragmentation argument effectively settled.',
    },
  },
  {
    year: 2016,
    date: '2016-12-01',
    registeredVoters: 886_578,
    validVotes: 525_963,
    turnout: 59.3,
    national: [
      { candidate: 'Adama Barrow', party: 'COALITION-2016', votes: 227_708, share: 43.29 },
      { candidate: 'Yahya Jammeh', party: 'APRC', votes: 208_487, share: 39.64 },
      { candidate: 'Mama Kandeh', party: 'GDC', votes: 89_768, share: 17.07 },
    ],
    regional: [
      { region: 'BJL', shares: { 'COALITION-2016': 56.4, APRC: 32.1, GDC: 11.5 }, turnout: 55.1, provenance: 'modelled' },
      { region: 'KMC', shares: { 'COALITION-2016': 58.9, APRC: 28.4, GDC: 12.7 }, turnout: 57.8, provenance: 'modelled' },
      { region: 'WCR', shares: { 'COALITION-2016': 49.6, APRC: 36.8, GDC: 13.6 }, turnout: 59.4, provenance: 'modelled' },
      { region: 'NBR', shares: { 'COALITION-2016': 39.2, APRC: 43.1, GDC: 17.7 }, turnout: 60.2, provenance: 'modelled' },
      { region: 'LRR', shares: { 'COALITION-2016': 41.8, APRC: 41.4, GDC: 16.8 }, turnout: 59.8, provenance: 'modelled' },
      { region: 'CRR', shares: { 'COALITION-2016': 30.1, APRC: 44.6, GDC: 25.3 }, turnout: 61.1, provenance: 'modelled' },
      { region: 'URR', shares: { 'COALITION-2016': 33.4, APRC: 42.2, GDC: 24.4 }, turnout: 60.6, provenance: 'modelled' },
    ],
    winner: 'Adama Barrow',
    winningParty: 'COALITION-2016',
    margin: 3.65,
    provenance: 'reported',
    sources: ['iec', 'wiki-2016', 'eu-eom-2021'],
    context: {
      title: 'The Grand Coalition and the end of 22 years of APRC rule',
      description:
        'Seven opposition parties agreed a single flagbearer, Adama Barrow, who resigned from the UDP to stand as the coalition candidate. The margin was only 3.65 points, and Mama Kandeh’s GDC took 17 per cent outside the coalition. The arithmetic is the founding lesson of Gambian coalition politics: unity delivered the win, but a single additional bloc staying outside very nearly cost it.',
    },
  },
  {
    year: 2021,
    date: '2021-12-04',
    registeredVoters: 962_157,
    validVotes: 859_567,
    turnout: 89.34,
    national: [
      { candidate: 'Adama Barrow', party: 'NPP', votes: 457_519, share: 53.23 },
      { candidate: 'Ousainou Darboe', party: 'UDP', votes: 238_253, share: 27.72 },
      { candidate: 'Mama Kandeh', party: 'GDC', votes: 105_902, share: 12.32 },
      { candidate: 'Halifa Sallah', party: 'PDOIS', votes: 32_435, share: 3.77 },
      { candidate: 'Essa M. Faal', party: 'IND', votes: 17_206, share: 2.0 },
      { candidate: 'Abdoulie Ebrima Jammeh', party: 'NUP', votes: 8_252, share: 0.96 },
    ],
    regional: [
      { region: 'BJL', shares: { NPP: 52.6, UDP: 29.4, GDC: 8.1, PDOIS: 5.2, IND: 3.6, NUP: 1.1 }, turnout: 84.2, provenance: 'modelled' },
      { region: 'KMC', shares: { NPP: 45.1, UDP: 32.8, GDC: 8.9, PDOIS: 6.4, IND: 5.6, NUP: 1.2 }, turnout: 86.1, provenance: 'modelled' },
      { region: 'WCR', shares: { NPP: 50.8, UDP: 30.6, GDC: 10.8, PDOIS: 4.3, IND: 2.5, NUP: 1.0 }, turnout: 88.4, provenance: 'modelled' },
      { region: 'NBR', shares: { NPP: 56.2, UDP: 26.1, GDC: 12.9, PDOIS: 2.9, IND: 1.1, NUP: 0.8 }, turnout: 90.3, provenance: 'modelled' },
      { region: 'LRR', shares: { NPP: 54.9, UDP: 27.9, GDC: 12.1, PDOIS: 3.3, IND: 1.1, NUP: 0.7 }, turnout: 90.0, provenance: 'modelled' },
      { region: 'CRR', shares: { NPP: 58.1, UDP: 21.4, GDC: 17.2, PDOIS: 2.1, IND: 0.6, NUP: 0.6 }, turnout: 91.6, provenance: 'modelled' },
      { region: 'URR', shares: { NPP: 57.3, UDP: 23.8, GDC: 15.4, PDOIS: 2.2, IND: 0.6, NUP: 0.7 }, turnout: 91.2, provenance: 'modelled' },
    ],
    winner: 'Adama Barrow',
    winningParty: 'NPP',
    margin: 25.51,
    provenance: 'reported',
    sources: ['iec', 'wiki-2021', 'eu-eom-2021'],
    context: {
      title: 'Barrow re-elected on his own party, opposition split five ways',
      description:
        'With the 2016 coalition dissolved, Barrow contested on the NPP ticket and beat his former ally Darboe by more than 25 points on turnout of 89 per cent. The combined opposition vote was 46.77 per cent spread across five candidates. The UDP rejected the result and petitioned the Supreme Court, which dismissed the challenge. The EU observer mission noted that the IEC published no results on its website.',
    },
  },
];

export const LATEST_ELECTION = ELECTIONS[ELECTIONS.length - 1]!;

export const BASELINE_ELECTION = LATEST_ELECTION;

export function getElection(year: number): ElectionResult | undefined {
  return ELECTIONS.find((e) => e.year === year);
}

export const ELECTION_YEARS = ELECTIONS.map((e) => e.year);

/** 2026 election day, per the IEC calendar. */
export const ELECTION_DAY_2026 = '2026-12-05';
