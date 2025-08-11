export interface VoteSummary {
  totalVotes: number;
  nullVotes: number;
  blankVotes: number;
  validVotes: number;
  nullPercent: string;
  blankPercent: string;
  validPercent: string;
}

export interface PartySummary {
  name: string;
  abbr: string;
  count: number;
  percentage: number;
}


export interface PartyData {
  name: string;
  abbr: string;
  count: number;
  percentage: number;
}