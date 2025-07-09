import { type RequestHandler } from '@builder.io/qwik-city';

// Simple logout route that clears cookies and redirects
export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  // Clear auth cookies
  cookie.delete('auth_user', { path: '/' });
  cookie.delete('auth_token', { path: '/' });

  throw redirect(302, '/login');
};
