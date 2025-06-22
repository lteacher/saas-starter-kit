import { component$ } from '@builder.io/qwik';

interface RolesHeaderProps {
  totalRoles: number;
}

export const RolesHeader = component$<RolesHeaderProps>(({ totalRoles }) => {
  return (
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-base-content">Roles & Permissions</h1>
        <p class="text-base-content/60 mt-1">
          Manage user access controls and permissions ({totalRoles} roles)
        </p>
      </div>
      
      <div class="flex items-center gap-3">
        {/* Search */}
        <div class="form-control">
          <input 
            type="text" 
            placeholder="Search roles..." 
            class="input input-bordered w-64" 
          />
        </div>
        
        {/* Create Role Button */}
        <a href="/dashboard/roles/new" class="btn btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create Role
        </a>
      </div>
    </div>
  );
});