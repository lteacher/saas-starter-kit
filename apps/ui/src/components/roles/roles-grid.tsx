import { component$ } from '@builder.io/qwik';
import { RoleCard } from './role-card';

interface Permission {
  id?: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  userCount: number;
  permissions: Permission[];
}

interface RolesGridProps {
  roles: Role[];
  permissions: Permission[];
}

export const RolesGrid = component$<RolesGridProps>(({ roles, permissions }) => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role) => (
        <RoleCard 
          key={role.id} 
          role={role}
          allPermissions={permissions}
        />
      ))}
      
      {/* Add new role card */}
      <div class="card bg-base-200 shadow-xl border-2 border-dashed border-base-300 hover:border-primary transition-colors">
        <div class="card-body items-center text-center">
          <div class="avatar placeholder mb-4">
            <div class="bg-base-300 text-base-content rounded-full w-16">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
          </div>
          <h3 class="card-title text-lg">Create New Role</h3>
          <p class="text-base-content/60 text-sm">
            Define a new role with custom permissions
          </p>
          <div class="card-actions mt-4">
            <a href="/dashboard/roles/new" class="btn btn-primary btn-sm">
              Create Role
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});