import { component$, type QRL } from '@builder.io/qwik';
import type { Role } from '@saas-starter/types';

interface CurrentRolesProps {
  roles: Role[];
  onRemove$: QRL<(roleId: string) => void>;
  isLoading: boolean;
}

export const CurrentRoles = component$<CurrentRolesProps>(({ roles, onRemove$, isLoading }) => {
  return (
    <div>
      <h4 class="text-sm font-medium text-base-content/70 mb-2">Current Roles</h4>
      <div class="space-y-1">
        {roles.length === 0 ? (
          <p class="text-xs text-base-content/50">No roles assigned</p>
        ) : (
          roles.map((role) => (
            <div key={role.id} class="flex items-center justify-between p-2 bg-base-200 rounded">
              <div>
                <span class="text-sm font-medium">{role.name}</span>
                {role.description && <p class="text-xs text-base-content/70">{role.description}</p>}
              </div>
              <button
                class="btn btn-ghost btn-xs text-error"
                onClick$={() => onRemove$(role.id)}
                disabled={isLoading}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
