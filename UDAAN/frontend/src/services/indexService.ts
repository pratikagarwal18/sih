// Index service — Airfare Price Index (APIx)

import { apiClient, API_ENDPOINTS } from './api';
import type { ApiResponse } from '../types/common';
import type { AirfareIndex, IndexTimeSeries, IndexContribution, IndexParams, OverviewData } from '../types/index';

export const indexService = {
  /**
   * Get overview/dashboard data
   */
  getOverview: (signal?: AbortSignal) =>
    apiClient.get<ApiResponse<OverviewData>>(
      API_ENDPOINTS.overview,
      { signal }
    ),

  /**
   * Get current airfare index
   */
  getAirfareIndex: (params?: IndexParams, signal?: AbortSignal) =>
    apiClient.get<ApiResponse<AirfareIndex>>(
      API_ENDPOINTS.airfareIndex,
      {
        queryParams: params as Record<string, string | number | boolean | undefined>,
        signal,
      }
    ),

  /**
   * Get index time series data for charting
   */
  getTimeSeries: (params?: IndexParams, signal?: AbortSignal) =>
    apiClient.get<ApiResponse<IndexTimeSeries>>(
      API_ENDPOINTS.indexTimeSeries,
      {
        queryParams: params as Record<string, string | number | boolean | undefined>,
        signal,
      }
    ),

  /**
   * Get index contribution breakdown
   */
  getContributions: (signal?: AbortSignal) =>
    apiClient.get<ApiResponse<IndexContribution>>(
      API_ENDPOINTS.indexContributions,
      { signal }
    ),
};
