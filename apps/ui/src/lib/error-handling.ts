export const getErrorMessage = (error: any): string => {
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

export const handleApiResponse = <T>(response: { data?: T; error?: any }): T => {
  if (response.error) {
    throw new Error(getErrorMessage(response));
  }

  if (!response.data) {
    throw new Error('No data received from API');
  }

  return response.data;
};

export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  defaultErrorMessage = 'Operation failed',
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    const message = getErrorMessage(error);
    throw new Error(message || defaultErrorMessage);
  }
};

export const safeApiCall = async <T>(
  apiCall: () => Promise<{ data?: T; error?: any }>,
  defaultValue: T,
  onError?: (error: string) => void,
): Promise<T> => {
  try {
    const response = await apiCall();

    if (response.error) {
      const errorMessage = getErrorMessage(response);
      if (onError) onError(errorMessage);
      return defaultValue;
    }

    return response.data || defaultValue;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (onError) onError(errorMessage);
    return defaultValue;
  }
};
