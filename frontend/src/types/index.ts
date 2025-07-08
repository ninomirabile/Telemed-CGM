// Glucose Reading Types
export interface GlucoseReading {
  id: number;
  timestamp: string;
  value: number;
  trend: GlucoseTrend;
  mode: 'mock' | 'real';
  created_at: string;
}

export type GlucoseTrend = 
  | 'rising' 
  | 'falling' 
  | 'stable' 
  | 'rising_rapidly' 
  | 'falling_rapidly';

// Alert Types
export interface Alert {
  id: number;
  glucose_reading_id: number;
  alert_type: AlertType;
  message: string;
  severity: AlertSeverity;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  glucose_reading?: GlucoseReading;
}

export type AlertType = 
  | 'high_glucose' 
  | 'low_glucose' 
  | 'critical_high' 
  | 'critical_low' 
  | 'trend_warning' 
  | 'connection_lost';

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Application State Types
export interface AppState {
  currentMode: 'mock' | 'real';
  isLoading: boolean;
  error: string | null;
  lastUpdate: string | null;
}

// Chart Data Types
export interface ChartDataPoint {
  timestamp: string;
  value: number;
  trend: GlucoseTrend;
}

export interface ChartConfig {
  height: number;
  width: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// Form Types
export interface GlucoseFormData {
  value: number;
  trend: GlucoseTrend;
  mode: 'mock' | 'real';
}

// Settings Types
export interface AppSettings {
  pollingInterval: number;
  alertThresholds: {
    high: number;
    low: number;
    criticalHigh: number;
    criticalLow: number;
  };
  features: {
    realTime: boolean;
    notifications: boolean;
    analytics: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'it';
}

// User Types (for future use)
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  created_at: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationParams {
  page: number;
  per_page: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface FilterParams {
  start_date?: string;
  end_date?: string;
  min_value?: number;
  max_value?: number;
  trend?: GlucoseTrend;
  mode?: 'mock' | 'real';
} 