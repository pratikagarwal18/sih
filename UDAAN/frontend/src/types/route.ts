// Route types

export interface Route {
  routeId: string;
  origin: string;
  destination: string;
  originName: string;
  destinationName: string;
  passengerTraffic: number;
  weight: number;
  currentIndex: number;
  changePercentage: number;
  observationCount: number;
  coverage: number;
  lastUpdated: string;
}

export interface RouteDetail extends Route {
  historicalIndex: Array<{ date: string; value: number }>;
  airlineComparison: Array<{ airline: string; averageFare: number; observations: number }>;
  leadTimeCurve: Array<{ advanceDays: number; medianFare: number; observations: number }>;
  fareBreakdown: {
    baseFare: number;
    taxes: number;
    fees: number;
    totalFare: number;
  };
  festivalContext: Array<{ eventName: string; period: string; fareMovement: number }>;
  dataQuality: {
    completeness: number;
    consistency: number;
    timeliness: number;
  };
}

export interface RouteFilters {
  origin?: string;
  destination?: string;
  airline?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
