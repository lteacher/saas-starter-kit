import { Elysia } from 'elysia';
import { db } from '@saas-starter/db';
import { createRoleSchema, updateRoleSchema, assignPermissionsSchema } from '@saas-starter/schemas';
import { listRoles, findRoleById, findRoleByName, createRole, updateRole, assignPermissionsToRole } from '../lib/role';
import { NotFoundError, ConflictError } from '../lib/errors';

export const roleHandler = new Elysia({ prefix: '/roles' })
  .get(
    '/',
    async () => {
      const roles = await listRoles().run(db);
      return { roles };
    },
    {
      detail: { tags: ['Roles'] },
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      const role = await findRoleById(params.id).run(db);

      if (!role) throw new NotFoundError('Role');

      return { role };
    },
    {
      detail: { tags: ['Roles'] },
    }
  )
  .post(
    '/',
    async ({ body }) => {
      // Check if role name already exists
      const existingRole = await findRoleByName(body.name).run(db);

      if (existingRole) throw new ConflictError('Role already exists', 'Role name must be unique');

      const newRole = await createRole(body).run(db);
      return { role: newRole };
    },
    {
      body: createRoleSchema,
      detail: { tags: ['Roles'] },
    }
  )
  .patch(
    '/:id',
    async ({ params, body }) => {
      const existingRole = await findRoleById(params.id).run(db);

      if (!existingRole) throw new NotFoundError('Role');

      const updatedRole = await updateRole(params.id, body).run(db);
      return { role: updatedRole };
    },
    {
      body: updateRoleSchema,
      detail: { tags: ['Roles'] },
    }
  )
  .post(
    '/:id/permissions',
    async ({ params, body }) => {
      // Verify role exists
      const existingRole = await findRoleById(params.id).run(db);

      if (!existingRole) throw new NotFoundError('Role');

      await assignPermissionsToRole(params.id, body.permissionIds).run(db);

      // Return updated role with permissions
      const updatedRole = await findRoleById(params.id).run(db);
      return { role: updatedRole };
    },
    {
      body: assignPermissionsSchema,
      detail: { tags: ['Roles'] },
    }
  );