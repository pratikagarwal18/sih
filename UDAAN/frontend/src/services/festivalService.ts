// Festival intelligence service

import { apiClient, API_ENDPOINTS } from './api';
import type { ApiResponse, PaginatedResponse } from '../types/common';
import type { FestivalEvent, FestivalImpact, FestivalFilters } from '../types/festival';

export const festivalService = {
  /**
   * Get paginated list of festival events
   */
  getEvents: (filters?: FestivalFilters, signal?: AbortSignal) =>
    apiClient.get<ApiResponse<PaginatedResponse<FestivalEvent>>>(
      API_ENDPOINTS.festivals,
      {
        queryParams: filters as Record<string, string | number | boolean | undefined>,
        signal,
      }
    ),

  /**
   * Get impact analysis for a specific festival event
   */
  getImpact: (eventId: string, signal?: AbortSignal) =>
    apiClient.get<ApiResponse<FestivalImpact>>(
      API_ENDPOINTS.festivalImpact,
      {
        pathParams: { id: eventId },
        signal,
      }
    ),
};
