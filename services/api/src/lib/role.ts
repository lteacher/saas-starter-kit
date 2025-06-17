import { e } from '@saas-starter/db';

// Get all roles with their permissions
export const listRoles = () =>
  e.select(e.Role, role => ({
    id: true,
    name: true,
    description: true,
    createdAt: true,
    permissions: {
      id: true,
      name: true,
      resource: true,
      action: true,
    },
    order_by: role.name,
  }));

// Find a role by ID with permissions
export const findRoleById = (id: string) =>
  e.select(e.Role, role => ({
    id: true,
    name: true,
    description: true,
    createdAt: true,
    permissions: {
      id: true,
      name: true,
      resource: true,
      action: true,
    },
    filter_single: { id },
  }));

// Find a role by name
export const findRoleByName = (name: string) =>
  e.select(e.Role, role => ({
    id: true,
    name: true,
    description: true,
    filter_single: { name },
  }));

// Create a new role
export const createRole = (roleData: {
  name: string;
  description?: string;
}) =>
  e.insert(e.Role, roleData);

// Update role information
export const updateRole = (roleId: string, updates: {
  name?: string;
  description?: string;
}) =>
  e.update(e.Role, role => ({
    filter_single: { id: roleId },
    set: updates,
  }));

// Assign permissions to a role
export const assignPermissionsToRole = (roleId: string, permissionIds: string[]) =>
  e.update(e.Role, role => ({
    filter_single: { id: roleId },
    set: {
      permissions: { '+=': e.select(e.Permission, perm => ({ filter: e.op(perm.id, 'in', e.set(...permissionIds)) })) },
    },
  }));

// Remove permissions from a role
export const removePermissionsFromRole = (roleId: string, permissionIds: string[]) =>
  e.update(e.Role, role => ({
    filter_single: { id: roleId },
    set: {
      permissions: { '-=': e.select(e.Permission, perm => ({ filter: e.op(perm.id, 'in', e.set(...permissionIds)) })) },
    },
  }));