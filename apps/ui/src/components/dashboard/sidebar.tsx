import { component$, useSignal, $ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { UserProfile } from './user-profile';
import { useAuth } from '../../context/auth';
import { usePermissions } from '../../context/permissions';
import {
  LuChevronLeft,
  LuChevronRight,
  LuLayoutDashboard,
  LuShield,
  LuSettings,
} from '@qwikest/icons/lucide';

export const Sidebar = component$(() => {
  const location = useLocation();
  const auth = useAuth();
  const permissions = usePermissions();
  const isCollapsed = useSignal(false);

  const hasAccessControlPermissions =
    permissions.state.value.canManageUsers || permissions.state.value.canManageRoles;

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
      <label
        for="drawer-toggle"
        aria-label="close sidebar"
        class="drawer-overlay lg:hidden"
      ></label>
      <aside
        class={`min-h-full bg-base-200 transition-all duration-300 ${
          isCollapsed.value ? 'w-16' : 'w-64'
        }`}
      >
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
                  <p class="text-xs text-base-content/60">Dashboard</p>
                </div>
              )}
            </div>

            {/* Collapse Toggle - Desktop Only */}
            <button
              class="btn btn-ghost btn-sm hidden lg:flex"
              onClick$={toggleCollapse}
              aria-label={isCollapsed.value ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed.value ? (
                <LuChevronRight class="w-4 h-4" />
              ) : (
                <LuChevronLeft class="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <ul class="menu p-2">
          {/* Dashboard */}
          <li>
            <a
              href="/dashboard"
              class={`${isActive('/dashboard') ? 'active' : ''} ${
                isCollapsed.value ? 'tooltip tooltip-right px-3' : ''
              }`}
              data-tip={isCollapsed.value ? 'Dashboard' : undefined}
            >
              <LuLayoutDashboard class="w-5 h-5 shrink-0" />
              {!isCollapsed.value && <span>Dashboard</span>}
            </a>
          </li>

          {/* Access Control Section - Admin Only */}
          {hasAccessControlPermissions && (
            <>
              {!isCollapsed.value && (
                <li class="menu-title">
                  <span>Access Control</span>
                </li>
              )}
              <li>
                <a
                  href="/access-control"
                  class={`${isActive('/access-control') ? 'active' : ''} ${
                    isCollapsed.value ? 'tooltip tooltip-right px-3' : ''
                  }`}
                  data-tip={isCollapsed.value ? 'Access Control' : undefined}
                >
                  <LuShield class="w-5 h-5 shrink-0" />
                  {!isCollapsed.value && <span>Access Control</span>}
                </a>
              </li>
            </>
          )}

          {/* Settings Section */}
          {!isCollapsed.value && (
            <li class="menu-title">
              <span>Settings</span>
            </li>
          )}
          <li>
            <a
              href="/settings"
              class={`${isActive('/settings') ? 'active' : ''} ${
                isCollapsed.value ? 'tooltip tooltip-right px-3' : ''
              }`}
              data-tip={isCollapsed.value ? 'Settings' : undefined}
            >
              <LuSettings class="w-5 h-5 shrink-0" />
              {!isCollapsed.value && <span>Settings</span>}
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
