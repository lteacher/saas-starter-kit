import { treaty } from '@elysiajs/eden';
import type { App } from '@saas-starter/api';

// Create Eden Treaty client for type-safe API calls
export const client = treaty<App>(import.meta.env.VITE_API_URL || 'http://localhost:3000');

// Export the API client for use throughout the frontend
export default client;
