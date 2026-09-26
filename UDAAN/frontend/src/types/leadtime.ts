// Lead-time analysis types

export interface LeadTimeObservation {
  advanceDays: number;
  label: string;
  medianFare: number;
  meanFare: number;
  minFare: number;
  maxFare: number;
  observationCount: number;
  changeFromPrevious: number;
}

export interface LeadTimeAnalysis {
  route: string | null;
  airline: string | null;
  observations: LeadTimeObservation[];
  period: string;
  lastUpdated: string;
}

export interface LeadTimeParams {
  routeId?: string;
  airline?: string;
  dateFrom?: string;
  dateTo?: string;
}
