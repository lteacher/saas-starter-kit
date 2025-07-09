import { client } from './api-client';

interface ApiOptions {
  token?: string;
  headers?: Record<string, string>;
}

export const createAuthedApiCall = (token?: string) => {
  const baseHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  return {
    get: (path: string, options?: ApiOptions) => {
      const headers = { ...baseHeaders, ...options?.headers };
      return (client.api as any)[path].get({ headers });
    },

    post: (path: string, data: any, options?: ApiOptions) => {
      const headers = { ...baseHeaders, ...options?.headers };
      return (client.api as any)[path].post(data, { headers });
    },

    put: (path: string, data: any, options?: ApiOptions) => {
      const headers = { ...baseHeaders, ...options?.headers };
      return (client.api as any)[path].put(data, { headers });
    },

    delete: (path: string, options?: ApiOptions) => {
      const headers = { ...baseHeaders, ...options?.headers };
      return (client.api as any)[path].delete({ headers });
    },
  };
};

export const getAuthHeaders = (token?: string) => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const makeAuthedCall = async <T>(apiCall: () => Promise<T>, token?: string): Promise<T> => {
  return apiCall();
};

export const handleApiError = (error: any): string => {
  if (error?.error?.value) {
    return error.error.value;
  }

  if (typeof error?.error === 'string') {
    return error.error;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

export const isApiError = (response: any): boolean => {
  return response?.error !== undefined;
};
