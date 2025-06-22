import { component$, Slot } from '@builder.io/qwik';
import type { AuthUser } from '@saas-starter/types';

interface DashboardHeaderProps {
  user?: AuthUser | null;
}

export const DashboardHeader = component$<DashboardHeaderProps>(({ user }) => {
  return (
    <header class="navbar bg-base-100 border-b border-base-300 px-6">
      <div class="navbar-start">
        {/* Mobile menu button */}
        <label for="drawer-toggle" class="btn btn-square btn-ghost lg:hidden">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
        
        <div class="ml-4 lg:ml-0">
          <h2 class="text-xl font-semibold text-base-content">
            <Slot name="page-title">Dashboard</Slot>
          </h2>
          <p class="text-sm text-base-content/60">
            <Slot name="page-description">Welcome back, {user?.username}</Slot>
          </p>
        </div>
      </div>
      
      <div class="navbar-end">
        {/* Notifications */}
        <button class="btn btn-ghost btn-circle">
          <div class="indicator">
            <span class="indicator-item badge badge-primary badge-xs"></span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </div>
        </button>
        
        {/* Quick Actions */}
        <div class="dropdown dropdown-end">
          <div tabIndex={0} role="button" class="btn btn-primary btn-sm">
            Quick Actions
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          <ul tabIndex={0} class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
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