import { routeAction$ } from '@builder.io/qwik-city';
import { client } from '../../lib/api-client';

export const useSetupPassword = routeAction$(async (data, { query, cookie, redirect, fail }) => {
  const token = query.get('token');
  const { password } = data;

  try {
    if (token) {
      // Invitation flow - accept invitation
      const response = await client.api.invitations({ id: token }).accept.post({
        password: password as string,
      });

      if (response.error) {
        return fail(400, { error: response.error.value });
      }

      throw redirect(302, '/login?message=password-set');
    } else {
      // Temp password flow - update current user's password
      const authToken = cookie.get('auth_token')?.value;
      const storedUser = cookie.get('auth_user')?.value;

      if (!authToken || !storedUser) {
        return fail(401, { error: 'Authentication required' });
      }

      const user = JSON.parse(storedUser);

      const response = await client.api.users({ id: user.id }).patch(
        {
          passwordHash: password as string,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        },
      );

      if (response.error) {
        return fail(400, { error: response.error.value });
      }

      // Update stored user to remove temp password flag
      const updatedUser = { ...user, tempPassword: false };
      cookie.set('auth_user', JSON.stringify(updatedUser), {
        path: '/',
        maxAge: 86400,
        sameSite: 'strict',
      });

      throw redirect(302, '/dashboard?message=password-updated');
    }
  } catch (error) {
    if (error instanceof Response && error.status === 302) {
      throw error;
    }
    return fail(500, { error: 'Failed to set password' });
  }
});
