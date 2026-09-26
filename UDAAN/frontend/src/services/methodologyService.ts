// Methodology service

import { apiClient, API_ENDPOINTS } from './api';
import type { ApiResponse } from '../types/common';
import type { MethodologyData } from '../types/common';

export const methodologyService = {
  /**
   * Get methodology documentation
   */
  getMethodology: (signal?: AbortSignal) =>
    apiClient.get<ApiResponse<MethodologyData>>(
      API_ENDPOINTS.methodology,
      { signal }
    ),
};
