import { component$, useSignal } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { ProfileTab } from '~/components/settings/profile-tab';
import { SecurityTab } from '~/components/settings/security-tab';
import { useAuth } from '~/context/auth';

export default component$(() => {
  const activeTab = useSignal<'profile' | 'security'>('profile');
  const auth = useAuth();

  const currentUser = auth.state.value.user;

  if (!currentUser) {
    return (
      <div class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <p class="text-lg text-base-content/70">Unable to load user profile</p>
        </div>
      </div>
    );
  }

  return (
    <div class="space-y-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">Settings</h1>
        <p class="text-base-content/70">Manage your account preferences and security settings</p>
      </div>

      <div class="tabs tabs-bordered">
        <button
          class={`tab tab-lg ${activeTab.value === 'profile' ? 'tab-active' : ''}`}
          onClick$={() => (activeTab.value = 'profile')}
        >
          Profile
        </button>
        <button
          class={`tab tab-lg ${activeTab.value === 'security' ? 'tab-active' : ''}`}
          onClick$={() => (activeTab.value = 'security')}
        >
          Security
        </button>
      </div>

      <div class="min-h-[500px]">
        {activeTab.value === 'profile' && <ProfileTab user={currentUser} />}
        {activeTab.value === 'security' && <SecurityTab user={currentUser} />}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Settings - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Manage your account settings and preferences' }],
};
