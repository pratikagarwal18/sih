// Festival and event intelligence types

export interface FestivalEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  region: string;
  affectedRoutes: string[];
  relevance: 'high' | 'medium' | 'low';
  status: 'upcoming' | 'active' | 'concluded';
  category: string;
}

export interface FestivalImpact {
  eventId: string;
  eventName: string;
  period: string;
  affectedRoutes: Array<{
    routeId: string;
    origin: string;
    destination: string;
    fareMovement: number;
    observations: number;
  }>;
  aggregateFareMovement: number;
  contextNote: string;
}

export interface FestivalFilters {
  region?: string;
  status?: 'upcoming' | 'active' | 'concluded';
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}
