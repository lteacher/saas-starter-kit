// Default permissions available in the system for role creation
export const DEFAULT_PERMISSIONS = [
  { name: 'users:create', resource: 'users', action: 'create', description: 'Create new users' },
  { name: 'users:read', resource: 'users', action: 'read', description: 'View users' },
  {
    name: 'users:update',
    resource: 'users',
    action: 'update',
    description: 'Update user information',
  },
  { name: 'users:delete', resource: 'users', action: 'delete', description: 'Delete users' },
  { name: 'roles:create', resource: 'roles', action: 'create', description: 'Create new roles' },
  { name: 'roles:read', resource: 'roles', action: 'read', description: 'View roles' },
  { name: 'roles:update', resource: 'roles', action: 'update', description: 'Update roles' },
  { name: 'roles:delete', resource: 'roles', action: 'delete', description: 'Delete roles' },
  {
    name: 'permissions:read',
    resource: 'permissions',
    action: 'read',
    description: 'View permissions',
  },
  { name: 'audit:read', resource: 'audit', action: 'read', description: 'View audit logs' },
] as const;

// Type for permission objects
export type Permission = (typeof DEFAULT_PERMISSIONS)[number];
