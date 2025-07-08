import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$, type RequestHandler } from '@builder.io/qwik-city';
import { Sidebar } from '../../components/dashboard/sidebar';
import { DashboardHeader } from '../../components/dashboard/header';

// Server-side auth protection
export const onRequest: RequestHandler = async ({ cookie, redirect }) => {
  const authToken = cookie.get('auth_token')?.value;
  const storedUser = cookie.get('auth_user')?.value;
  
  if (!authToken || !storedUser) {
    throw redirect(302, '/login');
  }
  
  // In a real app, validate the token with your API
  try {
    const user = JSON.parse(storedUser);
    return { user };
  } catch {
    throw redirect(302, '/login');
  }
};

export const useDashboardData = routeLoader$(async ({ cookie }) => {
  const storedUser = cookie.get('auth_user')?.value;
  
  if (storedUser) {
    const user = JSON.parse(storedUser);
    return {
      user,
      stats: {
        totalUsers: 1,
        activeSessions: 1,
        accountStatus: 'Active'
      }
    };
  }
  
  return null;
});

export default component$(() => {
  const dashboardData = useDashboardData();
  
  return (
    <div class="drawer lg:drawer-open">
      <input id="drawer-toggle" type="checkbox" class="drawer-toggle" />
      <input id="sidebar-collapse" type="checkbox" class="hidden" />
      
      {/* Page content */}
      <div class="drawer-content flex flex-col">
        <DashboardHeader user={dashboardData.value?.user} />
        
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