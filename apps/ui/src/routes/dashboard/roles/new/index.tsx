import { component$ } from '@builder.io/qwik';
import { routeAction$, routeLoader$, Form } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import { RoleForm } from '../../../../components/roles/role-form';
import { client } from '../../../../lib/api-client';

export const useAvailablePermissions = routeLoader$(async () => {
  try {
    const response = await client.api.permissions.get();
    if (response.error) {
      console.error('Failed to fetch permissions:', response.error);
      return [];
    }
    return response.data?.permissions || [];
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return [];
  }
});

export const useCreateRole = routeAction$(async (data, { fail, redirect }) => {
  try {
    // Validate required fields
    if (!data.name || !data.description) {
      return fail(400, { error: 'Name and description are required' });
    }

    // Parse selected permissions
    let selectedPermissions: string[] = [];
    try {
      selectedPermissions = JSON.parse(data.selectedPermissions as string || '[]');
    } catch {
      selectedPermissions = [];
    }

    // Create role via API
    const response = await client.api.roles.post({
      name: data.name as string,
      description: data.description as string,
      isActive: data.isActive === 'on'
    });

    if (response.error) {
      return fail(400, { error: response.error.message || 'Failed to create role' });
    }

    // If permissions selected and role created, assign permissions
    if (selectedPermissions.length > 0 && response.data?.role?.id) {
      const permissionResponse = await client.api.roles({ id: response.data.role.id }).permissions.post({
        permissionIds: selectedPermissions
      });

      if (permissionResponse.error) {
        console.warn('Role created but failed to assign permissions:', permissionResponse.error);
      }
    }
    
    throw redirect(302, '/dashboard/roles');
  } catch (error) {
    if (error instanceof Error) {
      return fail(500, { error: error.message });
    }
    throw error;
  }
});

export default component$(() => {
  const availablePermissions = useAvailablePermissions();
  const createRoleAction = useCreateRole();
  
  return (
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex items-center gap-4">
        <a href="/dashboard/roles" class="btn btn-ghost btn-circle">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </a>
        <div>
          <h1 class="text-3xl font-bold">Create New Role</h1>
          <p class="text-base-content/60">Define a new role with custom permissions</p>
        </div>
      </div>

      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <Form action={createRoleAction}>
            <RoleForm 
              availablePermissions={availablePermissions.value}
              isLoading={createRoleAction.isRunning}
              error={createRoleAction.value?.error}
              submitLabel="Create Role"
            />
          </Form>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Create Role - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Create a new role with custom permissions' }],
};