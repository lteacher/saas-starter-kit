import { component$, useSignal, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useNavigate } from '@builder.io/qwik-city';
import { useAuth } from '../../context/auth';
import { LoginForm } from '../../components/auth/login-form';

export default component$(() => {
  const auth = useAuth();
  const nav = useNavigate();
  const isLoading = useSignal(false);

  const handleLogin = $(async (credentials: any) => {
    isLoading.value = true;
    try {
      await auth.login(credentials);
      // Redirect to dashboard on successful login
      nav('/dashboard');
    } catch (error) {
      // Error handling is done in the form component
      throw error;
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div class="card w-full max-w-md bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl font-bold text-center mb-6">
            Welcome Back
          </h2>
          
          <LoginForm 
            onSubmit={handleLogin} 
            isLoading={isLoading.value} 
          />

          <div class="divider">OR</div>

          <div class="text-center">
            <p class="text-sm">
              Don't have an account?{' '}
              <a href="/register" class="link link-primary">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Login - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Sign in to your account' }],
};