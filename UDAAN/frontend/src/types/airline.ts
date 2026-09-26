// Airline types

export interface Airline {
  id: string;
  name: string;
  code: string;
  routesObserved: number;
  totalObservations: number;
  averageObservedFare: number;
  coverage: number;
  lastUpdated: string;
}

export interface AirlineDetail extends Airline {
  fareDistribution: Array<{ range: string; count: number; percentage: number }>;
  routeCoverage: Array<{ routeId: string; origin: string; destination: string; observations: number }>;
  historicalTrend: Array<{ date: string; averageFare: number }>;
}

export interface AirlineFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}
