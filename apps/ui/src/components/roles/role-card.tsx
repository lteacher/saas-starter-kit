import { component$ } from '@builder.io/qwik';

interface Permission {
  id?: string;
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
  userCount: number;
  permissions: Permission[];
}

interface RoleCardProps {
  role: Role;
  allPermissions: Permission[];
}

export const RoleCard = component$<RoleCardProps>(({ role, allPermissions }) => {
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
    <div class="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
      <div class="card-body">
        {/* Header */}
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="avatar placeholder">
              <div class={`rounded-full w-12 ${
                role.isActive ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content'
              }`}>
                <span class="text-lg font-bold">
                  {role.name.charAt(0)}
                </span>
              </div>
            </div>
            <div>
              <h3 class="card-title text-lg">{role.name}</h3>
              <div class="flex items-center gap-2">
                <div class={`badge badge-xs ${role.isActive ? 'badge-success' : 'badge-error'}`}>
                  {role.isActive ? 'Active' : 'Inactive'}
                </div>
                <span class="text-xs opacity-60">{role.userCount} users</span>
              </div>
            </div>
          </div>
          
          {/* Actions Dropdown */}
          <div class="dropdown dropdown-end">
            <div tabIndex={0} role="button" class="btn btn-ghost btn-sm btn-circle">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </div>
            <ul tabIndex={0} class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a href={`/dashboard/roles/${role.id}`}>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  View Details
                </a>
              </li>
              <li>
                <a href={`/dashboard/roles/${role.id}/edit`}>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit Role
                </a>
              </li>
              <div class="divider my-1"></div>
              <li>
                <button class="text-error">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete Role
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Description */}
        <p class="text-sm text-base-content/70 mb-4">
          {role.description}
        </p>

        {/* Permissions */}
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-medium text-sm">Permissions</h4>
            <span class="text-xs opacity-60">
              {role.permissions.length} of {allPermissions.length}
            </span>
          </div>
          
          <div class="space-y-2">
            {Object.entries(permissionGroups).map(([resource, permissions]) => (
              <div key={resource} class="flex items-center justify-between py-1">
                <span class="text-sm font-medium capitalize">{resource}</span>
                <div class="flex gap-1">
                  {permissions.map((permission, index) => (
                    <div key={index} class="badge badge-primary badge-xs">
                      {permission.action}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {role.permissions.length === 0 && (
            <div class="text-center py-4 text-base-content/40">
              <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <p class="text-xs">No permissions assigned</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div class="card-actions justify-end mt-4">
          <a href={`/dashboard/roles/${role.id}/edit`} class="btn btn-outline btn-sm">
            Edit Permissions
          </a>
          <a href={`/dashboard/roles/${role.id}`} class="btn btn-primary btn-sm">
            View Details
          </a>
        </div>
      </div>
    </div>
  );
});