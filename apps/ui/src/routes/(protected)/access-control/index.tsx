import { component$, useSignal } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { UsersTab } from '~/components/access-control/users-tab';
import { RolesTab } from '~/components/access-control/roles-tab';
import { InvitationsTab } from '~/components/access-control/invitations-tab';
import { RolesProvider } from '~/context/roles';
import { client } from '~/lib/api-client';

export const useAccessControlData = routeLoader$(async ({ cookie, fail }) => {
  try {
    const authToken = cookie.get('auth_token')?.value;

    if (!authToken) {
      return fail(401, { error: 'Authentication required' });
    }

    const [usersResponse, rolesResponse, invitationsResponse] = await Promise.all([
      client.api.users.get({
        headers: { Authorization: `Bearer ${authToken}` },
      }),
      client.api.roles.get({
        headers: { Authorization: `Bearer ${authToken}` },
      }),
      client.api.invitations.get({
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    ]);

    // Check for auth/permission errors
    if (usersResponse.error || rolesResponse.error || invitationsResponse.error) {
      return fail(403, { error: 'Permission denied or authentication failed' });
    }

    return {
      users: usersResponse.data?.items || [],
      usersTotal: usersResponse.data?.pagination?.totalItems || 0,
      roles: rolesResponse.data || [],
      invitations: invitationsResponse.data || [],
    };
  } catch (error) {
    console.error('Failed to fetch access control data:', error);
    return fail(500, { error: 'Internal server error' });
  }
});

export default component$(() => {
  const activeTab = useSignal<'users' | 'roles' | 'invitations'>('users');
  const accessControlData = useAccessControlData();

  return (
    <RolesProvider initialRoles={accessControlData.value.roles}>
      <div class="space-y-6">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-primary mb-2">Access Control</h1>
          <p class="text-base-content/70">Manage users, roles, and invitations</p>
        </div>

        <div class="tabs tabs-bordered">
          <button
            class={`tab tab-lg ${activeTab.value === 'users' ? 'tab-active' : ''}`}
            onClick$={() => (activeTab.value = 'users')}
          >
            Users ({accessControlData.value.usersTotal})
          </button>
          <button
            class={`tab tab-lg ${activeTab.value === 'roles' ? 'tab-active' : ''}`}
            onClick$={() => (activeTab.value = 'roles')}
          >
            Roles ({accessControlData.value.roles.length})
          </button>
          <button
            class={`tab tab-lg ${activeTab.value === 'invitations' ? 'tab-active' : ''}`}
            onClick$={() => (activeTab.value = 'invitations')}
          >
            Invitations ({accessControlData.value.invitations.length})
          </button>
        </div>

        <div class="min-h-[500px]">
          {activeTab.value === 'users' && (
            <UsersTab
              users={accessControlData.value.users}
              total={accessControlData.value.usersTotal}
            />
          )}
          {activeTab.value === 'roles' && <RolesTab roles={accessControlData.value.roles} />}
          {activeTab.value === 'invitations' && (
            <InvitationsTab invitations={accessControlData.value.invitations} />
          )}
        </div>
      </div>
    </RolesProvider>
  );
});

export const head: DocumentHead = {
  title: 'Access Control - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Manage users, roles, and invitations' }],
};
