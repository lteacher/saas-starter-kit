import { component$ } from '@builder.io/qwik';

interface RolesHeaderProps {
  totalRoles: number;
}

export const RolesHeader = component$<RolesHeaderProps>(({ totalRoles }) => {
  return (
    <div class="bg-base-100 border border-base-300 rounded-lg p-6 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <div class="bg-primary/10 text-primary rounded-lg w-12 h-12 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-base-content">Roles & Permissions</h1>
              <p class="text-base-content/60 text-sm sm:text-base">
                Manage user access controls and permissions
              </p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="stats shadow-sm">
              <div class="stat py-2 px-4">
                <div class="stat-title text-xs">Total Roles</div>
                <div class="stat-value text-2xl">{totalRoles}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div class="form-control">
            <div class="input-group">
              <input 
                type="text" 
                placeholder="Search roles..." 
                class="input input-bordered w-full sm:w-64" 
              />
              <button class="btn btn-square btn-outline">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Create Role Button */}
          <a href="/dashboard/roles/new" class="btn btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span class="hidden sm:inline">Create Role</span>
            <span class="sm:hidden">Create</span>
          </a>
        </div>
      </div>
    </div>
  );
});