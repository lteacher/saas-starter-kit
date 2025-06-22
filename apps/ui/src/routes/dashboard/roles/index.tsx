import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import { RolesHeader } from '../../../components/roles/roles-header';
import { RolesGrid } from '../../../components/roles/roles-grid';
import { client } from '../../../lib/api-client';

export const useRolesData = routeLoader$(async () => {
  try {
    const [rolesResponse, permissionsResponse] = await Promise.all([
      client.api.roles.get(),
      client.api.permissions.get()
    ]);
    
    if (rolesResponse.error || permissionsResponse.error) {
      console.error('Failed to fetch roles or permissions:', {
        rolesError: rolesResponse.error,
        permissionsError: permissionsResponse.error
      });
      return { roles: [], permissions: [] };
    }
    
    return {
      roles: rolesResponse.data?.roles || [],
      permissions: permissionsResponse.data?.permissions || []
    };
  } catch (error) {
    console.error('Error fetching roles data:', error);
    return { roles: [], permissions: [] };
  }
});

export default component$(() => {
  const rolesData = useRolesData();
  
  return (
    <div class="space-y-6">
      <RolesHeader totalRoles={rolesData.value.roles.length} />
      <RolesGrid 
        roles={rolesData.value.roles} 
        permissions={rolesData.value.permissions} 
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Roles & Permissions - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Manage user roles and permissions' }],
};