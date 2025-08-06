import { component$ } from '@builder.io/qwik';
import { UserRow } from '../shared/user-row';
import type { User } from '@saas-starter/types';

interface UserTableProps {
  users: User[];
  canManage: boolean;
}

export const UserTable = component$<UserTableProps>(({ users, canManage }) => {
  if (users.length === 0) {
    return (
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body text-center py-8">
          <p class="text-base-content/70">No users found</p>
        </div>
      </div>
    );
  }

  return (
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body p-0">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Roles</th>
                <th>Status</th>
                <th>Created</th>
                {canManage && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow key={user.id} user={user} canManage={canManage} variant="compact" />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});
