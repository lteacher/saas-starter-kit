import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import { UserTable } from '../../../components/users/user-table';
import { UsersHeader } from '../../../components/users/users-header';
import { client } from '../../../lib/api-client';

export const useUsersData = routeLoader$(async ({ query }) => {
  try {
    const limit = parseInt(query.get('limit') || '20');
    const offset = parseInt(query.get('offset') || '0');
    
    const response = await client.api.users.get({ query: { limit, offset } });
    
    if (response.error) {
      console.error('Failed to fetch users:', response.error);
      return {
        users: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0 }
      };
    }
    
    const users = response.data?.users || [];
    const total = users.length;
    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);
    
    return {
      users,
      pagination: { total, page, limit, totalPages }
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      users: [],
      pagination: { total: 0, page: 1, limit: 20, totalPages: 0 }
    };
  }
});

export default component$(() => {
  const usersData = useUsersData();
  
  return (
    <div class="space-y-6">
      <UsersHeader totalUsers={usersData.value.pagination.total} />
      <UserTable users={usersData.value.users} />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Users - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Manage users and their permissions' }],
};