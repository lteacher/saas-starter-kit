import { component$, useSignal, $ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useNavigate } from '@builder.io/qwik-city';
import { useAuth } from '../../context/auth';
import { RegisterForm } from '../../components/auth/register-form';

export default component$(() => {
  const auth = useAuth();
  const nav = useNavigate();
  const isLoading = useSignal(false);

  const handleRegister = $(async (userData: any) => {
    isLoading.value = true;
    try {
      await auth.register(userData);
      // Redirect to dashboard on successful registration
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
            Create Account
          </h2>
          
          <RegisterForm 
            onSubmit={handleRegister} 
            isLoading={isLoading.value} 
          />

          <div class="divider">OR</div>

          <div class="text-center">
            <p class="text-sm">
              Already have an account?{' '}
              <a href="/login" class="link link-primary">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Register - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Create your account' }],
};