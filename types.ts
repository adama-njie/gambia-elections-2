
export interface CandidateVote {
  candidate: string;
  party: string;
  votes: number;
}

export interface RegionalResult {
  [region: string]: CandidateVote[];
}

export interface ElectionYearResult {
  year: number;
  results: RegionalResult;
  turnout: number;
}

export interface Candidate {
  name: string;
  party: string;
  partyAcronym: string;
  description: string;
  color: string;
  imageUrl: string;
}

export interface PredictionParams {
  youthUnemployment: number;
  gdpGrowth: number;
  voterTurnout: number;
  incumbentPerformance: number;
  inflationRate: number;
  infrastructureRating: number;
  oppositionUnity: number;
}

export interface VoteDistribution {
  candidate: string;
  party: string;
  percentage: number;
}

export interface PredictionResult {
    predictedWinner: string;
    winningParty: string;
    voteDistribution: VoteDistribution[];
    confidenceLevel: string;
    analysis: string;
    regionalStrongholds: { region: string; candidate: string; }[];
}

export interface DemographicBreakdown {
  gender: {
    men: VoteDistribution[];
    women: VoteDistribution[];
  };
  age: {
    young: VoteDistribution[];
    middle: VoteDistribution[];
    old: VoteDistribution[];
  };
}

export interface DemographicYearData {
  year: number;
  data: DemographicBreakdown;
}