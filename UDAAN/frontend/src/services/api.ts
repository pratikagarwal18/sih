// Centralized API client for UDAAN backend integration
// All HTTP communication goes through this module

import type { ApiError } from '../types/common';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000;
const API_DEBUG = import.meta.env.VITE_API_DEBUG === 'true';

/**
 * Centralized API endpoint paths.
 * The backend developer can modify these paths in one place
 * to match their actual backend routes.
 */
export const API_ENDPOINTS = {
  health: '/health',
  overview: '/overview',
  airfareIndex: '/index',
  indexTimeSeries: '/index/timeseries',
  indexContributions: '/index/contributions',
  routes: '/routes',
  route: '/routes/:id',
  fares: '/fares',
  airlines: '/airlines',
  airline: '/airlines/:id',
  leadTime: '/lead-time',
  festivals: '/festivals',
  festivalImpact: '/festivals/:id/impact',
  sources: '/sources',
  validation: '/validation',
  methodology: '/methodology',
} as const;

/**
 * Build full URL from endpoint path with path parameter substitution
 */
function buildUrl(endpoint: string, params?: Record<string, string>): string {
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, encodeURIComponent(value));
    });
  }
  return url;
}

/**
 * Build URL with query parameters
 */
function appendQueryParams(url: string, queryParams?: Record<string, string | number | boolean | undefined>): string {
  if (!queryParams) return url;

  const searchParams = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * Core fetch wrapper with timeout, error handling, and debug logging
 */
async function apiFetch<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    pathParams?: Record<string, string>;
    queryParams?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
    signal?: AbortSignal;
  } = {}
): Promise<T> {
  const { method = 'GET', pathParams, queryParams, body, signal } = options;

  let url = buildUrl(endpoint, pathParams);
  url = appendQueryParams(url, queryParams);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  // Merge external abort signal
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Placeholder for auth token — backend developer can enable this
  // const token = getAuthToken();
  // if (token) headers['Authorization'] = `Bearer ${token}`;

  if (API_DEBUG) {
    console.log(`[UDAAN API] ${method} ${url}`, body ? { body } : '');
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const apiError: ApiError = {
        status: response.status,
        message: errorBody.message || `Request failed with status ${response.status}`,
        code: errorBody.code,
        details: errorBody.details,
      };

      if (API_DEBUG) {
        console.error(`[UDAAN API] Error ${response.status}:`, apiError);
      }

      throw apiError;
    }

    const data = await response.json();

    if (API_DEBUG) {
      console.log(`[UDAAN API] Response:`, data);
    }

    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      const timeoutError: ApiError = {
        status: 408,
        message: 'Request timed out. The backend may be unavailable.',
        code: 'TIMEOUT',
      };
      throw timeoutError;
    }

    // If it's already an ApiError, re-throw
    if (typeof error === 'object' && error !== null && 'status' in error && 'message' in error) {
      throw error;
    }

    // Network error (backend unreachable)
    const networkError: ApiError = {
      status: 0,
      message: 'Unable to connect to the UDAAN backend. Please check your network connection and backend configuration.',
      code: 'NETWORK_ERROR',
    };
    throw networkError;
  }
}

/**
 * Convenience methods
 */
export const apiClient = {
  get: <T>(endpoint: string, options?: {
    pathParams?: Record<string, string>;
    queryParams?: Record<string, string | number | boolean | undefined>;
    signal?: AbortSignal;
  }) => apiFetch<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, body?: unknown, options?: {
    pathParams?: Record<string, string>;
    queryParams?: Record<string, string | number | boolean | undefined>;
  }) => apiFetch<T>(endpoint, { method: 'POST', body, ...options }),
};

/**
 * Health check — used by the system status indicator
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    await apiFetch(API_ENDPOINTS.health, { method: 'GET' });
    return true;
  } catch {
    return false;
  }
}

export { API_BASE_URL };
