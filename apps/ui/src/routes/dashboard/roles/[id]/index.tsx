import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import { client } from '../../../../lib/api-client';

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

export default component$(() => {
  const roleData = useRoleData();
  
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
  
  const getPermissionsByResource = () => {
    const grouped: Record<string, Permission[]> = {};
    role.permissions.forEach(permission => {
      if (!grouped[permission.resource]) {
        grouped[permission.resource] = [];
      }
      grouped[permission.resource].push(permission);
    });
    return grouped;
  };

  const permissionGroups = getPermissionsByResource();

  return (
    <div class="space-y-6">
      {/* Header */}
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a href="/dashboard/roles" class="btn btn-ghost btn-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Roles
          </a>
          <div class="divider divider-horizontal"></div>
          <div>
            <h1 class="text-3xl font-bold">{role.name}</h1>
            <p class="text-base-content/60">{role.description}</p>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <div class={`badge ${role.isActive ? 'badge-success' : 'badge-error'}`}>
            {role.isActive ? 'Active' : 'Inactive'}
          </div>
          <a href={`/dashboard/roles/${role.id}/edit`} class="btn btn-primary">
            Edit Role
          </a>
        </div>
      </div>

      {/* Role Details */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div class="card bg-base-100 shadow-lg border border-base-300">
          <div class="card-body">
            <h2 class="card-title mb-4">Role Information</h2>
            <div class="space-y-4">
              <div>
                <label class="label">
                  <span class="label-text font-medium">Name</span>
                </label>
                <p class="text-lg">{role.name}</p>
              </div>
              <div>
                <label class="label">
                  <span class="label-text font-medium">Description</span>
                </label>
                <p class="text-sm text-base-content/70">{role.description}</p>
              </div>
              <div>
                <label class="label">
                  <span class="label-text font-medium">Status</span>
                </label>
                <div class={`badge ${role.isActive ? 'badge-success' : 'badge-error'}`}>
                  {role.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div>
                <label class="label">
                  <span class="label-text font-medium">Created</span>
                </label>
                <p class="text-sm">{new Date(role.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div class="lg:col-span-2">
          <div class="card bg-base-100 shadow-lg border border-base-300">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <h2 class="card-title">Permissions</h2>
                <span class="text-sm text-base-content/60 bg-base-200 px-3 py-1 rounded-full">
                  {role.permissions.length} permissions
                </span>
              </div>
              
              {role.permissions.length > 0 ? (
                <div class="space-y-4">
                  {Object.entries(permissionGroups).map(([resource, permissions]) => (
                    <div key={resource} class="border border-base-300 rounded-lg p-4">
                      <h3 class="font-medium text-lg capitalize mb-3">{resource}</h3>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {permissions.map((permission, index) => (
                          <div key={index} class="flex items-center justify-between p-3 bg-base-100 rounded-md">
                            <div>
                              <span class="font-medium">{permission.action}</span>
                              {permission.description && (
                                <p class="text-xs text-base-content/60 mt-1">{permission.description}</p>
                              )}
                            </div>
                            <div class="badge badge-primary badge-sm">{permission.action}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div class="text-center py-8 text-base-content/40">
                  <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 class="text-lg font-medium mb-2">No permissions assigned</h3>
                  <p class="text-sm">This role has no permissions assigned to it.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Role Details - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'View role details and permissions' }],
};