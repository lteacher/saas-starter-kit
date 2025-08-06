import { component$, useSignal, $ } from '@builder.io/qwik';
import { Form, routeAction$ } from '@builder.io/qwik-city';
import { ProfileForm } from './profile-form';
import { useUpdateProfile } from './profile-actions';
import type { User } from '@saas-starter/types';

interface ProfileTabProps {
  user: User;
}

export const ProfileTab = component$<ProfileTabProps>(({ user }) => {
  const updateAction = useUpdateProfile();
  const isEditing = useSignal(false);

  const handleEdit = $(() => {
    isEditing.value = true;
  });

  const handleCancel = $(() => {
    isEditing.value = false;
  });

  return (
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <div class="flex items-center justify-between mb-6">
              <h2 class="card-title">Profile Information</h2>
              {!isEditing.value && (
                <button class="btn btn-primary btn-sm" onClick$={handleEdit}>
                  Edit Profile
                </button>
              )}
            </div>

            {updateAction.value?.error && (
              <div class="alert alert-error mb-4">
                <span>{updateAction.value.error}</span>
              </div>
            )}

            {updateAction.value?.success && (
              <div class="alert alert-success mb-4">
                <span>Profile updated successfully!</span>
              </div>
            )}

            <Form action={updateAction}>
              <ProfileForm
                user={user}
                isEditing={isEditing.value}
                isLoading={updateAction.isRunning}
                onCancel$={handleCancel}
              />
            </Form>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h3 class="card-title">Account Status</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-base-content/70">Email Status</span>
                <div class="badge badge-success">Verified</div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-base-content/70">Account Status</span>
                <div class="badge badge-success">Active</div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-base-content/70">Member Since</span>
                <span class="text-sm">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
