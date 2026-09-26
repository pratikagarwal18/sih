// Validation service

import { apiClient, API_ENDPOINTS } from './api';
import type { ApiResponse } from '../types/common';
import type { ValidationSummary, ValidationParams } from '../types/validation';

export const validationService = {
  /**
   * Get validation results comparing UDAAN index against benchmarks
   */
  getValidation: (params?: ValidationParams, signal?: AbortSignal) =>
    apiClient.get<ApiResponse<ValidationSummary>>(
      API_ENDPOINTS.validation,
      {
        queryParams: params as Record<string, string | number | boolean | undefined>,
        signal,
      }
    ),
};
