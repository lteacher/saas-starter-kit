import { component$, useSignal } from '@builder.io/qwik';
import { FormField } from '../ui/form-field';
import { Alert } from '../ui/alert';

interface Role {
  id: string;
  name: string;
  description: string;
}

interface UserFormProps {
  availableRoles: Role[];
  isLoading?: boolean;
  error?: string;
  submitLabel?: string;
  initialData?: {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    isActive?: boolean;
    selectedRoles?: string[];
  };
}

export const UserForm = component$<UserFormProps>(({ 
  availableRoles, 
  isLoading = false, 
  error, 
  submitLabel = 'Save User',
  initialData 
}) => {
  const selectedRoles = useSignal<string[]>(initialData?.selectedRoles || []);
  const generatePassword = useSignal(true);

  return (
    <div class="space-y-6">
      {error && <Alert type="error" message={error} />}
      
      {/* Basic Information */}
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Basic Information</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="First Name">
            <input
              type="text"
              name="firstName"
              placeholder="John"
              class="input input-bordered w-full"
              value={initialData?.firstName || ''}
              disabled={isLoading}
              required
            />
          </FormField>

          <FormField label="Last Name">
            <input
              type="text"
              name="lastName"
              placeholder="Doe"
              class="input input-bordered w-full"
              value={initialData?.lastName || ''}
              disabled={isLoading}
              required
            />
          </FormField>
        </div>

        <FormField label="Username">
          <input
            type="text"
            name="username"
            placeholder="john_doe"
            class="input input-bordered w-full"
            value={initialData?.username || ''}
            disabled={isLoading}
            required
          />
        </FormField>

        <FormField label="Email">
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            class="input input-bordered w-full"
            value={initialData?.email || ''}
            disabled={isLoading}
            required
          />
        </FormField>
      </div>

      {/* Password Section */}
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Password</h3>
        
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              class="checkbox"
              checked={generatePassword.value}
              onChange$={(e) => {
                generatePassword.value = (e.target as HTMLInputElement).checked;
              }}
              disabled={isLoading}
            />
            <span class="label-text">Generate random password and send via email</span>
          </label>
        </div>

        {!generatePassword.value && (
          <div class="space-y-4">
            <FormField label="Password">
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                class="input input-bordered w-full"
                disabled={isLoading}
                required={!generatePassword.value}
              />
            </FormField>

            <FormField label="Confirm Password">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                class="input input-bordered w-full"
                disabled={isLoading}
                required={!generatePassword.value}
              />
            </FormField>
          </div>
        )}
      </div>

      {/* Role Assignment */}
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Role Assignment</h3>
        
        <div class="grid grid-cols-1 gap-3">
          {availableRoles.map((role) => (
            <div key={role.id} class="form-control">
              <label class="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  name="roles"
                  value={role.id}
                  class="checkbox"
                  checked={selectedRoles.value.includes(role.id)}
                  onChange$={(e) => {
                    const isChecked = (e.target as HTMLInputElement).checked;
                    if (isChecked) {
                      selectedRoles.value = [...selectedRoles.value, role.id];
                    } else {
                      selectedRoles.value = selectedRoles.value.filter(id => id !== role.id);
                    }
                  }}
                  disabled={isLoading}
                />
                <div class="flex-1">
                  <span class="label-text font-medium">{role.name}</span>
                  <p class="text-xs text-base-content/60">{role.description}</p>
                </div>
              </label>
            </div>
          ))}
        </div>

        {selectedRoles.value.length === 0 && (
          <div class="alert alert-warning">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <span>User will have no permissions without assigned roles</span>
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Account Settings</h3>
        
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              name="isActive"
              class="checkbox"
              checked={initialData?.isActive !== false}
              disabled={isLoading}
            />
            <span class="label-text">Account is active</span>
          </label>
        </div>

        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              name="sendWelcomeEmail"
              class="checkbox"
              checked={true}
              disabled={isLoading}
            />
            <span class="label-text">Send welcome email</span>
          </label>
        </div>
      </div>

      {/* Submit Actions */}
      <div class="flex justify-end gap-3 pt-6 border-t border-base-300">
        <a href="/dashboard/users" class="btn btn-outline" tabIndex={isLoading ? -1 : 0}>
          Cancel
        </a>
        <button
          type="submit"
          class={`btn btn-primary ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : submitLabel}
        </button>
      </div>

      {/* Hidden fields for form data */}
      <input type="hidden" name="generatePassword" value={generatePassword.value.toString()} />
      <input type="hidden" name="selectedRoles" value={JSON.stringify(selectedRoles.value)} />
    </div>
  );
});