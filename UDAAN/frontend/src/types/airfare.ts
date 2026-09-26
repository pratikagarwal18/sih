// Airfare observation and price types

export interface AirfareObservation {
  id: string;
  origin: string;
  destination: string;
  airline: string;
  flightNumber: string;
  departureDate: string;
  observationTimestamp: string;
  advancePurchaseDays: number;
  fareClass: string;
  baseFare: number;
  taxes: number;
  fees: number;
  totalFare: number;
  currency: string;
  source: string;
  availabilityStatus: 'available' | 'sold_out' | 'limited' | 'unknown';
}

export interface FareObservationFilters {
  origin?: string;
  destination?: string;
  travelDate?: string;
  observationDate?: string;
  airline?: string;
  advancePurchaseMin?: number;
  advancePurchaseMax?: number;
  fareClass?: string;
  source?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FareComponent {
  baseFare: number;
  taxes: number;
  userDevelopmentFee: number;
  applicableFees: number;
  totalFare: number;
}
