import { Candidate } from './types';

export const CANDIDATES_2026: Candidate[] = [
  {
    name: "Adama Barrow",
    party: "National People's Party",
    partyAcronym: "NPP",
    description: "Incumbent president, seeking re-election. Focuses on infrastructure and stability.",
    color: "#2F8FA8",
    imageUrl: "https://i.postimg.cc/8P4Yc3g1/adama-barrow.jpg"
  },
  {
    name: "Ousainou Darboe",
    party: "United Democratic Party",
    partyAcronym: "UDP",
    description: "Veteran opposition leader with a strong, established support base.",
    color: "#F5B376",
    imageUrl: "https://i.postimg.cc/tJq2Fz7R/ousainou-darboe.jpg"
  },
  {
    name: "Talib Bensouda",
    party: "Unite Movement for Change",
    partyAcronym: "UMC",
    description: "Popular among youth, seen as a unifying figure. Mayor of Kanifing.",
    color: "#00ACC1",
    imageUrl: "https://i.postimg.cc/L8gP4xXw/talib-bensouda.jpg"
  },
  {
    name: "Essa Faal",
    party: "Sobeya",
    partyAcronym: "Sobeya",
    description: "Independent candidate, former lead counsel for the TRRC.",
    color: "#E57373",
    imageUrl: "https://i.postimg.cc/Y0zVb6Sj/essa-faal.jpg"
  },
  {
    name: "Mama Kandeh",
    party: "Gambia Democratic Congress",
    partyAcronym: "GDC",
    description: "Influential third-party leader who played a key role in the 2016 coalition.",
    color: "#546E7A",
    imageUrl: "https://i.postimg.cc/0jN4dYfP/mama-kandeh.jpg"
  }
];

export const PARTY_COLORS: { [key: string]: string } = {
    'NPP': '#2F8FA8',
    'UDP': '#F5B376',
    'UMC': '#00ACC1',
    'Sobeya': '#E57373',
    'GDC': '#546E7A',
    'APRC': '#81C784',
    'NRP': '#9575CD',
    'PDOIS': '#F06292',
    'Coalition 2016': '#90A4AE',
    'Other': '#B0BEC5'
};