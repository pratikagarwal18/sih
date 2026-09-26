// Custom hook for API data fetching with loading/error/empty states

import { useState, useEffect, useCallback, useRef } from 'react';
import type { LoadingState, ApiError } from '../types/common';

interface UseApiOptions {
  /** Whether to fetch immediately on mount */
  immediate?: boolean;
}

interface UseApiResult<T> {
  data: T | null;
  state: LoadingState;
  error: ApiError | null;
  refetch: () => void;
  isLoading: boolean;
  isEmpty: boolean;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * Generic hook for API data fetching.
 * Handles loading, success, empty, and error states.
 * Automatically cleans up in-flight requests on unmount.
 */
export function useApi<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = [],
  options: UseApiOptions = { immediate: true }
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [state, setState] = useState<LoadingState>(options.immediate ? 'loading' : 'idle');
  const [error, setError] = useState<ApiError | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const execute = useCallback(async () => {
    // Abort any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState('loading');
    setError(null);

    try {
      const result = await fetcher(controller.signal);
      if (!mountedRef.current) return;

      // Check if result is "empty"
      const isEmpty = result === null || result === undefined ||
        (Array.isArray(result) && result.length === 0) ||
        (typeof result === 'object' && result !== null && 'data' in (result as Record<string, unknown>) &&
          (
            (result as Record<string, unknown>).data === null ||
            (Array.isArray((result as Record<string, unknown>).data) && ((result as Record<string, unknown>).data as unknown[]).length === 0)
          )
        );

      setData(result);
      setState(isEmpty ? 'empty' : 'success');
    } catch (err) {
      if (!mountedRef.current) return;
      // Don't treat abort as error
      if (err instanceof DOMException && err.name === 'AbortError') return;

      const apiError = err as ApiError;
      setError(apiError);
      setState('error');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    if (options.immediate) {
      execute();
    }
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);

  return {
    data,
    state,
    error,
    refetch: execute,
    isLoading: state === 'loading',
    isEmpty: state === 'empty',
    isError: state === 'error',
    isSuccess: state === 'success',
  };
}
