import { component$, type QRL } from '@builder.io/qwik';
import { type Permission } from '~/lib/constants';
import { FormField } from './form-field';

interface PermissionSelectorProps {
  permissions: Permission[];
  selectedPermissions: Permission[];
  onPermissionToggle$: QRL<(permission: Permission) => void>;
  label?: string;
  maxHeight?: string;
}

export const PermissionSelector = component$<PermissionSelectorProps>(
  ({
    permissions,
    selectedPermissions,
    onPermissionToggle$,
    label = 'Permissions',
    maxHeight = 'max-h-60',
  }) => {
    return (
      <FormField label={label} hint={`Selected: ${selectedPermissions.length} permissions`}>
        <div class={`space-y-2 ${maxHeight} overflow-y-auto border border-base-300 rounded-lg p-4`}>
          {permissions.map((permission) => (
            <label key={permission.name} class="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                class="checkbox checkbox-primary mt-1"
                checked={selectedPermissions.some((p) => p.name === permission.name)}
                onChange$={() => onPermissionToggle$(permission)}
              />
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm">{permission.name}</div>
                <div class="text-xs text-base-content/70">{permission.description}</div>
              </div>
            </label>
          ))}
        </div>
      </FormField>
    );
  },
);
