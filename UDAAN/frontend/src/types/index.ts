// Airfare Price Index types

export interface AirfareIndex {
  value: number;
  previousValue: number;
  changePercentage: number;
  period: string;
  basePeriod: string;
  coverage: number;
  lastUpdated: string;
}

export interface IndexTimeSeries {
  data: Array<{ date: string; value: number }>;
  period: 'daily' | 'weekly' | 'monthly';
  basePeriod: string;
  startDate: string;
  endDate: string;
}

export interface IndexContribution {
  routeContributions: Array<{
    routeId: string;
    origin: string;
    destination: string;
    weight: number;
    contribution: number;
    change: number;
  }>;
  leadTimeContributions: Array<{
    advanceDays: number;
    contribution: number;
    change: number;
  }>;
}

export interface IndexMethodology {
  basePeriod: string;
  routeBasketSize: number;
  weightingMethod: string;
  observationWindow: string;
  calculationFrequency: string;
  lastMethodologyUpdate: string;
}

export interface IndexParams {
  period?: 'daily' | 'weekly' | 'monthly';
  dateFrom?: string;
  dateTo?: string;
}

export interface OverviewData {
  currentIndex: AirfareIndex | null;
  indexTimeSeries: IndexTimeSeries | null;
  topRouteMovements: Route[];
  systemStatus: SystemStatus;
}

export interface SystemStatus {
  apiConnected: boolean;
  lastDataUpdate: string | null;
  totalObservations: number | null;
  routesCovered: number | null;
  dataCoverage: number | null;
  dataSourcesActive: number | null;
}

import type { Route } from './route';
