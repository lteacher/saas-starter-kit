import { component$, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { useProtectedData } from '~/routes/(protected)/layout';
import { useAuth } from '~/context/auth';
import { LuSettings, LuLogOut } from '@qwikest/icons/lucide';

interface UserProfileProps {
  isCollapsed?: boolean;
}

export const UserProfile = component$<UserProfileProps>(({ isCollapsed = false }) => {
  const protectedData = useProtectedData();
  const auth = useAuth();
  const user = protectedData.value?.user;

  const handleLogout = $(async () => {
    await auth.logout();
  });

  if (isCollapsed) {
    return (
      <div class="p-2 border-t border-base-300">
        <div class="dropdown dropdown-top dropdown-end w-full">
          <div
            tabIndex={0}
            role="button"
            class="btn btn-ghost btn-square w-full tooltip tooltip-right"
            data-tip={user?.username || 'User'}
          >
            <div class="avatar placeholder">
              <div class="bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center">
                <span class="text-xs font-bold leading-none">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>

          <ul
            tabIndex={0}
            class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 mb-2 border border-base-300"
          >
            <li class="menu-title">
              <span>{user?.username || 'User'}</span>
            </li>
            <li>
              <a href="/settings">
                <LuSettings class="w-4 h-4" />
                Settings
              </a>
            </li>
            <div class="divider my-1"></div>
            <li>
              <button onClick$={handleLogout} class="text-error">
                <LuLogOut class="w-4 h-4" />
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
              <span class="text-sm font-bold leading-none">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div class="flex-1 text-left overflow-hidden">
            <p class="text-sm font-medium truncate">{user?.username || 'User'}</p>
            <p class="text-xs text-base-content/60 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        <ul
          tabIndex={0}
          class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 mb-2 border border-base-300"
        >
          <li class="menu-title">
            <span>Account</span>
          </li>
          <li>
            <a href="/settings">
              <LuSettings class="w-4 h-4" />
              Settings
            </a>
          </li>
          <div class="divider my-1"></div>
          <li>
            <button onClick$={handleLogout} class="text-error">
              <LuLogOut class="w-4 h-4" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
});
