import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import { RolesHeader } from '../../../components/roles/roles-header';
import { RolesGrid } from '../../../components/roles/roles-grid';
import { client } from '../../../lib/api-client';

export const useRolesData = routeLoader$(async () => {
  try {
    const rolesResponse = await client.api.roles.get();
    
    if (rolesResponse.error) {
      console.error('Failed to fetch roles:', rolesResponse.error);
      return { roles: [] };
    }
    
    return {
      roles: rolesResponse.data || []
    };
  } catch (error) {
    console.error('Error fetching roles data:', error);
    return { roles: [] };
  }
});

export default component$(() => {
  const rolesData = useRolesData();
  
  return (
    <div>
      <RolesHeader totalRoles={rolesData.value.roles.length} />
      <RolesGrid 
        roles={rolesData.value.roles} 
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Roles & Permissions - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Manage user roles and permissions' }],
};