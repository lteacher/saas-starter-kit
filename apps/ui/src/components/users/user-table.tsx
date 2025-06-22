import { component$ } from '@builder.io/qwik';
import type { AuthUser } from '@saas-starter/types';
import { UserRow } from './user-row';

interface UserTableProps {
  users: AuthUser[];
}

export const UserTable = component$<UserTableProps>(({ users }) => {
  return (
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body p-0">
        <div class="overflow-x-auto">
          <table class="table table-zebra table-compact">
            <thead>
              <tr class="text-xs">
                <th class="w-12">
                  <label>
                    <input type="checkbox" class="checkbox checkbox-sm" />
                  </label>
                </th>
                <th>User</th>
                <th class="w-24">Status</th>
                <th class="w-32">Roles</th>
                <th class="w-24">Created</th>
                <th class="w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div class="text-center py-12">
            <svg class="w-12 h-12 mx-auto text-base-content/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            <h3 class="text-lg font-medium text-base-content/60 mb-2">No users found</h3>
            <p class="text-base-content/40 mb-4">Get started by creating your first user account.</p>
            <a href="/dashboard/users/new" class="btn btn-primary">Add First User</a>
          </div>
        )}
      </div>
    </div>
  );
});