// Lead-time analysis service

import { apiClient, API_ENDPOINTS } from './api';
import type { ApiResponse } from '../types/common';
import type { LeadTimeAnalysis, LeadTimeParams } from '../types/leadtime';

export const leadTimeService = {
  /**
   * Get lead-time (advance purchase) analysis
   */
  getAnalysis: (params?: LeadTimeParams, signal?: AbortSignal) =>
    apiClient.get<ApiResponse<LeadTimeAnalysis>>(
      API_ENDPOINTS.leadTime,
      {
        queryParams: params as Record<string, string | number | boolean | undefined>,
        signal,
      }
    ),
};
