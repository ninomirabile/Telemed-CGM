import type { 
  GlucoseReading, 
  Alert, 
  ApiResponse, 
  PaginatedResponse
} from '@/types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Custom error class for API errors
export class ApiException extends Error {
  public status: number;
  public code: string;
  
  constructor(
    status: number,
    code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.code = code;
  }
}

// HTTP client with error handling
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiException(
          response.status,
          errorData.code || 'UNKNOWN_ERROR',
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      
      // Network or other errors
      throw new ApiException(
        0,
        'NETWORK_ERROR',
        error instanceof Error ? error.message : 'Unknown network error'
      );
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// API instance
const api = new ApiClient();

// Glucose API endpoints
export const glucoseApi = {
  // Get mock glucose readings
  getMockReadings: (): Promise<ApiResponse<GlucoseReading[]>> => 
    api.get<ApiResponse<GlucoseReading[]>>('/glucose/mock'),

  // Force a new glucose reading
  forceReading: (): Promise<ApiResponse<GlucoseReading>> => 
    api.post<ApiResponse<GlucoseReading>>('/glucose/fetch'),

  // Get glucose readings with pagination
  getReadings: (params?: {
    page?: number;
    per_page?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponse<GlucoseReading>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params?.start_date) searchParams.append('start_date', params.start_date);
    if (params?.end_date) searchParams.append('end_date', params.end_date);
    
    const query = searchParams.toString();
    const endpoint = `/glucose/readings${query ? `?${query}` : ''}`;
    
    return api.get<PaginatedResponse<GlucoseReading>>(endpoint);
  },

  // Get latest glucose reading
  getLatestReading: (): Promise<ApiResponse<GlucoseReading>> => 
    api.get<ApiResponse<GlucoseReading>>('/glucose/latest'),
};

// Alerts API endpoints
export const alertsApi = {
  // Get all alerts
  getAlerts: (): Promise<ApiResponse<Alert[]>> => 
    api.get<ApiResponse<Alert[]>>('/alerts'),

  // Get active alerts
  getActiveAlerts: (): Promise<ApiResponse<Alert[]>> => 
    api.get<ApiResponse<Alert[]>>('/alerts/active'),

  // Mark alert as read
  markAsRead: (alertId: number): Promise<ApiResponse<void>> => 
    api.put<ApiResponse<void>>(`/alerts/${alertId}/read`),

  // Delete alert
  deleteAlert: (alertId: number): Promise<ApiResponse<void>> => 
    api.delete<ApiResponse<void>>(`/alerts/${alertId}`),
};

// Health check endpoint
export const healthApi = {
  // Check API health
  checkHealth: (): Promise<{ status: string; timestamp: string }> => 
    api.get<{ status: string; timestamp: string }>('/health'),
};

// Utility functions
export const apiUtils = {
  // Format API error for display
  formatError: (error: unknown): string => {
    if (error instanceof ApiException) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  // Check if error is network related
  isNetworkError: (error: unknown): boolean => {
    return error instanceof ApiException && error.code === 'NETWORK_ERROR';
  },

  // Retry function for failed requests
  retry: async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: unknown;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (i === maxRetries - 1) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
    
    throw lastError;
  },
};

export default api; 