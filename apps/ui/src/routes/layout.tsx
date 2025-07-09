import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { AuthProvider } from '../context/auth';
import { PermissionsProvider } from '../context/permissions';
import { client } from '../lib/api-client';

export const useAuthLoader = routeLoader$(async ({ cookie }) => {
  const authToken = cookie.get('auth_token')?.value;
  const storedUser = cookie.get('auth_user')?.value;

  if (authToken && storedUser) {
    try {
      const user = JSON.parse(storedUser);

      // Validate token with actual API call to get current user
      const response = await client.api.users({ id: user.id }).get({
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.error) {
        return { user: null, isAuthenticated: false };
      }

      return {
        user,
        isAuthenticated: true,
      };
    } catch {
      return { user: null, isAuthenticated: false };
    }
  }

  return { user: null, isAuthenticated: false };
});

export default component$(() => {
  const authData = useAuthLoader();

  return (
    <AuthProvider initialUser={authData.value.user}>
      <PermissionsProvider>
        <Slot />
      </PermissionsProvider>
    </AuthProvider>
  );
});
