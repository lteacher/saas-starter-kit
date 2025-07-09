import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { client } from '../../lib/api-client';
import { PasswordSetupForm } from '../../components/auth/password-setup-form';
import { useSetupPassword } from './actions';

export const usePasswordSetupData = routeLoader$(async ({ query, cookie, redirect }) => {
  const token = query.get('token');

  if (token) {
    // Invitation flow - validate token and get user info
    try {
      const response = await client.api.invitations({ id: token }).get();

      if (response.error) {
        throw redirect(302, '/login?error=invalid-invitation');
      }

      const invitation = response.data;

      if (invitation.status !== 'pending' || new Date(invitation.expiresAt) < new Date()) {
        throw redirect(302, '/login?error=invitation-expired');
      }

      // Get user info
      const userResponse = await client.api.users({ id: invitation.userId }).get();

      if (userResponse.error) {
        throw redirect(302, '/login?error=user-not-found');
      }

      return {
        type: 'invitation',
        user: userResponse.data,
        title: 'Complete Your Account Setup',
        subtitle: 'Set your password to get started',
      };
    } catch (error) {
      if (error instanceof Response && error.status === 302) {
        throw error;
      }
      throw redirect(302, '/login?error=setup-failed');
    }
  } else {
    // Temp password flow - check if user is logged in with temp password
    const authToken = cookie.get('auth_token')?.value;
    const storedUser = cookie.get('auth_user')?.value;

    if (!authToken || !storedUser) {
      throw redirect(302, '/login?error=authentication-required');
    }

    try {
      const user = JSON.parse(storedUser);

      if (!user.tempPassword) {
        throw redirect(302, '/dashboard');
      }

      return {
        type: 'temp-password',
        user,
        title: 'Set Your Password',
        subtitle: 'Please set a permanent password for your account',
      };
    } catch (error) {
      throw redirect(302, '/login?error=invalid-session');
    }
  }
});

export default component$(() => {
  const setupData = usePasswordSetupData();
  const setupAction = useSetupPassword();

  const data = setupData.value;

  return (
    <div class="min-h-screen flex items-center justify-center bg-base-200">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-primary mb-2">🔐 {data.title}</h1>
            <p class="text-base-content/70">{data.subtitle}</p>
          </div>

          {setupAction.value?.error && (
            <div class="alert alert-error mb-4">
              <span>{setupAction.value.error}</span>
            </div>
          )}

          <PasswordSetupForm
            user={data.user}
            setupAction={setupAction}
            isInvitation={data.type === 'invitation'}
          />
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Setup Password - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Set your account password' }],
};
