import { component$, type QRL } from '@builder.io/qwik';
import type { Role } from '@saas-starter/types';

interface AvailableRolesProps {
  roles: Role[];
  onAssign$: QRL<(roleId: string) => void>;
  isLoading: boolean;
}

export const AvailableRoles = component$<AvailableRolesProps>(({ roles, onAssign$, isLoading }) => {
  return (
    <div>
      <h4 class="text-sm font-medium text-base-content/70 mb-2">Available Roles</h4>
      <div class="space-y-1">
        {roles.map((role) => (
          <div
            key={role.id}
            class="flex items-center justify-between p-2 bg-base-100 border rounded"
          >
            <div>
              <span class="text-sm font-medium">{role.name}</span>
              {role.description && <p class="text-xs text-base-content/70">{role.description}</p>}
            </div>
            <button
              class="btn btn-primary btn-xs"
              onClick$={() => onAssign$(role.id)}
              disabled={isLoading}
            >
              Assign
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});
