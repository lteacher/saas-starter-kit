import { component$, useSignal, $ } from '@builder.io/qwik';
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city';
import { useNavigate, routeAction$, z } from '@builder.io/qwik-city';
import { useAuth } from '../../context/auth';
import { LoginForm } from '../../components/auth/login-form';
import type { LoginInput } from '@saas-starter/types';
import { client } from '../../lib/api-client';

// Login action on the login page
export const useLoginAction = routeAction$(
  async (data, { cookie, fail }) => {
    try {
      const response = await client.api.auth.login.post(data);

      if (response.data && 'user' in response.data && 'token' in response.data) {
        const user = response.data.user;
        const token = response.data.token as string;

        // Set HTTP-only cookies for persistent auth
        cookie.set('auth_user', JSON.stringify(user), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 86400 * 7, // 7 days
        });

        cookie.set('auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 86400 * 7, // 7 days
        });

        return { success: true, user };
      } else {
        return fail(400, { message: 'Invalid response format' });
      }
    } catch (error) {
      return fail(400, { message: 'Login failed. Please check your credentials.' });
    }
  },
  z.object({
    identifier: z.string(),
    password: z.string(),
  }),
);

// Redirect authenticated users to dashboard
export const onRequest: RequestHandler = async ({ cookie, redirect }) => {
  const authToken = cookie.get('auth_token')?.value;
  const storedUser = cookie.get('auth_user')?.value;

  if (authToken && storedUser) {
    throw redirect(302, '/dashboard');
  }
};

export default component$(() => {
  const auth = useAuth();
  const nav = useNavigate();
  const loginAction = useLoginAction();
  const isLoading = useSignal(false);

  const handleLogin = $(async (credentials: LoginInput) => {
    isLoading.value = true;
    try {
      const result = await loginAction.submit(credentials);

      if (result.value?.success && result.value.user) {
        auth.updateUser(result.value.user);
        nav('/dashboard');
      } else {
        throw new Error(result.value?.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div class="card w-full max-w-md bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl font-bold text-center mb-6">Welcome Back</h2>

          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading.value || auth.state.value.isLoading}
          />

          <div class="text-center mt-4">
            <p class="text-sm text-base-content/70">
              Need an account? Contact your administrator for an invitation.
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
