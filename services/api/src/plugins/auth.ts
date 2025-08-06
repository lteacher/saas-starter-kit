import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { UnauthorizedError } from '../lib/errors';
import { findUserByIdWithRoles } from '@saas-starter/db';

// Helper function to get all permissions for a user
const getUserPermissions = (user: any) => {
  const permissions = new Set<string>();

  user.roles.forEach((role: any) => {
    role.permissions.forEach((permission: any) => {
      permissions.add(permission.name);
    });
  });

  return Array.from(permissions);
};

// JWT authentication plugin
export const authPlugin = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'default-secret-key',
    }),
  )
  .derive(async ({ headers, jwt, cookie }) => {
    // Try to get token from Authorization header first
    let token = headers.authorization?.replace('Bearer ', '');

    // If not in header, try cookie
    if (!token) {
      token = cookie.auth_token?.value;
    }

    if (!token) {
      throw new UnauthorizedError('Missing authentication token');
    }

    try {
      const payload = await jwt.verify(token);

      if (!payload || !payload.userId) {
        throw new UnauthorizedError('Invalid token');
      }

      // Fetch current user data with roles
      const user = await findUserByIdWithRoles(`${payload.userId}`);

      if (!user || !user.isActive) {
        throw new UnauthorizedError('User not found or inactive');
      }

      const userPermissions = getUserPermissions(user);

      return {
        currentUser: user,
        userId: payload.userId,
        permissions: userPermissions,
      };
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  });

// Permission-based authorization plugin
export const requirePermission = (permission: string) => {
  return new Elysia().use(authPlugin).derive(async ({ permissions }) => {
    if (!permissions?.includes(permission)) {
      throw new UnauthorizedError(`Permission required: ${permission}`);
    }

    return {};
  });
};

// Common permission checks
export const requireUsersRead = requirePermission('users:read');
export const requireUsersCreate = requirePermission('users:create');
export const requireUsersUpdate = requirePermission('users:update');
export const requireUsersDelete = requirePermission('users:delete');

export const requireRolesRead = requirePermission('roles:read');
export const requireRolesCreate = requirePermission('roles:create');
export const requireRolesUpdate = requirePermission('roles:update');
export const requireRolesDelete = requirePermission('roles:delete');
