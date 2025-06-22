import { component$ } from '@builder.io/qwik';

interface UsersHeaderProps {
  totalUsers: number;
}

export const UsersHeader = component$<UsersHeaderProps>(({ totalUsers }) => {
  return (
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-base-content">Users</h1>
        <p class="text-base-content/60 mt-1">
          Manage user accounts and permissions ({totalUsers} total)
        </p>
      </div>
      
      <div class="flex items-center gap-3">
        {/* Search */}
        <div class="form-control">
          <input 
            type="text" 
            placeholder="Search users..." 
            class="input input-bordered w-64" 
          />
        </div>
        
        {/* Filter */}
        <div class="dropdown dropdown-end">
          <div tabIndex={0} role="button" class="btn btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"></path>
            </svg>
            Filter
          </div>
          <ul tabIndex={0} class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>All Users</a></li>
            <li><a>Active Only</a></li>
            <li><a>Inactive Only</a></li>
            <li><a>Verified Only</a></li>
            <li><a>Unverified Only</a></li>
          </ul>
        </div>
        
        {/* Add User Button */}
        <a href="/dashboard/users/new" class="btn btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add User
        </a>
      </div>
    </div>
  );
});