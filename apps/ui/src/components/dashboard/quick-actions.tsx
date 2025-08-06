import { component$ } from '@builder.io/qwik';
import { LuPlus, LuSettings, LuBarChart, LuHelpCircle } from '@qwikest/icons/lucide';

export const QuickActions = component$(() => {
  return (
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <a href="/dashboard/users/new" class="btn btn-outline">
            <LuPlus class="w-4 h-4 mr-2" />
            Add User
          </a>

          <a href="/dashboard/roles/new" class="btn btn-outline">
            <LuSettings class="w-4 h-4 mr-2" />
            Create Role
          </a>

          <a href="/dashboard/settings" class="btn btn-outline">
            <LuBarChart class="w-4 h-4 mr-2" />
            Analytics
          </a>

          <a href="/dashboard/audit" class="btn btn-outline">
            <LuHelpCircle class="w-4 h-4 mr-2" />
            Help
          </a>
        </div>
      </div>
    </div>
  );
});
