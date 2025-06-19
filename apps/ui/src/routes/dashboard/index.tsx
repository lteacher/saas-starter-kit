import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useAuth } from '../../context/auth';

export default component$(() => {
  const auth = useAuth();
  const user = auth.state.value.user;

  if (!auth.state.value.isAuthenticated) {
    // Redirect to login if not authenticated
    return (
      <div class="min-h-screen bg-base-100 flex items-center justify-center">
        <div class="text-center">
          <h2 class="text-2xl font-bold mb-4">Access Denied</h2>
          <p class="mb-4">Please log in to access the dashboard.</p>
          <a href="/login" class="btn btn-primary">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-base-100">
      {/* Header */}
      <div class="navbar bg-base-200 shadow-sm">
        <div class="flex-1">
          <a href="/dashboard" class="btn btn-ghost text-xl">
            SaaS Starter Kit
          </a>
        </div>
        <div class="flex-none">
          <div class="dropdown dropdown-end">
            <div tabIndex={0} role="button" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <ul tabIndex={0} class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a class="justify-between">
                  Profile
                  <span class="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><button onClick$={auth.logout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div class="container mx-auto p-6">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-primary mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p class="text-base-content/70">
            Here's your dashboard overview
          </p>
        </div>

        {/* Stats Cards */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="stat bg-base-200 rounded-box">
            <div class="stat-title">Total Users</div>
            <div class="stat-value text-primary">1</div>
            <div class="stat-desc">You!</div>
          </div>
          
          <div class="stat bg-base-200 rounded-box">
            <div class="stat-title">Active Sessions</div>
            <div class="stat-value text-secondary">1</div>
            <div class="stat-desc">Current session</div>
          </div>
          
          <div class="stat bg-base-200 rounded-box">
            <div class="stat-title">Account Status</div>
            <div class="stat-value text-accent">Active</div>
            <div class="stat-desc">All systems go</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div class="card bg-base-200 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Quick Actions</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <button class="btn btn-outline">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add User
              </button>
              <button class="btn btn-outline">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Settings
              </button>
              <button class="btn btn-outline">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Analytics
              </button>
              <button class="btn btn-outline">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Dashboard - SaaS Starter Kit',
  meta: [{ name: 'description', content: 'Your dashboard overview' }],
};