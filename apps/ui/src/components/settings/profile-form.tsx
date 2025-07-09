import { component$, useSignal, $ } from '@builder.io/qwik';
import type { User } from '@saas-starter/types';

interface ProfileFormProps {
  user: User;
  isEditing: boolean;
  isLoading: boolean;
  onCancel$: () => void;
}

export const ProfileForm = component$<ProfileFormProps>(
  ({ user, isEditing, isLoading, onCancel$ }) => {
    const firstName = useSignal(user.firstName || '');
    const lastName = useSignal(user.lastName || '');
    const username = useSignal(user.username || '');
    const email = useSignal(user.email || '');

    const handleCancel = $(() => {
      firstName.value = user.firstName || '';
      lastName.value = user.lastName || '';
      username.value = user.username || '';
      email.value = user.email || '';
      onCancel$();
    });

    if (!isEditing) {
      return (
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">
                <span class="label-text font-medium">First Name</span>
              </label>
              <div class="p-3 bg-base-200 rounded-lg">
                <span class="text-base-content">{user.firstName || 'Not set'}</span>
              </div>
            </div>
            <div>
              <label class="label">
                <span class="label-text font-medium">Last Name</span>
              </label>
              <div class="p-3 bg-base-200 rounded-lg">
                <span class="text-base-content">{user.lastName || 'Not set'}</span>
              </div>
            </div>
          </div>

          <div>
            <label class="label">
              <span class="label-text font-medium">Username</span>
            </label>
            <div class="p-3 bg-base-200 rounded-lg">
              <span class="text-base-content">{user.username}</span>
            </div>
          </div>

          <div>
            <label class="label">
              <span class="label-text font-medium">Email</span>
            </label>
            <div class="p-3 bg-base-200 rounded-lg">
              <span class="text-base-content">{user.email}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="label">
              <span class="label-text font-medium">First Name</span>
            </label>
            <input
              type="text"
              name="firstName"
              class="input input-bordered w-full"
              bind:value={firstName}
              placeholder="Enter your first name"
              disabled={isLoading}
            />
          </div>
          <div>
            <label class="label">
              <span class="label-text font-medium">Last Name</span>
            </label>
            <input
              type="text"
              name="lastName"
              class="input input-bordered w-full"
              bind:value={lastName}
              placeholder="Enter your last name"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label class="label">
            <span class="label-text font-medium">Username</span>
          </label>
          <input
            type="text"
            name="username"
            class="input input-bordered w-full"
            bind:value={username}
            placeholder="Enter your username"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label class="label">
            <span class="label-text font-medium">Email</span>
          </label>
          <input
            type="email"
            name="email"
            class="input input-bordered w-full"
            bind:value={email}
            placeholder="Enter your email"
            disabled={isLoading}
            required
          />
        </div>

        <input type="hidden" name="userId" value={user.id} />

        <div class="flex gap-3 pt-4">
          <button type="submit" class="btn btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span class="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
          <button type="button" class="btn btn-ghost" onClick$={handleCancel} disabled={isLoading}>
            Cancel
          </button>
        </div>
      </div>
    );
  },
);
