import { component$ } from '@builder.io/qwik';
import { usePermissions } from '../../context/permissions';
import { CreateRoleButton } from './create-role-button';

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Array<{ name: string; resource: string; action: string }>;
  isActive: boolean;
}

interface RolesTabProps {
  roles: Role[];
}

export const RolesTab = component$<RolesTabProps>(({ roles }) => {
  const { canManageRoles } = usePermissions();

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex-1">
          <input
            type="text"
            placeholder="Search roles..."
            class="input input-bordered w-full max-w-md"
          />
        </div>
        {canManageRoles && <CreateRoleButton />}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h3 class="card-title">{role.name}</h3>
              {role.description && <p class="text-sm text-base-content/70">{role.description}</p>}
              <div class="mt-4">
                <p class="text-sm font-medium mb-2">Permissions:</p>
                <div class="flex flex-wrap gap-1">
                  {role.permissions.map((permission, index) => (
                    <span key={index} class="badge badge-outline badge-xs">
                      {permission.name}
                    </span>
                  ))}
                </div>
              </div>
              {canManageRoles && (
                <div class="card-actions justify-end mt-4">
                  <button class="btn btn-sm btn-outline">Edit</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {roles.length === 0 && (
        <div class="text-center py-8">
          <p class="text-base-content/70">No roles found</p>
        </div>
      )}
    </div>
  );
});
