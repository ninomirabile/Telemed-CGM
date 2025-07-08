import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { GlucoseReading, Alert } from '@/types';
import { glucoseApi, alertsApi } from '@/services/api';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface GlucoseState {
  // State
  readings: GlucoseReading[];
  alerts: Alert[];
  currentMode: 'mock' | 'real';
  isLoading: LoadingState;
  error: string | null;
  lastUpdate: string | null;
  isAlertsLoading: boolean;
  alertsError: string | null;
  
  // Actions
  fetchReadings: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  forceReading: () => Promise<void>;
  setMode: (mode: 'mock' | 'real') => void;
  clearError: () => void;
  markAlertAsRead: (alertId: number) => void;
  deleteAlert: (alertId: number) => void;
}

export const useGlucoseStore = create<GlucoseState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    readings: [],
    alerts: [],
    currentMode: (import.meta.env.VITE_CGM_MODE as 'mock' | 'real') || 'mock',
    isLoading: 'idle',
    error: null,
    lastUpdate: null,
    isAlertsLoading: false,
    alertsError: null,

    // Actions
    fetchReadings: async () => {
      set({ isLoading: 'loading', error: null });
      try {
        const response = await glucoseApi.getMockReadings();
        if (response.status === 'success') {
          set({ readings: response.data, isLoading: 'success' });
        } else {
          set({ error: 'Failed to fetch readings', isLoading: 'error' });
        }
      } catch (error) {
        set({ error: 'Failed to fetch readings', isLoading: 'error' });
      }
    },

    fetchAlerts: async () => {
      set({ isAlertsLoading: true, alertsError: null });
      try {
        const response = await alertsApi.getActiveAlerts();
        if (response.status === 'success') {
          set({ alerts: response.data, isAlertsLoading: false });
        } else {
          set({ alertsError: 'Failed to fetch alerts', isAlertsLoading: false });
        }
      } catch (error) {
        set({ alertsError: 'Failed to fetch alerts', isAlertsLoading: false });
      }
    },

    forceReading: async () => {
      set({ isLoading: 'loading', error: null });
      
      try {
        const response = await glucoseApi.forceReading();
        
        if (response.status === 'success') {
          const newReading = response.data;
          const currentReadings = get().readings;
          
          // Add new reading to the beginning of the array
          const updatedReadings = [newReading, ...currentReadings.slice(0, 11)];
          
          set({
            readings: updatedReadings,
            isLoading: 'success',
            lastUpdate: new Date().toISOString(),
          });
        } else {
          throw new Error(response.message || 'Failed to force reading');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        set({ 
          error: errorMessage, 
          isLoading: 'error' 
        });
        console.error('Error forcing reading:', error);
      }
    },

    setMode: (_mode: 'mock' | 'real') => {
      set({ currentMode: _mode });
    },

    clearError: () => {
      set({ error: null });
    },

    markAlertAsRead: async (_alertId: number) => {
      try {
        await alertsApi.markAsRead(_alertId);
        // Refresh alerts after marking as read
        get().fetchAlerts();
      } catch (error) {
        console.error('Failed to mark alert as read:', error);
      }
    },

    deleteAlert: async (_alertId: number) => {
      try {
        await alertsApi.deleteAlert(_alertId);
        // Refresh alerts after deletion
        get().fetchAlerts();
      } catch (error) {
        console.error('Failed to delete alert:', error);
      }
    },
  }))
);

// Selectors for derived state
export const useGlucoseSelectors = () => {
  const readings = useGlucoseStore(state => state.readings);
  const alerts = useGlucoseStore(state => state.alerts);
  
  return {
    // Latest reading
    latestReading: readings[0] || null,
    
    // Average glucose value
    averageGlucose: readings.length > 0 
      ? readings.reduce((sum, reading) => sum + reading.value, 0) / readings.length 
      : 0,
    
    // Glucose range
    glucoseRange: readings.length > 0 
      ? {
          min: Math.min(...readings.map(r => r.value)),
          max: Math.max(...readings.map(r => r.value)),
        }
      : { min: 0, max: 0 },
    
    // Active alerts count
    activeAlertsCount: alerts.filter(alert => alert.is_active).length,
    
    // Critical alerts
    criticalAlerts: alerts.filter(alert => 
      alert.is_active && alert.severity === 'critical'
    ),
    
    // High severity alerts
    highSeverityAlerts: alerts.filter(alert => 
      alert.is_active && ['error', 'critical'].includes(alert.severity)
    ),
  };
};

// Auto-refresh functionality
let refreshInterval: ReturnType<typeof setInterval> | null = null;

export const startAutoRefresh = (intervalMs: number = 10000) => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  
  refreshInterval = setInterval(() => {
    const store = useGlucoseStore.getState();
    store.fetchReadings();
    store.fetchAlerts();
  }, intervalMs);
};

export const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

// Initialize store with data
export const initializeStore = async () => {
  const store = useGlucoseStore.getState();
  await Promise.all([
    store.fetchReadings(),
    store.fetchAlerts(),
  ]);
}; 