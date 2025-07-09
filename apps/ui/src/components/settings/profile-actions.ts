import { routeAction$ } from '@builder.io/qwik-city';
import { client } from '../../lib/api-client';

export const useUpdateProfile = routeAction$(async (data, { cookie, fail }) => {
  try {
    const authToken = cookie.get('auth_token')?.value;
    if (!authToken) {
      return fail(401, { error: 'Not authenticated' });
    }

    const { userId, firstName, lastName, username } = data;

    // Use the existing users endpoint to update the profile
    const response = await client.api.users({ id: userId as string }).patch(
      {
        firstName: firstName as string,
        lastName: lastName as string,
        username: username as string,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );

    if (response.error) {
      return fail(400, { error: response.error.message });
    }

    return { success: true, user: response.data };
  } catch (error) {
    console.error('Profile update error:', error);
    return fail(500, { error: 'Failed to update profile' });
  }
});
