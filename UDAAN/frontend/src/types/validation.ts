// Validation types for index verification

export interface ValidationResult {
  period: string;
  udaanIndex: number;
  benchmarkIndex: number;
  deviation: number;
  observations: number;
  coverage: number;
}

export interface ValidationSummary {
  results: ValidationResult[];
  averageDeviation: number;
  maxDeviation: number;
  totalPeriods: number;
  lastValidated: string;
  backtestPeriod: string;
}

export interface ValidationParams {
  dateFrom?: string;
  dateTo?: string;
  benchmarkSource?: string;
}
