import { component$, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { useDashboardData } from '../../routes/dashboard/layout';

interface UserProfileProps {
  isCollapsed?: boolean;
}

export const UserProfile = component$<UserProfileProps>(({ isCollapsed = false }) => {
  const dashboardData = useDashboardData();
  const nav = useNavigate();
  const user = dashboardData.value?.user;

  const handleLogout = $(() => {
    // Clear cookies and redirect
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'auth_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('auth_user');
    nav('/login');
  });

  if (isCollapsed) {
    return (
      <div class="p-2 border-t border-base-300">
        <div class="dropdown dropdown-top dropdown-end w-full">
          <div tabIndex={0} role="button" class="btn btn-ghost btn-square w-full tooltip tooltip-right" data-tip={user?.username || 'User'}>
            <div class="avatar placeholder">
              <div class="bg-primary text-primary-content rounded-full w-8">
                <span class="text-xs font-bold">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>
          
          <ul tabIndex={0} class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mb-2">
            <li class="menu-title">
              <span>{user?.username || 'User'}</span>
            </li>
            <li>
              <a href="/dashboard/profile">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Edit Profile
              </a>
            </li>
            <div class="divider my-1"></div>
            <li>
              <button onClick$={handleLogout} class="text-error">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div class="p-4 border-t border-base-300">
      <div class="dropdown dropdown-top dropdown-end w-full">
        <div tabIndex={0} role="button" class="btn btn-ghost w-full justify-start p-2">
          <div class="avatar placeholder">
            <div class="bg-primary text-primary-content rounded-full w-10">
              <span class="text-sm font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div class="flex-1 text-left overflow-hidden">
            <p class="text-sm font-medium truncate">
              {user?.username || 'User'}
            </p>
            <p class="text-xs text-base-content/60 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
        
        <ul tabIndex={0} class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mb-2">
          <li class="menu-title">
            <span>Account</span>
          </li>
          <li>
            <a href="/dashboard/profile">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Edit Profile
            </a>
          </li>
          <li>
            <a href="/dashboard/settings">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Preferences
            </a>
          </li>
          <div class="divider my-1"></div>
          <li>
            <button onClick$={handleLogout} class="text-error">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
});