import { component$, useSignal, $ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { UserProfile } from './user-profile';

export const Sidebar = component$(() => {
  const location = useLocation();
  const isCollapsed = useSignal(false);
  
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.url.pathname === '/dashboard';
    }
    return location.url.pathname.startsWith(path);
  };

  const toggleCollapse = $(() => {
    isCollapsed.value = !isCollapsed.value;
  });
  
  return (
    <div class="drawer-side">
      <label for="drawer-toggle" aria-label="close sidebar" class="drawer-overlay lg:hidden"></label>
      <aside class={`min-h-full bg-base-200 transition-all duration-300 ${
        isCollapsed.value ? 'w-16' : 'w-64'
      }`}>
        {/* Brand & Collapse Toggle */}
        <div class="p-4 border-b border-base-300">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="avatar placeholder">
                <div class="bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center">
                  <span class="text-base leading-none">🚀</span>
                </div>
              </div>
              {!isCollapsed.value && (
                <div>
                  <h1 class="text-lg font-bold">SaaS Starter</h1>
                  <p class="text-xs text-base-content/60">Admin Panel</p>
                </div>
              )}
            </div>
            
            {/* Collapse Toggle - Desktop Only */}
            <button 
              class="btn btn-ghost btn-sm hidden lg:flex"
              onClick$={toggleCollapse}
              aria-label={isCollapsed.value ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d={isCollapsed.value ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <ul class="menu p-2">
          <li>
            <a 
              href="/dashboard" 
              class={`${isActive('/dashboard') ? 'active' : ''} ${
                isCollapsed.value ? 'tooltip tooltip-right px-3' : ''
              }`}
              data-tip={isCollapsed.value ? 'Dashboard' : undefined}
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
              </svg>
              {!isCollapsed.value && <span>Dashboard</span>}
            </a>
          </li>
          
          {/* User Management Section */}
          {!isCollapsed.value && (
            <li class="menu-title">
              <span>User Management</span>
            </li>
          )}
          <li>
            <a 
              href="/dashboard/users" 
              class={`${isActive('/dashboard/users') ? 'active' : ''} ${
                isCollapsed.value ? 'tooltip tooltip-right px-3' : ''
              }`}
              data-tip={isCollapsed.value ? 'Users' : undefined}
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              {!isCollapsed.value && <span>Users</span>}
            </a>
          </li>
          <li>
            <a 
              href="/dashboard/roles" 
              class={`${isActive('/dashboard/roles') ? 'active' : ''} ${
                isCollapsed.value ? 'tooltip tooltip-right px-3' : ''
              }`}
              data-tip={isCollapsed.value ? 'Roles & Permissions' : undefined}
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              {!isCollapsed.value && <span>Roles & Permissions</span>}
            </a>
          </li>
          
          {/* System Section */}
          {!isCollapsed.value && (
            <li class="menu-title">
              <span>System</span>
            </li>
          )}
          <li>
            <a 
              href="/dashboard/settings" 
              class={`${isActive('/dashboard/settings') ? 'active' : ''} ${
                isCollapsed.value ? 'tooltip tooltip-right px-3' : ''
              }`}
              data-tip={isCollapsed.value ? 'Settings' : undefined}
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {!isCollapsed.value && <span>Settings</span>}
            </a>
          </li>
          <li>
            <a 
              href="/dashboard/audit" 
              class={`${isActive('/dashboard/audit') ? 'active' : ''} ${
                isCollapsed.value ? 'tooltip tooltip-right px-3' : ''
              }`}
              data-tip={isCollapsed.value ? 'Audit Logs' : undefined}
            >
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              {!isCollapsed.value && <span>Audit Logs</span>}
            </a>
          </li>
        </ul>

        {/* User Profile at Bottom */}
        <div class="mt-auto">
          <UserProfile isCollapsed={isCollapsed.value} />
        </div>
      </aside>
    </div>
  );
});