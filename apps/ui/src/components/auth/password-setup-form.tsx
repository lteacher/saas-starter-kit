import { component$, useSignal } from '@builder.io/qwik';
import { Form, type ActionStore } from '@builder.io/qwik-city';
import type { User } from '@saas-starter/types';

interface PasswordSetupFormProps {
  user: User;
  setupAction: ActionStore<unknown, FormData, boolean>;
  isInvitation: boolean;
}

export const PasswordSetupForm = component$<PasswordSetupFormProps>(
  ({ user, setupAction, isInvitation }) => {
    const password = useSignal('');
    const confirmPassword = useSignal('');

    return (
      <Form action={setupAction}>
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input type="email" class="input input-bordered" value={user.email} disabled />
        </div>

        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">New Password</span>
          </label>
          <input
            type="password"
            name="password"
            class="input input-bordered"
            bind:value={password}
            placeholder="Enter your new password"
            required
            minLength={6}
          />
        </div>

        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            class="input input-bordered"
            bind:value={confirmPassword}
            placeholder="Confirm your new password"
            required
          />
          {password.value && confirmPassword.value && password.value !== confirmPassword.value && (
            <label class="label">
              <span class="label-text-alt text-error">Passwords do not match</span>
            </label>
          )}
        </div>

        <button
          type="submit"
          class="btn btn-primary w-full"
          disabled={
            setupAction.isRunning || !password.value || password.value !== confirmPassword.value
          }
        >
          {setupAction.isRunning ? (
            <>
              <span class="loading loading-spinner loading-sm"></span>
              Setting Password...
            </>
          ) : isInvitation ? (
            'Complete Setup'
          ) : (
            'Update Password'
          )}
        </button>
      </Form>
    );
  },
);
