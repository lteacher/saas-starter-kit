import { e } from '@saas-starter/db';

// Get all permissions
export const listPermissions = () =>
  e.select(e.Permission, permission => ({
    id: true,
    name: true,
    resource: true,
    action: true,
    description: true,
    createdAt: true,
    order_by: [permission.resource, permission.action],
  }));

// Find a permission by ID
export const findPermissionById = (id: string) =>
  e.select(e.Permission, permission => ({
    id: true,
    name: true,
    resource: true,
    action: true,
    description: true,
    createdAt: true,
    filter_single: { id },
  }));

// Find permissions by resource and action
export const findPermissionByResourceAction = (resource: string, action: string) =>
  e.select(e.Permission, permission => ({
    id: true,
    name: true,
    resource: true,
    action: true,
    description: true,
    filter_single: e.op(
      e.op(permission.resource, '=', resource),
      'and',
      e.op(permission.action, '=', action)
    ),
  }));

// Create a new permission
export const createPermission = (permissionData: {
  name: string;
  resource: string;
  action: string;
  description?: string;
}) =>
  e.insert(e.Permission, permissionData);

// Update permission information
export const updatePermission = (permissionId: string, updates: {
  name?: string;
  resource?: string;
  action?: string;
  description?: string;
}) =>
  e.update(e.Permission, permission => ({
    filter_single: { id: permissionId },
    set: updates,
  }));