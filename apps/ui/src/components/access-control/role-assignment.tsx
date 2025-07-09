import { component$, useSignal, $ } from '@builder.io/qwik';
import { CurrentRoles } from './current-roles';
import { AvailableRoles } from './available-roles';
import { useAssignRole, useRemoveRole } from './role-actions';
import { useRoles } from '../../context/roles';
import type { User } from '@saas-starter/types';

interface RoleAssignmentProps {
  user: User;
}

export const RoleAssignment = component$<RoleAssignmentProps>(({ user }) => {
  const isOpen = useSignal(false);
  const assignAction = useAssignRole();
  const removeAction = useRemoveRole();
  const { availableRoles } = useRoles();

  const assignedRoleIds = new Set(user.roles.map((role) => role.id));
  const availableRolesToAdd = availableRoles.value.filter((role) => !assignedRoleIds.has(role.id));

  const handleToggle = $(() => {
    isOpen.value = !isOpen.value;
  });

  const handleAssign = $((roleId: string) => {
    assignAction.submit({ userId: user.id, roleId });
  });

  const handleRemove = $((roleId: string) => {
    removeAction.submit({ userId: user.id, roleId });
  });

  return (
    <div class="dropdown dropdown-end">
      <div tabIndex={0} role="button" class="btn btn-ghost btn-sm" onClick$={handleToggle}>
        Manage Roles
      </div>

      {isOpen.value && (
        <div class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-80">
          <div class="p-2">
            <h3 class="font-medium mb-3">Role Assignment</h3>

            {(assignAction.value?.error || removeAction.value?.error) && (
              <div class="alert alert-error alert-sm mb-3">
                <span class="text-xs">
                  {assignAction.value?.error || removeAction.value?.error}
                </span>
              </div>
            )}

            <div class="space-y-3">
              <CurrentRoles
                roles={user.roles}
                onRemove$={handleRemove}
                isLoading={removeAction.isRunning}
              />

              {availableRolesToAdd.length > 0 && (
                <AvailableRoles
                  roles={availableRolesToAdd}
                  onAssign$={handleAssign}
                  isLoading={assignAction.isRunning}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
