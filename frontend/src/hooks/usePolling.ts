import { useEffect, useRef, useCallback } from 'react';

interface UsePollingOptions {
  enabled?: boolean;
  interval?: number;
  onError?: (err: Error) => void;
  retryOnError?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export function usePolling<T>(
  callback: () => Promise<T>,
  interval: number,
  enabled: boolean = true,
  options: UsePollingOptions = {}
) {
  const {
    onError,
    retryOnError = true,
    maxRetries = 3,
    retryDelay = 1000,
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const isPollingRef = useRef(false);

  const executeCallback = useCallback(async () => {
    if (isPollingRef.current) return;
    
    isPollingRef.current = true;
    
    try {
      await callback();
      retryCountRef.current = 0; // Reset retry count on success
    } catch {
      const errorObj = new Error('Unknown error');
      
      if (onError) {
        onError(errorObj);
      }
      
      if (retryOnError && retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        
        // Exponential backoff
        const delay = retryDelay * Math.pow(2, retryCountRef.current - 1);
        
        setTimeout(() => {
          isPollingRef.current = false;
          executeCallback();
        }, delay);
        
        return;
      }
      
      console.error('Polling failed after retries:', errorObj);
    } finally {
      isPollingRef.current = false;
    }
  }, [callback, onError, retryOnError, maxRetries, retryDelay]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Execute immediately
    executeCallback();
    
    // Then set up interval
    intervalRef.current = setInterval(executeCallback, interval);
  }, [executeCallback, interval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPollingRef.current = false;
    retryCountRef.current = 0;
  }, []);

  const restartPolling = useCallback(() => {
    stopPolling();
    startPolling();
  }, [startPolling, stopPolling]);

  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling]);

  return {
    startPolling,
    stopPolling,
    restartPolling,
    isPolling: isPollingRef.current,
  };
} 