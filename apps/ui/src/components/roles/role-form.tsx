import { component$, useSignal, $ } from '@builder.io/qwik';
import { FormField } from '../ui/form-field';
import { Alert } from '../ui/alert';

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

interface PermissionGroup {
  resource: string;
  permissions: Permission[];
}

interface RoleFormProps {
  availablePermissions: Permission[];
  isLoading?: boolean;
  error?: string;
  submitLabel?: string;
  initialData?: {
    name?: string;
    description?: string;
    isActive?: boolean;
    selectedPermissions?: string[];
  };
}

export const RoleForm = component$<RoleFormProps>(({ 
  availablePermissions, 
  isLoading = false, 
  error, 
  submitLabel = 'Save Role',
  initialData 
}) => {
  const selectedPermissions = useSignal<string[]>(initialData?.selectedPermissions || []);

  // Group permissions by resource
  const getPermissionGroups = (): PermissionGroup[] => {
    const grouped: Record<string, Permission[]> = {};
    availablePermissions.forEach(permission => {
      if (!grouped[permission.resource]) {
        grouped[permission.resource] = [];
      }
      grouped[permission.resource].push(permission);
    });

    return Object.entries(grouped).map(([resource, permissions]) => ({
      resource,
      permissions: permissions.sort((a, b) => a.action.localeCompare(b.action))
    })).sort((a, b) => a.resource.localeCompare(b.resource));
  };

  const permissionGroups = getPermissionGroups();

  const toggleResourcePermissions = $((resource: string) => {
    const resourcePermissions = permissionGroups.find(g => g.resource === resource)?.permissions || [];
    const resourcePermissionIds = resourcePermissions.map(p => p.id);
    
    const hasAllSelected = resourcePermissionIds.every(id => selectedPermissions.value.includes(id));
    
    if (hasAllSelected) {
      // Remove all permissions for this resource
      selectedPermissions.value = selectedPermissions.value.filter(id => !resourcePermissionIds.includes(id));
    } else {
      // Add all permissions for this resource
      const newPermissions = [...selectedPermissions.value];
      resourcePermissionIds.forEach(id => {
        if (!newPermissions.includes(id)) {
          newPermissions.push(id);
        }
      });
      selectedPermissions.value = newPermissions;
    }
  });

  const isResourceFullySelected = (resource: string): boolean => {
    const resourcePermissions = permissionGroups.find(g => g.resource === resource)?.permissions || [];
    const resourcePermissionIds = resourcePermissions.map(p => p.id);
    return resourcePermissionIds.length > 0 && resourcePermissionIds.every(id => selectedPermissions.value.includes(id));
  };

  const isResourcePartiallySelected = (resource: string): boolean => {
    const resourcePermissions = permissionGroups.find(g => g.resource === resource)?.permissions || [];
    const resourcePermissionIds = resourcePermissions.map(p => p.id);
    return resourcePermissionIds.some(id => selectedPermissions.value.includes(id)) && 
           !resourcePermissionIds.every(id => selectedPermissions.value.includes(id));
  };

  return (
    <div class="space-y-6">
      {error && <Alert type="error" message={error} />}
      
      {/* Basic Information */}
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Basic Information</h3>
        
        <FormField label="Role Name" required>
          <input
            type="text"
            name="name"
            placeholder="Administrator"
            class="input input-bordered w-full"
            value={initialData?.name || ''}
            disabled={isLoading}
            required
          />
        </FormField>

        <FormField label="Description" required>
          <textarea
            name="description"
            placeholder="Full system access with all permissions"
            class="textarea textarea-bordered w-full h-24"
            disabled={isLoading}
            required
          >{initialData?.description || ''}</textarea>
        </FormField>
      </div>

      {/* Permission Assignment */}
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Permissions</h3>
          <div class="text-sm text-base-content/60">
            {selectedPermissions.value.length} of {availablePermissions.length} selected
          </div>
        </div>

        <div class="space-y-4">
          {permissionGroups.map((group) => {
            const isFullySelected = isResourceFullySelected(group.resource);
            const isPartiallySelected = isResourcePartiallySelected(group.resource);
            
            return (
              <div key={group.resource} class="border border-base-300 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <input
                      type="checkbox"
                      class={`checkbox ${isPartiallySelected && !isFullySelected ? 'checkbox-warning' : 'checkbox-primary'}`}
                      checked={isFullySelected}
                      onChange$={() => toggleResourcePermissions(group.resource)}
                      disabled={isLoading}
                    />
                    <div>
                      <h4 class="font-medium capitalize">{group.resource}</h4>
                      <p class="text-xs text-base-content/60">
                        {group.permissions.length} permissions available
                      </p>
                    </div>
                  </div>
                  <div class="text-xs text-base-content/60">
                    {group.permissions.filter(p => selectedPermissions.value.includes(p.id)).length} / {group.permissions.length}
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                  {group.permissions.map((permission) => (
                    <div key={permission.id} class="form-control">
                      <label class="label cursor-pointer justify-start gap-3 py-2">
                        <input
                          type="checkbox"
                          name="permissions"
                          value={permission.id}
                          class="checkbox checkbox-sm"
                          checked={selectedPermissions.value.includes(permission.id)}
                          onChange$={(e) => {
                            const isChecked = (e.target as HTMLInputElement).checked;
                            if (isChecked) {
                              selectedPermissions.value = [...selectedPermissions.value, permission.id];
                            } else {
                              selectedPermissions.value = selectedPermissions.value.filter(id => id !== permission.id);
                            }
                          }}
                          disabled={isLoading}
                        />
                        <div class="flex-1">
                          <span class="label-text text-sm font-medium">{permission.action}</span>
                          {permission.description && (
                            <p class="text-xs text-base-content/60">{permission.description}</p>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {selectedPermissions.value.length === 0 && (
          <div class="alert alert-warning">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <span>Role will have no permissions - users with this role will have limited access</span>
          </div>
        )}
      </div>

      {/* Role Settings */}
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Role Settings</h3>
        
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              name="isActive"
              class="checkbox"
              checked={initialData?.isActive !== false}
              disabled={isLoading}
            />
            <span class="label-text">Role is active</span>
          </label>
          <div class="label">
            <span class="label-text-alt text-base-content/60">
              Inactive roles cannot be assigned to users
            </span>
          </div>
        </div>
      </div>

      {/* Submit Actions */}
      <div class="flex justify-end gap-3 pt-6 border-t border-base-300">
        <a href="/dashboard/roles" class="btn btn-outline" tabIndex={isLoading ? -1 : 0}>
          Cancel
        </a>
        <button
          type="submit"
          class={`btn btn-primary ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : submitLabel}
        </button>
      </div>

      {/* Hidden fields for form data */}
      <input type="hidden" name="selectedPermissions" value={JSON.stringify(selectedPermissions.value)} />
    </div>
  );
});