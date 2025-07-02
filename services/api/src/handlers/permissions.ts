import { Elysia } from 'elysia';
import { db, api } from '@saas-starter/db';
import { createPermissionSchema, updatePermissionSchema } from '@saas-starter/schemas';
import { NotFoundError, ConflictError } from '../lib/errors';

export const permissionHandler = new Elysia({ prefix: '/permissions' })
  .get(
    '/',
    async () => {
      const permissions = await db.query(api.permissions.listPermissions);
      const formattedPermissions = permissions.map(p => ({ ...p, id: p._id }));
      return { permissions: formattedPermissions };
    },
    {
      detail: { tags: ['Permissions'] },
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      const permission = await db.query(api.permissions.findPermissionById, { id: params.id as any });

      if (!permission) throw new NotFoundError('Permission');

      return { permission: { ...permission, id: permission._id } };
    },
    {
      detail: { tags: ['Permissions'] },
    }
  )
  .post(
    '/',
    async ({ body }) => {
      const existingPermission = await db.query(api.permissions.findPermissionByResourceAction, body);

      if (existingPermission) throw new ConflictError('Permission already exists', 'Resource and action combination must be unique');

      const newPermissionId = await db.mutation(api.permissions.createPermission, body);
      const newPermission = await db.query(api.permissions.findPermissionById, { id: newPermissionId });

      return { permission: { ...newPermission, id: newPermission!._id } };
    },
    {
      body: createPermissionSchema,
      detail: { tags: ['Permissions'] },
    }
  )
  .patch(
    '/:id',
    async ({ params, body }) => {
      const existingPermission = await db.query(api.permissions.findPermissionById, { id: params.id as any });

      if (!existingPermission) throw new NotFoundError('Permission');

      await db.mutation(api.permissions.updatePermission, { permissionId: params.id as any, updates: body });
      const updatedPermission = await db.query(api.permissions.findPermissionById, { id: params.id as any });

      return { permission: { ...updatedPermission, id: updatedPermission!._id } };
    },
    {
      body: updatePermissionSchema,
      detail: { tags: ['Permissions'] },
    }
  );