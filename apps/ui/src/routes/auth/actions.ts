import { routeAction$, redirect, z } from '@builder.io/qwik-city';
import { client } from '../../lib/api-client';

// Login action with proper error handling
export const useLoginAction = routeAction$(
  async (data, { cookie, fail }) => {
    console.log('=== LOGIN ACTION CALLED ===');
    console.log('Data received:', data);

    try {
      console.log('Making API call to login endpoint...');
      const response = await client.api.auth.login.post(data);
      console.log('Raw API response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      if (response.data && 'user' in response.data && 'token' in response.data) {
        const user = response.data.user;
        const token = response.data.token as string;

        console.log('Login successful, setting cookies for user:', user.username);

        // Set HTTP-only cookies for persistent auth
        cookie.set('auth_user', JSON.stringify(user), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 86400 * 7, // 7 days
        });

        cookie.set('auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 86400 * 7, // 7 days
        });

        const result = { success: true, user };
        console.log('Returning result:', result);
        return result;
      } else {
        console.error('Invalid response format:', response);
        return fail(400, { message: 'Invalid response format' });
      }
    } catch (error) {
      console.error('Login error:', error);
      return fail(400, { message: 'Login failed. Please check your credentials.' });
    }
  },
  z.object({
    identifier: z.string(),
    password: z.string(),
  }),
);

// Logout action
export const useLogoutAction = routeAction$(async (_, { cookie }) => {
  console.log('=== LOGOUT ACTION CALLED ===');

  // Clear auth cookies
  cookie.delete('auth_user', { path: '/' });
  cookie.delete('auth_token', { path: '/' });

  console.log('Cookies cleared, redirecting to login');
  throw redirect(302, '/login');
});
