import { component$ } from '@builder.io/qwik';
import type { AuthUser, User } from '@saas-starter/types';
import { LuMoreHorizontal, LuEye, LuPencil, LuShield, LuBan, LuTrash } from '@qwikest/icons/lucide';

interface UserActionsUser {
  id: string;
  isActive: boolean;
}

interface UserActionsCallbacks {
  onView?: (userId: string) => void;
  onEdit?: (userId: string) => void;
  onRoleAssignment?: (userId: string) => void;
  onToggleActive?: (userId: string, isActive: boolean) => void;
  onDelete?: (userId: string) => void;
}

interface UserActionsProps {
  user: UserActionsUser;
  variant?: 'dropdown' | 'buttons';
  showRoleAssignment?: boolean;
  callbacks?: UserActionsCallbacks;
}

// Provides user management actions in either dropdown or button format
export const UserActions = component$<UserActionsProps>(
  ({ user, variant = 'dropdown', showRoleAssignment = false, callbacks = {} }) => {
    if (variant === 'buttons') {
      return (
        <div class="flex gap-2">
          {showRoleAssignment && callbacks.onRoleAssignment && (
            <button
              class="btn btn-ghost btn-sm"
              onClick$={() => callbacks.onRoleAssignment?.(user.id)}
            >
              <LuShield class="w-4 h-4 mr-1" />
              Roles
            </button>
          )}
          {callbacks.onEdit && (
            <button class="btn btn-ghost btn-sm" onClick$={() => callbacks.onEdit?.(user.id)}>
              <LuPencil class="w-4 h-4 mr-1" />
              Edit
            </button>
          )}
          {callbacks.onToggleActive && (
            <button
              class="btn btn-ghost btn-sm text-error"
              onClick$={() => callbacks.onToggleActive?.(user.id, user.isActive)}
            >
              <LuBan class="w-4 h-4 mr-1" />
              {user.isActive ? 'Deactivate' : 'Activate'}
            </button>
          )}
        </div>
      );
    }

    return (
      <div class="dropdown dropdown-end">
        <div tabIndex={0} role="button" class="btn btn-ghost btn-sm">
          <LuMoreHorizontal class="w-4 h-4" />
        </div>

        <ul
          tabIndex={0}
          class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          {callbacks.onView && (
            <li>
              <button onClick$={() => callbacks.onView?.(user.id)}>
                <LuEye class="w-4 h-4" />
                View Details
              </button>
            </li>
          )}

          {callbacks.onEdit && (
            <li>
              <button onClick$={() => callbacks.onEdit?.(user.id)}>
                <LuPencil class="w-4 h-4" />
                Edit User
              </button>
            </li>
          )}

          {callbacks.onRoleAssignment && (
            <li>
              <button onClick$={() => callbacks.onRoleAssignment?.(user.id)}>
                <LuShield class="w-4 h-4" />
                Manage Roles
              </button>
            </li>
          )}

          {(callbacks.onToggleActive || callbacks.onDelete) && <div class="divider my-1"></div>}

          {callbacks.onToggleActive && (
            <li>
              <button
                class={user.isActive ? 'text-warning' : 'text-success'}
                onClick$={() => callbacks.onToggleActive?.(user.id, user.isActive)}
              >
                <LuBan class="w-4 h-4" />
                {user.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </li>
          )}

          {callbacks.onDelete && (
            <li>
              <button class="text-error" onClick$={() => callbacks.onDelete?.(user.id)}>
                <LuTrash class="w-4 h-4" />
                Delete User
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  },
);
