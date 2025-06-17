import { Elysia } from 'elysia';
import { db } from '@saas-starter/db';
import { createPermissionSchema, updatePermissionSchema } from '@saas-starter/schemas/permissions';
import { listPermissions, findPermissionById, findPermissionByResourceAction, createPermission, updatePermission } from '../lib/permission';
import { NotFoundError, ConflictError } from '../lib/errors';

export const permissionHandler = new Elysia({ prefix: '/permissions' })
  .get(
    '/',
    async () => {
      const permissions = await listPermissions().run(db);
      return { permissions };
    },
    {
      detail: { tags: ['Permissions'] },
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      const permission = await findPermissionById(params.id).run(db);

      if (!permission) throw new NotFoundError('Permission');

      return { permission };
    },
    {
      detail: { tags: ['Permissions'] },
    }
  )
  .post(
    '/',
    async ({ body }) => {
      // Only check uniqueness on creation
      const existingPermission = await findPermissionByResourceAction(body.resource, body.action).run(db);

      if (existingPermission) throw new ConflictError('Permission already exists', 'Resource and action combination must be unique');

      const newPermission = await createPermission(body).run(db);
      return { permission: newPermission };
    },
    {
      body: createPermissionSchema,
      detail: { tags: ['Permissions'] },
    }
  )
  .patch(
    '/:id',
    async ({ params, body }) => {
      const existingPermission = await findPermissionById(params.id).run(db);

      if (!existingPermission) throw new NotFoundError('Permission');

      const updatedPermission = await updatePermission(params.id, body).run(db);
      return { permission: updatedPermission };
    },
    {
      body: updatePermissionSchema,
      detail: { tags: ['Permissions'] },
    }
  );