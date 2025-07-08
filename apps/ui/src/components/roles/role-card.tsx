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
}

export const RoleCard = component$<RoleCardProps>(({ role }) => {
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
    <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200 border border-base-300 hover:border-primary/50">
      <div class="card-body p-6">
        {/* Header */}
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="avatar placeholder">
              <div class={`rounded-full w-12 h-12 flex items-center justify-center ${
                role.isActive ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content'
              }`}>
                <span class="text-lg font-bold uppercase leading-none">
                  {role.name.charAt(0)}
                </span>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="card-title text-lg font-semibold mb-1 capitalize">{role.name}</h3>
              <div class="flex items-center gap-3">
                <div class={`badge badge-sm ${role.isActive ? 'badge-success' : 'badge-error'}`}>
                  {role.isActive ? 'Active' : 'Inactive'}
                </div>
                <span class="text-xs text-base-content/60">
                  {role.userCount || 0} users
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions Dropdown */}
          <div class="dropdown dropdown-end">
            <div tabIndex={0} role="button" class="btn btn-ghost btn-sm btn-circle hover:bg-base-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </div>
            <ul tabIndex={0} class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300">
              <li>
                <a href={`/dashboard/roles/${role.id}`} class="flex items-center gap-3">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  View Details
                </a>
              </li>
              <li>
                <a href={`/dashboard/roles/${role.id}/edit`} class="flex items-center gap-3">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit Role
                </a>
              </li>
              <div class="divider my-1"></div>
              <li>
                <button class="text-error flex items-center gap-3">
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
        <p class="text-sm text-base-content/70 mb-5 leading-relaxed">
          {role.description}
        </p>

        {/* Permissions */}
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="font-medium text-sm text-base-content/80">Permissions</h4>
            <span class="text-xs text-base-content/60 bg-base-200 px-2 py-1 rounded-full">
              {role.permissions.length} permissions
            </span>
          </div>
          
          <div class="space-y-3">
            {Object.entries(permissionGroups).map(([resource, permissions]) => (
              <div key={resource} class="bg-base-200 rounded-lg p-3">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium capitalize text-base-content">{resource}</span>
                  <span class="text-xs text-base-content/60">{permissions.length} actions</span>
                </div>
                <div class="flex flex-wrap gap-1">
                  {permissions.map((permission, index) => (
                    <div key={index} class="badge badge-primary badge-sm">
                      {permission.action}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {role.permissions.length === 0 && (
            <div class="text-center py-6 text-base-content/40">
              <div class="bg-base-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <p class="text-sm font-medium mb-1">No permissions assigned</p>
              <p class="text-xs text-base-content/50">This role has no access permissions</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
          <a href={`/dashboard/roles/${role.id}/edit`} class="btn btn-outline btn-sm">
            Edit Role
          </a>
          <a href={`/dashboard/roles/${role.id}`} class="btn btn-primary btn-sm">
            View Details
          </a>
        </div>
      </div>
    </div>
  );
});