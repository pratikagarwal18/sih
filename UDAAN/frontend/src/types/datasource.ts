// Data source types

export type DataSourceStatus = 'connected' | 'degraded' | 'unavailable' | 'not_configured';
export type DataSourceType = 'airline' | 'ota' | 'dgca' | 'mospi' | 'other';

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  status: DataSourceStatus;
  lastSuccessfulCollection: string | null;
  observationCount: number;
  coverage: number;
  complianceStatus: 'compliant' | 'non_compliant' | 'pending_review' | 'unknown';
}

export interface DataSourceSummary {
  sources: DataSource[];
  totalSources: number;
  connectedSources: number;
  totalObservations: number;
  lastUpdated: string | null;
}
