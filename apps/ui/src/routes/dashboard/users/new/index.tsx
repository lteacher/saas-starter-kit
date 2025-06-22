import { component$ } from '@builder.io/qwik';
import { routeAction$, routeLoader$, Form } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import { UserForm } from '../../../../components/users/user-form';
import { client } from '../../../../lib/api-client';

export const useAvailableRoles = routeLoader$(async () => {
  try {
    const response = await client.api.roles.get();
    if (response.error) {
      console.error('Failed to fetch roles:', response.error);
      return [];
    }
    return response.data?.roles || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
});

export const useCreateUser = routeAction$(async (data, { fail, redirect }) => {
  try {
    // Validate required fields
    if (!data.email || !data.username || !data.firstName || !data.lastName) {
      return fail(400, { error: 'Missing required fields' });
    }

    // Prepare user data for API
    const userData = {
      email: data.email as string,
      username: data.username as string,
      firstName: data.firstName as string,
      lastName: data.lastName as string,
      isActive: data.isActive === 'on'
    };

    // Add password if not generating one
    if (data.generatePassword !== 'true' && data.password) {
      Object.assign(userData, { password: data.password as string });
    }

    // Create user via API
    const response = await client.api.auth.register.post(userData);
    
    if (response.error) {
      return fail(400, { error: response.error.message || 'Failed to create user' });
    }

    // If user created successfully and roles selected, assign roles
    const selectedRoles = JSON.parse(data.selectedRoles as string || '[]');
    if (selectedRoles.length > 0 && response.data?.id) {
      // Note: This would require a role assignment endpoint
      console.log('Would assign roles:', selectedRoles, 'to user:', response.data.id);
    }
    
    throw redirect(302, '/dashboard/users');
  } catch (error) {
    if (error instanceof Error) {
      return fail(500, { error: error.message });
    }
    throw error;
  }
});

export default component$(() => {
  const availableRoles = useAvailableRoles();
  const createUserAction = useCreateUser();
  
  return (
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center gap-4">
        <a href="/dashboard/users" class="btn btn-ghost btn-circle">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </a>
        <div>
          <h1 class="text-3xl font-bold">Create New User</h1>
          <p class="text-base-content/60">Add a new user to the system</p>
        </div>
      </div>

      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <Form action={createUserAction}>
            <UserForm 
              availableRoles={availableRoles.value}
              isLoading={createUserAction.isRunning}
              error={createUserAction.value?.error}
              submitLabel="Create User"
            />
          </Form>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Create User - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Create a new user account' }],
};