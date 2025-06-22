import { component$ } from '@builder.io/qwik';
import type { AuthUser } from '@saas-starter/types';
import { UserAvatar } from './user-avatar';
import { UserStatus } from './user-status';
import { UserActions } from './user-actions';

interface UserRowProps {
  user: AuthUser;
}

export const UserRow = component$<UserRowProps>(({ user }) => {
  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(dateObj);
  };

  return (
    <tr class="hover">
      <td>
        <label>
          <input type="checkbox" class="checkbox checkbox-sm" />
        </label>
      </td>
      
      <td>
        <div class="flex items-center gap-2">
          <UserAvatar user={user} size="sm" />
          <div class="min-w-0">
            <div class="font-medium text-sm truncate">
              {user.firstName} {user.lastName}
            </div>
            <div class="text-xs opacity-60 truncate">
              {user.email}
            </div>
          </div>
        </div>
      </td>
      
      <td>
        <UserStatus user={user} />
      </td>
      
      <td>
        <div class="flex flex-wrap gap-1">
          {user.roles?.slice(0, 2).map((role, index) => (
            <div key={index} class="badge badge-outline badge-xs">
              {role.name}
            </div>
          ))}
          {user.roles && user.roles.length > 2 && (
            <div class="badge badge-outline badge-xs">
              +{user.roles.length - 2}
            </div>
          )}
        </div>
      </td>
      
      <td>
        <span class="text-xs opacity-70">
          {formatDate(user.createdAt || new Date())}
        </span>
      </td>
      
      <td>
        <UserActions user={user} />
      </td>
    </tr>
  );
});