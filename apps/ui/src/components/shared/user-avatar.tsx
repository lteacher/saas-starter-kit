import { component$ } from '@builder.io/qwik';
import type { AuthUser, User } from '@saas-starter/types';

interface UserAvatarUser {
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatarUrl?: string;
}

interface UserAvatarProps {
  user: UserAvatarUser;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'neutral';
}

// Renders a user avatar with customizable size and color variants
export const UserAvatar = component$<UserAvatarProps>(
  ({ user, size = 'md', variant = 'primary' }) => {
    const sizeClasses = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
    };

    const textSizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-lg',
      lg: 'text-xl',
    };

    const colorClasses = {
      primary: 'bg-primary text-primary-content',
      neutral: 'bg-neutral text-neutral-content',
    };

    // Generates initials from user's name or email for display
    const getInitials = () => {
      if (user.firstName && user.lastName) {
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
      }
      if (user.username) {
        return user.username[0].toUpperCase();
      }
      return user.email[0].toUpperCase();
    };

    return (
      <div class="avatar placeholder">
        <div
          class={`rounded-full ${sizeClasses[size]} ${colorClasses[variant]} flex items-center justify-center`}
        >
          {'avatarUrl' in user && user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.username || 'User'} />
          ) : (
            <span class={`font-bold ${textSizeClasses[size]}`}>{getInitials()}</span>
          )}
        </div>
      </div>
    );
  },
);
