import { component$, useSignal, $ } from '@builder.io/qwik';
import type { LoginInput } from '@saas-starter/types';
import { FormField } from '../ui/form-field';
import { Alert } from '../ui/alert';

interface LoginFormProps {
  onSubmit: (credentials: LoginInput) => Promise<void>;
  isLoading?: boolean;
}

export const LoginForm = component$<LoginFormProps>(({ onSubmit, isLoading = false }) => {
  const email = useSignal('');
  const password = useSignal('');
  const error = useSignal('');

  const handleSubmit = $(async () => {
    if (!email.value || !password.value) {
      error.value = 'Please fill in all fields';
      return;
    }

    error.value = '';
    try {
      await onSubmit({ email: email.value, password: password.value });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed';
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

      <FormField label="Password">
        <input
          type="password"
          placeholder="Enter your password"
          class="input input-bordered w-full"
          value={password.value}
          onInput$={(e) => {
            password.value = (e.target as HTMLInputElement).value;
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
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </div>
  );
});