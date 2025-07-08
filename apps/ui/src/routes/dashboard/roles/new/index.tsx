import { component$, useSignal, $ } from '@builder.io/qwik';
import { routeAction$, Form, z, zod$ } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import { client } from '../../../../lib/api-client';

interface Permission {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export const useCreateRole = routeAction$(async (data, { fail, redirect }) => {
  try {
    // Parse permissions from the form
    let permissions: Permission[] = [];
    try {
      permissions = JSON.parse(data.permissions as string || '[]');
    } catch {
      permissions = [];
    }

    // Create role via API with embedded permissions
    const response = await client.api.roles.post({
      name: data.name,
      description: data.description
    });

    if (response.error) {
      return fail(400, { error: 'Failed to create role' });
    }

    // If permissions provided, update the role with permissions
    if (permissions.length > 0 && response.data?.id) {
      const permissionResponse = await client.api.roles({ id: response.data.id }).permissions.post({
        permissions: permissions
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
}, zod$({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  permissions: z.string().optional()
}));

export default component$(() => {
  const createRoleAction = useCreateRole();
  
  const permissions = useSignal<Permission[]>([]);
  const newPermission = useSignal({
    name: '',
    resource: '',
    action: '',
    description: ''
  });
  
  const addPermission = $(() => {
    if (newPermission.value.name && newPermission.value.resource && newPermission.value.action) {
      permissions.value = [...permissions.value, {...newPermission.value}];
      newPermission.value = { name: '', resource: '', action: '', description: '' };
    }
  });
  
  const removePermission = $((index: number) => {
    permissions.value = permissions.value.filter((_, i) => i !== index);
  });
  
  return (
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="bg-base-100 border border-base-300 rounded-lg p-6">
        <div class="flex items-center gap-4">
          <a href="/dashboard/roles" class="btn btn-ghost btn-circle">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </a>
          <div class="flex items-center gap-3">
            <div class="bg-primary/10 text-primary rounded-lg w-12 h-12 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold">Create New Role</h1>
              <p class="text-base-content/60">Define a new role with custom permissions and access controls</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Information */}
        <div class="card bg-base-100 shadow-lg border border-base-300">
          <div class="card-body">
            <h2 class="card-title mb-4">Role Information</h2>
            
            <Form action={createRoleAction} class="space-y-6">
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text font-medium">Name</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  class="input input-bordered w-full" 
                  placeholder="e.g. moderator, editor, viewer"
                  required 
                />
                <label class="label">
                  <span class="label-text-alt text-base-content/60">Role names should be lowercase and descriptive</span>
                </label>
              </div>
              
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text font-medium">Description</span>
                </label>
                <textarea 
                  name="description" 
                  class="textarea textarea-bordered w-full" 
                  rows={3}
                  placeholder="Describe what this role can do..."
                  required
                />
              </div>
              
              {/* Hidden field for permissions */}
              <input type="hidden" name="permissions" value={JSON.stringify(permissions.value)} />
              
              <div class="card-actions justify-end">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  disabled={createRoleAction.isRunning}
                >
                  {createRoleAction.isRunning ? 'Creating...' : 'Create Role'}
                </button>
              </div>
            </Form>
            
            {createRoleAction.value?.error && (
              <div class="alert alert-error mt-4">
                <svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{createRoleAction.value.error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Permissions */}
        <div class="card bg-base-100 shadow-lg border border-base-300">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <h2 class="card-title">Permissions</h2>
              <span class="text-sm text-base-content/60 bg-base-200 px-3 py-1 rounded-full">
                {permissions.value.length} permissions
              </span>
            </div>
            
            {/* Current Permissions List */}
            <div class="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {permissions.value.map((permission, index) => (
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
                  <button 
                    class="btn btn-ghost btn-xs text-error"
                    onClick$={() => removePermission(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              {permissions.value.length === 0 && (
                <div class="text-center py-4 text-base-content/40">
                  <p class="text-sm">No permissions added yet</p>
                </div>
              )}
            </div>
            
            {/* Add Permission Form */}
            <div class="divider">Add Permission</div>
            
            <div class="space-y-4">
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text text-sm font-medium">Permission Name</span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. usersRead, postsCreate"
                  class="input input-bordered input-sm w-full"
                  value={newPermission.value.name}
                  onInput$={(e) => {
                    newPermission.value = { ...newPermission.value, name: (e.target as HTMLInputElement).value };
                  }}
                />
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text text-sm font-medium">Resource</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. users, posts"
                    class="input input-bordered input-sm w-full"
                    value={newPermission.value.resource}
                    onInput$={(e) => {
                      newPermission.value = { ...newPermission.value, resource: (e.target as HTMLInputElement).value };
                    }}
                  />
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text text-sm font-medium">Action</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. read, create, update"
                    class="input input-bordered input-sm w-full"
                    value={newPermission.value.action}
                    onInput$={(e) => {
                      newPermission.value = { ...newPermission.value, action: (e.target as HTMLInputElement).value };
                    }}
                  />
                </div>
              </div>
              
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text text-sm font-medium">Description</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Optional description"
                  class="input input-bordered input-sm w-full"
                  value={newPermission.value.description}
                  onInput$={(e) => {
                    newPermission.value = { ...newPermission.value, description: (e.target as HTMLInputElement).value };
                  }}
                />
              </div>
              
              <button 
                class="btn btn-outline btn-sm w-full"
                onClick$={addPermission}
                disabled={!newPermission.value.name || !newPermission.value.resource || !newPermission.value.action}
              >
                Add Permission
              </button>
            </div>
            
            {/* Quick Permission Templates */}
            <div class="divider">Quick Templates</div>
            
            <div class="flex flex-wrap gap-2">
              <button 
                class="btn btn-ghost btn-xs"
                onClick$={() => {
                  newPermission.value = { name: 'users:read', resource: 'users', action: 'read', description: 'View users' };
                }}
              >
                + Users Read
              </button>
              <button 
                class="btn btn-ghost btn-xs"
                onClick$={() => {
                  newPermission.value = { name: 'users:create', resource: 'users', action: 'create', description: 'Create new users' };
                }}
              >
                + Users Create
              </button>
              <button 
                class="btn btn-ghost btn-xs"
                onClick$={() => {
                  newPermission.value = { name: 'roles:read', resource: 'roles', action: 'read', description: 'View roles' };
                }}
              >
                + Roles Read
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Create Role - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Create a new role with custom permissions' }],
};