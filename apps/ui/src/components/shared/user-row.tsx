import { component$ } from '@builder.io/qwik';
import type { AuthUser, User } from '@saas-starter/types';
import { UserAvatar } from './user-avatar';
import { UserActions } from './user-actions';

interface UserRowProps {
  user: AuthUser | User;
  canManage?: boolean;
  showCheckbox?: boolean;
  showCreatedDate?: boolean;
  variant?: 'full' | 'compact';
}

export const UserRow = component$<UserRowProps>(
  ({ user, canManage = true, showCheckbox = false, showCreatedDate = true, variant = 'full' }) => {
    const formatDate = (date: Date | string) => {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(dateObj);
    };

    const getUserDisplayName = () => {
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      }
      return user.username || 'Unknown';
    };

    const getUserStatus = () => {
      if (user.isActive) {
        return <div class="badge badge-success badge-sm">Active</div>;
      }
      return <div class="badge badge-error badge-sm">Inactive</div>;
    };

    const getUserRoles = () => {
      if (!user.roles || user.roles.length === 0) {
        return <span class="text-xs opacity-60">No roles</span>;
      }

      return (
        <div class="flex flex-wrap gap-1">
          {user.roles.slice(0, 2).map((role, index) => (
            <div key={index} class="badge badge-outline badge-xs">
              {role.name}
            </div>
          ))}
          {user.roles.length > 2 && (
            <div class="badge badge-outline badge-xs">+{user.roles.length - 2}</div>
          )}
        </div>
      );
    };

    if (variant === 'compact') {
      return (
        <tr>
          <td>
            <div class="flex items-center space-x-3">
              <UserAvatar user={user} size="sm" />
              <div>
                <div class="font-medium">{getUserDisplayName()}</div>
                <div class="text-sm text-base-content/70">{user.email}</div>
              </div>
            </div>
          </td>
          <td>{getUserRoles()}</td>
          <td>{getUserStatus()}</td>
          {showCreatedDate && (
            <td class="text-sm text-base-content/70">
              {user.createdAt ? formatDate(user.createdAt) : 'Unknown'}
            </td>
          )}
          {canManage && (
            <td>
              <UserActions user={user} variant="buttons" />
            </td>
          )}
        </tr>
      );
    }

    return (
      <tr class="hover">
        {showCheckbox && (
          <td>
            <label>
              <input type="checkbox" class="checkbox checkbox-sm" />
            </label>
          </td>
        )}

        <td>
          <div class="flex items-center gap-2">
            <UserAvatar user={user} size="sm" />
            <div class="min-w-0">
              <div class="font-medium text-sm truncate">{getUserDisplayName()}</div>
              <div class="text-xs opacity-60 truncate">{user.email}</div>
            </div>
          </div>
        </td>

        <td>{getUserStatus()}</td>

        <td>{getUserRoles()}</td>

        {showCreatedDate && (
          <td>
            <span class="text-xs opacity-70">{formatDate(user.createdAt || new Date())}</span>
          </td>
        )}

        {canManage && (
          <td>
            <UserActions user={user} />
          </td>
        )}
      </tr>
    );
  },
);
