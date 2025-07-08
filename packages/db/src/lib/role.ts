import { ObjectId } from 'mongodb';
import type { Role, Permission } from '../types';
import { db } from '../connection';

// Gets all roles
export const listRoles = async (includeInactive = false): Promise<Role[]> => {
  const filter = includeInactive ? {} : { isActive: true };
  
  return db.collection<Role>('roles')
    .find(filter)
    .sort({ name: 1 })
    .toArray();
};

// Finds a role by ID
export const findRoleById = async (id: string): Promise<Role | null> => {
  return db.collection<Role>('roles').findOne({ _id: new ObjectId(id) });
};

// Finds a role by name
export const findRoleByName = async (name: string): Promise<Role | null> => {
  return db.collection<Role>('roles').findOne({ name });
};

// Creates a new role
export const createRole = async (roleData: {
  name: string;
  description?: string;
  permissions?: Permission[];
}): Promise<Role> => {
  const now = new Date();
  const newRole: Omit<Role, '_id'> = {
    name: roleData.name.toLowerCase().replace(/[^a-z_]/g, '_'),
    description: roleData.description,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    permissions: roleData.permissions || []
  };

  const result = await db.collection<Role>('roles').insertOne(newRole as Role);
  return { ...newRole, _id: result.insertedId };
};

// Updates role information
export const updateRole = async (roleId: string, updates: {
  name?: string;
  description?: string;
  isActive?: boolean;
}): Promise<Role | null> => {
  const result = await db.collection<Role>('roles').findOneAndUpdate(
    { _id: new ObjectId(roleId) },
    { 
      $set: { 
        ...updates,
        updatedAt: new Date()
      } 
    },
    { returnDocument: 'after' }
  );

  return result;
};

// Adds a permission to a role
export const addPermissionToRole = async (roleId: string, permission: Permission): Promise<void> => {
  await db.collection<Role>('roles').updateOne(
    { _id: new ObjectId(roleId) },
    { 
      $addToSet: { permissions: permission },
      $set: { updatedAt: new Date() }
    }
  );
};

// Removes a permission from a role
export const removePermissionFromRole = async (roleId: string, permissionName: string): Promise<void> => {
  await db.collection<Role>('roles').updateOne(
    { _id: new ObjectId(roleId) },
    { 
      $pull: { permissions: { name: permissionName } },
      $set: { updatedAt: new Date() }
    }
  );
};

// Updates all permissions for a role
export const updateRolePermissions = async (roleId: string, permissions: Permission[]): Promise<void> => {
  await db.collection<Role>('roles').updateOne(
    { _id: new ObjectId(roleId) },
    { 
      $set: { 
        permissions,
        updatedAt: new Date()
      }
    }
  );
};

// Gets all unique permissions across all roles
export const getAllPermissions = async (): Promise<Permission[]> => {
  const roles = await db.collection<Role>('roles').find({ isActive: true }).toArray();
  
  const permissionMap = new Map<string, Permission>();
  
  roles.forEach(role => {
    role.permissions.forEach(permission => {
      permissionMap.set(permission.name, permission);
    });
  });
  
  return Array.from(permissionMap.values()).sort((a, b) => {
    if (a.resource !== b.resource) {
      return a.resource.localeCompare(b.resource);
    }
    return a.action.localeCompare(b.action);
  });
};