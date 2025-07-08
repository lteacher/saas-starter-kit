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
}

export const RolesGrid = component$<RolesGridProps>(({ roles }) => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {roles.map((role) => (
        <RoleCard 
          key={role.id} 
          role={role}
        />
      ))}
      
      {/* Add new role card */}
      <div class="card bg-base-100 shadow-lg border-2 border-dashed border-base-300 hover:border-primary hover:shadow-xl transition-all duration-200">
        <div class="card-body items-center text-center p-8">
          <div class="avatar placeholder mb-4">
            <div class="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
          </div>
          <h3 class="card-title text-lg mb-2">Create New Role</h3>
          <p class="text-base-content/60 text-sm mb-6 leading-relaxed">
            Define a new role with custom permissions and access controls
          </p>
          <div class="card-actions">
            <a href="/dashboard/roles/new" class="btn btn-primary btn-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create Role
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});