import { component$, useSignal, $ } from '@builder.io/qwik';
import type { RegisterInput } from '@saas-starter/types';
import { FormField } from '../ui/form-field';
import { Alert } from '../ui/alert';

interface RegisterFormProps {
  onSubmit: (userData: RegisterInput) => Promise<void>;
  isLoading?: boolean;
}

export const RegisterForm = component$<RegisterFormProps>(({ onSubmit, isLoading = false }) => {
  const email = useSignal('');
  const username = useSignal('');
  const password = useSignal('');
  const confirmPassword = useSignal('');
  const error = useSignal('');

  const handleSubmit = $(async () => {
    // Basic validation
    if (!email.value || !username.value || !password.value || !confirmPassword.value) {
      error.value = 'Please fill in all fields';
      return;
    }

    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match';
      return;
    }

    if (password.value.length < 8) {
      error.value = 'Password must be at least 8 characters long';
      return;
    }

    error.value = '';
    try {
      await onSubmit({ 
        email: email.value, 
        username: username.value, 
        password: password.value 
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed';
    }
  });

  return (
    <div class="space-y-4">
      {error.value && <Alert type="error" message={error.value} />}
      
      <FormField label="Email">
        <input
          type="email"
          placeholder="Enter your email"
          class="input input-bordered w-full"
          value={email.value}
          onInput$={(e) => {
            email.value = (e.target as HTMLInputElement).value;
          }}
          disabled={isLoading}
        />
      </FormField>

      <FormField label="Username">
        <input
          type="text"
          placeholder="Choose a username"
          class="input input-bordered w-full"
          value={username.value}
          onInput$={(e) => {
            username.value = (e.target as HTMLInputElement).value;
          }}
          disabled={isLoading}
        />
      </FormField>

      <FormField label="Password">
        <input
          type="password"
          placeholder="Create a password"
          class="input input-bordered w-full"
          value={password.value}
          onInput$={(e) => {
            password.value = (e.target as HTMLInputElement).value;
          }}
          disabled={isLoading}
        />
      </FormField>

      <FormField label="Confirm Password">
        <input
          type="password"
          placeholder="Confirm your password"
          class="input input-bordered w-full"
          value={confirmPassword.value}
          onInput$={(e) => {
            confirmPassword.value = (e.target as HTMLInputElement).value;
          }}
          disabled={isLoading}
          onKeyDown$={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
      </FormField>

      <button
        class={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
        onClick$={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </div>
  );
});