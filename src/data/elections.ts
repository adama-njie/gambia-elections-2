import type { ElectionResult } from '@/types';

/**
 * Presidential results, 1996-2021.
 *
 * National figures and area-level breakdowns are taken from the IEC's own
 * published results documents, which the Commission uploaded to iec.gm and
 * which carry a full constituency-level table for every election in this
 * period. They are extracted with scripts/extract_iec.py in the companion
 * data repository and validated against each document's printed national
 * total before being used here.
 *
 * Earlier versions of this file carried modelled area-level estimates,
 * because the EU Election Observation Mission's 2021 report recorded that
 * the IEC published no results on its website and recommended that it do
 * so. The Commission has since published them. Those estimates have been
 * replaced by the official figures; they were wrong by an average of 7.9
 * points per area in 2021 and by as much as 17.5 points in Upper River,
 * which is why they were labelled modelled and never official.
 *
 * Constituency-level extraction is validated for 2006, 2011, 2016 and 2021,
 * and is within 0.3 per cent for 1996. The 2001 document's Upper River
 * block could not be read reliably from the published PDF, so that year
 * carries national figures only.
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
      { region: 'BJL', shares: { 'COALITION-2016': 49.65, APRC: 42.66, GDC: 7.69 }, turnout: 58.82, provenance: 'official' },
      { region: 'KMC', shares: { 'COALITION-2016': 50.09, APRC: 40.06, GDC: 9.93 }, turnout: 56.02, provenance: 'official' },
      { region: 'WCR', shares: { 'COALITION-2016': 43.18, APRC: 44.37, GDC: 12.5 }, turnout: 61.64, provenance: 'official' },
      { region: 'NBR', shares: { 'COALITION-2016': 36.64, APRC: 28.75, GDC: 34.59 }, turnout: 62.63, provenance: 'official' },
      { region: 'LRR', shares: { 'COALITION-2016': 55.78, APRC: 27.07, GDC: 17.09 }, turnout: 60.04, provenance: 'official' },
      { region: 'CRR', shares: { 'COALITION-2016': 31.71, APRC: 43.15, GDC: 25.1 }, turnout: 60.04, provenance: 'official' },
      { region: 'URR', shares: { 'COALITION-2016': 43.97, APRC: 38.32, GDC: 17.66 }, turnout: 55.48, provenance: 'official' },
    ],
    winner: 'Adama Barrow',
    winningParty: 'COALITION-2016',
    margin: 3.65,
    provenance: 'reported',
    sources: ['iec-results-2016', 'iec', 'wiki-2016'],
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
      { region: 'BJL', shares: { NPP: 62.29, UDP: 21.54, GDC: 3.55, PDOIS: 9.12, IND: 3.22, NUP: 0.27 }, turnout: 88.79, provenance: 'official' },
      { region: 'KMC', shares: { NPP: 49.67, UDP: 29.85, GDC: 10.4, PDOIS: 7.42, IND: 2.25, NUP: 0.41 }, turnout: 89.92, provenance: 'official' },
      { region: 'WCR', shares: { NPP: 43.78, UDP: 32.41, GDC: 17.56, PDOIS: 3.31, IND: 2.15, NUP: 0.79 }, turnout: 90.21, provenance: 'official' },
      { region: 'NBR', shares: { NPP: 57.79, UDP: 26.62, GDC: 9.61, PDOIS: 2.65, IND: 2.03, NUP: 1.31 }, turnout: 90.06, provenance: 'official' },
      { region: 'LRR', shares: { NPP: 46.25, UDP: 45.96, GDC: 4.48, PDOIS: 0.88, IND: 1.16, NUP: 1.27 }, turnout: 90.11, provenance: 'official' },
      { region: 'CRR', shares: { NPP: 64.35, UDP: 20.84, GDC: 9.41, PDOIS: 1.97, IND: 1.99, NUP: 1.45 }, turnout: 89.0, provenance: 'official' },
      { region: 'URR', shares: { NPP: 74.82, UDP: 9.83, GDC: 9.73, PDOIS: 2.83, IND: 1.3, NUP: 1.49 }, turnout: 85.23, provenance: 'official' },
    ],
    winner: 'Adama Barrow',
    winningParty: 'NPP',
    margin: 25.51,
    provenance: 'reported',
    sources: ['iec-results-2021', 'iec', 'wiki-2021'],
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
