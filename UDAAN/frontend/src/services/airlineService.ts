// Airline service

import { apiClient, API_ENDPOINTS } from './api';
import type { ApiResponse, PaginatedResponse } from '../types/common';
import type { Airline, AirlineFilters } from '../types/airline';

export const airlineService = {
  /**
   * Get paginated list of airlines
   */
  getAirlines: (filters?: AirlineFilters, signal?: AbortSignal) =>
    apiClient.get<ApiResponse<PaginatedResponse<Airline>>>(
      API_ENDPOINTS.airlines,
      {
        queryParams: filters as Record<string, string | number | boolean | undefined>,
        signal,
      }
    ),

  /**
   * Get airline detail
   */
  getAirline: (airlineId: string, signal?: AbortSignal) =>
    apiClient.get<ApiResponse<Airline>>(
      API_ENDPOINTS.airline,
      {
        pathParams: { id: airlineId },
        signal,
      }
    ),
};
