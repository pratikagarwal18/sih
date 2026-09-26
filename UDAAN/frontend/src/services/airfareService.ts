// Airfare observation service

import { apiClient, API_ENDPOINTS } from './api';
import type { ApiResponse, PaginatedResponse } from '../types/common';
import type { AirfareObservation, FareObservationFilters } from '../types/airfare';

export const airfareService = {
  /**
   * Get paginated fare observations with filters
   */
  getObservations: (filters?: FareObservationFilters, signal?: AbortSignal) =>
    apiClient.get<ApiResponse<PaginatedResponse<AirfareObservation>>>(
      API_ENDPOINTS.fares,
      {
        queryParams: filters as Record<string, string | number | boolean | undefined>,
        signal,
      }
    ),
};
