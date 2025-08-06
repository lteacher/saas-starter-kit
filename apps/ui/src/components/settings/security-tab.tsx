import { component$ } from '@builder.io/qwik';
import type { User } from '@saas-starter/types';

interface SecurityTabProps {
  user: User;
}

export const SecurityTab = component$<SecurityTabProps>(({ user }) => {
  return (
    <div class="space-y-6">
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title">Password</h2>
          <p class="text-base-content/70 mb-4">Update your password to keep your account secure</p>

          <div class="space-y-4">
            <div>
              <label class="label">
                <span class="label-text font-medium">Current Password</span>
              </label>
              <input
                type="password"
                class="input input-bordered w-full"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label class="label">
                <span class="label-text font-medium">New Password</span>
              </label>
              <input
                type="password"
                class="input input-bordered w-full"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label class="label">
                <span class="label-text font-medium">Confirm New Password</span>
              </label>
              <input
                type="password"
                class="input input-bordered w-full"
                placeholder="Confirm new password"
              />
            </div>

            <button class="btn btn-primary">Update Password</button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title">Account Security</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">Two-Factor Authentication</p>
                <p class="text-sm text-base-content/70">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button class="btn btn-outline btn-sm">Enable 2FA</button>
            </div>

            <div class="divider"></div>

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">Active Sessions</p>
                <p class="text-sm text-base-content/70">Manage your active login sessions</p>
              </div>
              <button class="btn btn-outline btn-sm">View Sessions</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
