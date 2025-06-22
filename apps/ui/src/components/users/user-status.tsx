import { component$ } from '@builder.io/qwik';
import type { AuthUser } from '@saas-starter/types';

interface UserStatusProps {
  user: AuthUser;
}

export const UserStatus = component$<UserStatusProps>(({ user }) => {
  return (
    <div class="flex flex-col gap-1">
      {/* Active Status */}
      <div class={`badge badge-xs ${user.isActive ? 'badge-success' : 'badge-error'}`}>
        {user.isActive ? 'Active' : 'Inactive'}
      </div>
      
      {/* Verification Status */}
      <div class={`badge badge-xs ${user.isVerified ? 'badge-info' : 'badge-warning'}`}>
        {user.isVerified ? '✓' : '!'}
      </div>
    </div>
  );
});