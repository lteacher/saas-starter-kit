import { component$ } from '@builder.io/qwik';
import { UserSearch } from './user-search';
import { UserTable } from './user-table';
import { InviteUserButton } from './invite-user-button';
import { CreateUserButton } from './create-user-button';
import { usePermissions } from '../../context/permissions';

interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  roles: Array<{ id: string; name: string }>;
  createdAt?: string;
}

interface UsersTabProps {
  users: User[];
  total: number;
}

export const UsersTab = component$<UsersTabProps>(({ users, total }) => {
  const { canManageUsers } = usePermissions();

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <UserSearch />
        {canManageUsers && (
          <div class="flex gap-2">
            <CreateUserButton />
            <InviteUserButton />
          </div>
        )}
      </div>

      <UserTable users={users} canManage={canManageUsers} />

      <div class="text-sm text-base-content/70">Total users: {total}</div>
    </div>
  );
});
