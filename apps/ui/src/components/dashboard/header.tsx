import { component$, Slot, $ } from '@builder.io/qwik';
import { useAuth } from '../../context/auth';
import type { AuthUser } from '@saas-starter/types';
import { LuMenu, LuBell, LuPlus } from '@qwikest/icons/lucide';

interface DashboardHeaderProps {
  user?: AuthUser | null;
}

export const DashboardHeader = component$<DashboardHeaderProps>(({ user }) => {
  const auth = useAuth();

  const handleLogout = $(async () => {
    await auth.logout();
  });
  return (
    <header class="navbar bg-base-100 border-b border-base-300 px-4 sm:px-6 lg:px-8 min-h-16">
      <div class="navbar-start flex items-center">
        {/* Mobile menu button */}
        <label for="drawer-toggle" class="btn btn-square btn-ghost lg:hidden mr-2">
          <LuMenu class="w-5 h-5" />
        </label>

        <div class="flex flex-col justify-center">
          <h2 class="text-lg sm:text-xl font-semibold text-base-content leading-tight">
            <Slot name="page-title">Dashboard</Slot>
          </h2>
          <p class="text-xs sm:text-sm text-base-content/60 leading-tight">
            <Slot name="page-description">Welcome back, {user?.username}</Slot>
          </p>
        </div>
      </div>

      <div class="navbar-end flex items-center gap-2">
        {/* Notifications */}
        <button class="btn btn-ghost btn-circle btn-sm">
          <div class="indicator">
            <span class="indicator-item badge badge-primary badge-xs"></span>
            <LuBell class="w-4 h-4" />
          </div>
        </button>

        {/* User Profile */}
        <div class="dropdown dropdown-end">
          <div tabIndex={0} role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
              <span class="text-sm font-semibold leading-none">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <ul
            tabIndex={0}
            class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300"
          >
            <li class="menu-title">
              <span class="text-base-content/80">{user?.username || 'User'}</span>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
            <div class="divider my-1"></div>
            <li>
              <button onClick$={handleLogout} class="text-error">
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div class="dropdown dropdown-end">
          <div tabIndex={0} role="button" class="btn btn-primary btn-sm hidden sm:flex">
            <LuPlus class="w-4 h-4" />
            <span class="hidden md:inline">Quick Actions</span>
          </div>
          <ul
            tabIndex={0}
            class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300"
          >
            <li>
              <a href="/access-control">Access Control</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
            <li>
              <a href="/dashboard/audit">View Logs</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
});
