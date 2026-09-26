// Hook for monitoring backend API health status

import { useState, useEffect, useCallback, useRef } from 'react';
import { checkApiHealth } from '../services/api';

interface ApiHealthStatus {
  isConnected: boolean;
  lastChecked: Date | null;
  isChecking: boolean;
  checkNow: () => void;
}

const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

/**
 * Periodically checks backend API health.
 * Used by the system status indicator in the sidebar and header.
 */
export function useApiHealth(): ApiHealthStatus {
  const [isConnected, setIsConnected] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const mountedRef = useRef(true);

  const checkHealth = useCallback(async () => {
    if (!mountedRef.current) return;
    setIsChecking(true);
    try {
      const healthy = await checkApiHealth();
      if (mountedRef.current) {
        setIsConnected(healthy);
        setLastChecked(new Date());
      }
    } catch {
      if (mountedRef.current) {
        setIsConnected(false);
        setLastChecked(new Date());
      }
    } finally {
      if (mountedRef.current) {
        setIsChecking(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    checkHealth();
    const interval = setInterval(checkHealth, HEALTH_CHECK_INTERVAL);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [checkHealth]);

  return { isConnected, lastChecked, isChecking, checkNow: checkHealth };
}
