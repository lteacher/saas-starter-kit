import { component$ } from '@builder.io/qwik';

interface Role {
  id: string;
  name: string;
}

interface UserRolesProps {
  roles: Role[];
}

export const UserRoles = component$<UserRolesProps>(({ roles }) => {
  if (!roles || roles.length === 0) {
    return <span class="text-sm text-base-content/70">No roles</span>;
  }

  return (
    <div class="flex flex-wrap gap-1">
      {roles.map((role) => (
        <span key={role.id} class="badge badge-outline badge-sm">
          {role.name}
        </span>
      ))}
    </div>
  );
});
