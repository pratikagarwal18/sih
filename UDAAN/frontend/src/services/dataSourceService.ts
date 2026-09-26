// Data source service

import { apiClient, API_ENDPOINTS } from './api';
import type { ApiResponse } from '../types/common';
import type { DataSourceSummary } from '../types/datasource';

export const dataSourceService = {
  /**
   * Get all data sources with their statuses
   */
  getDataSources: (signal?: AbortSignal) =>
    apiClient.get<ApiResponse<DataSourceSummary>>(
      API_ENDPOINTS.sources,
      { signal }
    ),
};
