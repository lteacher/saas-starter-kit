import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { AuthProvider } from '../context/auth';

export const useAuthLoader = routeLoader$(async ({ cookie }) => {
  const authToken = cookie.get('auth_token')?.value;
  const storedUser = cookie.get('auth_user')?.value;
  
  if (authToken && storedUser) {
    try {
      // Validate token with API in real implementation
      return {
        user: JSON.parse(storedUser),
        isAuthenticated: true,
      };
    } catch {
      return { user: null, isAuthenticated: false };
    }
  }
  
  return { user: null, isAuthenticated: false };
});

export default component$(() => {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
});