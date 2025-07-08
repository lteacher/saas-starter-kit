import { component$, Slot } from '@builder.io/qwik';
import type { AuthUser } from '@saas-starter/types';

interface DashboardHeaderProps {
  user?: AuthUser | null;
}

export const DashboardHeader = component$<DashboardHeaderProps>(({ user }) => {
  return (
    <header class="navbar bg-base-100 border-b border-base-300 px-4 sm:px-6 lg:px-8 min-h-16">
      <div class="navbar-start flex items-center">
        {/* Mobile menu button */}
        <label for="drawer-toggle" class="btn btn-square btn-ghost lg:hidden mr-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
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
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
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
          <ul tabIndex={0} class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300">
            <li class="menu-title">
              <span class="text-base-content/80">{user?.username || 'User'}</span>
            </li>
            <li><a href="/dashboard/profile">Profile</a></li>
            <li><a href="/dashboard/settings">Settings</a></li>
            <div class="divider my-1"></div>
            <li><a class="text-error">Logout</a></li>
          </ul>
        </div>
        
        {/* Quick Actions */}
        <div class="dropdown dropdown-end">
          <div tabIndex={0} role="button" class="btn btn-primary btn-sm hidden sm:flex">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span class="hidden md:inline">Quick Actions</span>
          </div>
          <ul tabIndex={0} class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300">
            <li><a href="/dashboard/users/new">Add User</a></li>
            <li><a href="/dashboard/roles/new">Create Role</a></li>
            <li><a href="/dashboard/settings">System Settings</a></li>
            <li><a href="/dashboard/audit">View Logs</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
});