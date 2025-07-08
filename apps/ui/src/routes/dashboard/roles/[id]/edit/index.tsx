import { component$ } from '@builder.io/qwik';
import { routeLoader$, Form, routeAction$, z, zod$ } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import { client } from '../../../../../lib/api-client';

interface Permission {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  permissions: Permission[];
}

export const useRoleData = routeLoader$<Role | null>(async (requestEvent) => {
  const roleId = requestEvent.params.id;
  
  try {
    const response = await client.api.roles({ id: roleId }).get();
    
    if (response.error) {
      console.error('Failed to fetch role:', response.error);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching role:', error);
    return null;
  }
});

export const useUpdateRole = routeAction$(async (data, requestEvent) => {
  const roleId = requestEvent.params.id;
  
  try {
    const response = await client.api.roles({ id: roleId }).patch({
      name: data.name,
      description: data.description
    });
    
    if (response.error) {
      return {
        success: false,
        error: 'Failed to update role'
      };
    }
    
    return {
      success: true,
      role: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: 'An error occurred while updating the role'
    };
  }
}, zod$({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters')
}));

export default component$(() => {
  const roleData = useRoleData();
  const updateRoleAction = useUpdateRole();
  
  if (!roleData.value) {
    return (
      <div class="alert alert-error">
        <svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Role not found</span>
      </div>
    );
  }

  const role = roleData.value;
  
  return (
    <div class="space-y-6">
      {/* Header */}
      <div class="flex items-center gap-4">
        <a href={`/dashboard/roles/${role.id}`} class="btn btn-ghost btn-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Role
        </a>
        <div class="divider divider-horizontal"></div>
        <div>
          <h1 class="text-3xl font-bold">Edit {role.name}</h1>
          <p class="text-base-content/60">Update role information and permissions</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info Form */}
        <div class="card bg-base-200 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Role Information</h2>
            
            <Form action={updateRoleAction} class="space-y-6">
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text font-medium">Name</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={role.name}
                  class="input input-bordered w-full" 
                  required 
                />
              </div>
              
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text font-medium">Description</span>
                </label>
                <textarea 
                  name="description" 
                  value={role.description}
                  class="textarea textarea-bordered w-full" 
                  rows={3}
                  required
                />
              </div>
              
              <div class="card-actions justify-end">
                <button type="submit" class="btn btn-primary">
                  Update Role
                </button>
              </div>
            </Form>
            
            {updateRoleAction.value?.success && (
              <div class="alert alert-success mt-4">
                <svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Role updated successfully!</span>
              </div>
            )}
            
            {updateRoleAction.value?.error && (
              <div class="alert alert-error mt-4">
                <svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{updateRoleAction.value.error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Permissions Display */}
        <div class="card bg-base-200 shadow-xl">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <h2 class="card-title">Permissions</h2>
              <span class="text-sm text-base-content/60">
                {role.permissions.length} permissions
              </span>
            </div>
            
            {/* Current Permissions - Read Only for now */}
            <div class="space-y-2 mb-4">
              {role.permissions.map((permission, index) => (
                <div key={index} class="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                  <div>
                    <div class="font-medium">{permission.name}</div>
                    <div class="text-sm text-base-content/70">
                      {permission.resource} : {permission.action}
                    </div>
                    {permission.description && (
                      <div class="text-xs text-base-content/50 mt-1">{permission.description}</div>
                    )}
                  </div>
                  <div class="badge badge-primary badge-sm">{permission.action}</div>
                </div>
              ))}
              
              {role.permissions.length === 0 && (
                <div class="text-center py-8 text-base-content/40">
                  <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 class="text-lg font-medium mb-2">No permissions assigned</h3>
                  <p class="text-sm">This role has no permissions assigned to it.</p>
                </div>
              )}
            </div>
            
            {/* Note about permission editing */}
            <div class="alert alert-info">
              <svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 class="font-bold">Permission Management</h3>
                <div class="text-sm">Permission editing functionality will be added in a future update. For now, permissions are managed through the API or database directly.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Edit Role - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Edit role information and permissions' }],
};