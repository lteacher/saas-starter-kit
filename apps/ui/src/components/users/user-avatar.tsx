import { component$ } from '@builder.io/qwik';
import type { AuthUser } from '@saas-starter/types';

interface UserAvatarProps {
  user: AuthUser;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const UserAvatar = component$<UserAvatarProps>(({ user, size = 'md' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8', 
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-lg', 
    lg: 'text-xl'
  };

  return (
    <div class="avatar placeholder">
      <div class={`bg-primary text-primary-content rounded-full ${sizeClasses[size]}`}>
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.username} />
        ) : (
          <span class={`font-bold ${textSizeClasses[size]}`}>
            {user.firstName?.charAt(0) || user.username?.charAt(0).toUpperCase() || 'U'}
          </span>
        )}
      </div>
    </div>
  );
});