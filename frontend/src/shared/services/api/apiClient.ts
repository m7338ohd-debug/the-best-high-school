import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export interface ApiResponseWrapper<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
  error?: unknown;
  code?: number;
  timestamp?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Inject Auth Token and Tenant ID
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    const tenantId = localStorage.getItem('tenant_id') || 'default-school-tenant';

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (tenantId && config.headers) {
      config.headers['x-tenant-id'] = tenantId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Uniform error handling & token refresh handling
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponseWrapper>) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and handle session expiry redirect if needed
      localStorage.removeItem('auth_token');
    }
    return Promise.reject(error.response?.data || error.message);
  }
);
