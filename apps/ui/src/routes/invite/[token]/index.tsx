import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { client } from '../../../lib/api-client';

export const useValidateInvitation = routeLoader$(async ({ params, redirect }) => {
  try {
    const response = await client.api.invitations({ id: params.token }).get();

    if (response.error) {
      return { valid: false, error: response.error.value };
    }

    const invitation = response.data;

    // Check if invitation is valid and not expired
    if (invitation.status !== 'pending') {
      return { valid: false, error: 'Invitation has already been used or cancelled' };
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      return { valid: false, error: 'Invitation has expired' };
    }

    // Valid invitation - redirect to password setup with token
    throw redirect(302, `/setup-password?token=${params.token}`);
  } catch (error) {
    if (error instanceof Response && error.status === 302) {
      throw error;
    }
    return { valid: false, error: 'Failed to validate invitation' };
  }
});

export default component$(() => {
  const validation = useValidateInvitation();

  return (
    <div class="min-h-screen flex items-center justify-center bg-base-200">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body text-center">
          <h1 class="text-2xl font-bold text-error mb-4">Invalid Invitation</h1>
          <p class="text-base-content/70 mb-6">
            {validation.value.error || 'This invitation link is invalid or has expired.'}
          </p>
          <a href="/login" class="btn btn-primary">
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Invitation - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Validating your invitation' }],
};
