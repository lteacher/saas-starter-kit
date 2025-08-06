import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$, type RequestHandler } from '@builder.io/qwik-city';
import { Sidebar } from '~/components/dashboard/sidebar';
import { DashboardHeader } from '~/components/dashboard/header';
import { client } from '~/lib/api-client';
import type { User } from '@saas-starter/types';

// Server-side auth protection for all protected routes
export const onRequest: RequestHandler = async ({ cookie, redirect }) => {
  const authToken = cookie.get('auth_token')?.value;
  const storedUser = cookie.get('auth_user')?.value;

  if (!authToken || !storedUser) {
    throw redirect(302, '/login');
  }

  try {
    // Validate token by making an API call
    const response = await client.api.users.get({
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (response.error) {
      throw redirect(302, '/login');
    }

    const user = JSON.parse(storedUser);
    return { user };
  } catch {
    throw redirect(302, '/login');
  }
};

export const useProtectedData = routeLoader$(async ({ cookie }) => {
  const storedUser = cookie.get('auth_user')?.value;
  const authToken = cookie.get('auth_token')?.value;

  if (storedUser && authToken) {
    const user = JSON.parse(storedUser);

    try {
      // Fetch real stats using treaty client
      const [usersResponse, rolesResponse] = await Promise.all([
        client.api.users.get({
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        client.api.roles.get({
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      ]);

      const usersData = usersResponse.data;
      const rolesData = rolesResponse.data;

      return {
        user,
        stats: {
          totalUsers: usersData?.pagination?.totalItems || 0,
          totalRoles: rolesData?.length || 0,
          activeUsers: usersData?.items?.filter((u: User) => u.isActive)?.length || 0,
          pendingUsers: usersData?.items?.filter((u: User) => u.status === 'pending')?.length || 0,
        },
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      return {
        user,
        stats: {
          totalUsers: 0,
          totalRoles: 0,
          activeUsers: 0,
          pendingUsers: 0,
        },
      };
    }
  }

  return null;
});

export default component$(() => {
  const protectedData = useProtectedData();

  return (
    <div class="drawer lg:drawer-open">
      <input id="drawer-toggle" type="checkbox" class="drawer-toggle" />
      <input id="sidebar-collapse" type="checkbox" class="hidden" />

      {/* Page content */}
      <div class="drawer-content flex flex-col">
        <DashboardHeader user={protectedData.value?.user} />

        <main class="flex-1 min-h-screen bg-base-100">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Slot />
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <Sidebar />
    </div>
  );
});
