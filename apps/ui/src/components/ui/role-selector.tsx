import { component$, type QRL } from '@builder.io/qwik';
import { FormField } from './form-field';

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface RoleSelectorProps {
  roles: Role[];
  selectedRoles: string[];
  onRoleToggle$: QRL<(roleId: string) => void>;
  label?: string;
  required?: boolean;
  maxHeight?: string;
}

export const RoleSelector = component$<RoleSelectorProps>(
  ({
    roles,
    selectedRoles,
    onRoleToggle$,
    label = 'Roles',
    required = false,
    maxHeight = 'max-h-32',
  }) => {
    return (
      <FormField label={label} required={required}>
        <div class={`space-y-2 ${maxHeight} overflow-y-auto`}>
          {roles.map((role) => (
            <label key={role.id} class="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                class="checkbox checkbox-primary"
                checked={selectedRoles.includes(role.id)}
                onChange$={() => onRoleToggle$(role.id)}
              />
              <span class="label-text">{role.name}</span>
              {role.description && (
                <span class="text-sm text-base-content/70">- {role.description}</span>
              )}
            </label>
          ))}
        </div>
      </FormField>
    );
  },
);
