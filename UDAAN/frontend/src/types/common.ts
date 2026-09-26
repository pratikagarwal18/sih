// Common/shared types

export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: string;
}

export interface MethodologyStep {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface MethodologyData {
  pipeline: MethodologyStep[];
  fareComponents: {
    description: string;
    components: Array<{ name: string; description: string }>;
  };
  advancePurchaseWindows: Array<{ label: string; days: number; description: string }>;
  lastUpdated: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error' | 'empty';

// Re-export all types from a single barrel
export type { AirfareObservation, FareObservationFilters, FareComponent } from './airfare';
export type { Route, RouteDetail, RouteFilters } from './route';
export type { Airline, AirlineDetail, AirlineFilters } from './airline';
export type { AirfareIndex, IndexTimeSeries, IndexContribution, IndexMethodology, IndexParams, OverviewData, SystemStatus } from './index';
export type { FestivalEvent, FestivalImpact, FestivalFilters } from './festival';
export type { ValidationResult, ValidationSummary, ValidationParams } from './validation';
export type { DataSource, DataSourceSummary, DataSourceStatus, DataSourceType } from './datasource';
export type { LeadTimeObservation, LeadTimeAnalysis, LeadTimeParams } from './leadtime';
