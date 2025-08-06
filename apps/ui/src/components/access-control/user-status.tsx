import { component$ } from '@builder.io/qwik';

interface UserStatusProps {
  isActive: boolean;
}

export const UserStatus = component$<UserStatusProps>(({ isActive }) => {
  const getBadgeClass = () => {
    return isActive ? 'badge badge-success' : 'badge badge-error';
  };

  return <span class={getBadgeClass()}>{isActive ? 'active' : 'inactive'}</span>;
});
