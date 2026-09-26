// Route service

import { apiClient, API_ENDPOINTS } from './api';
import type { ApiResponse, PaginatedResponse } from '../types/common';
import type { Route, RouteDetail, RouteFilters } from '../types/route';

export const routeService = {
  /**
   * Get paginated list of routes
   */
  getRoutes: (filters?: RouteFilters, signal?: AbortSignal) =>
    apiClient.get<ApiResponse<PaginatedResponse<Route>>>(
      API_ENDPOINTS.routes,
      {
        queryParams: filters as Record<string, string | number | boolean | undefined>,
        signal,
      }
    ),

  /**
   * Get detailed information for a single route
   */
  getRoute: (routeId: string, signal?: AbortSignal) =>
    apiClient.get<ApiResponse<RouteDetail>>(
      API_ENDPOINTS.route,
      {
        pathParams: { id: routeId },
        signal,
      }
    ),
};
