import { Elysia } from 'elysia';
import { db, api } from '@saas-starter/db';
import { createRoleSchema, updateRoleSchema, assignPermissionsSchema } from '@saas-starter/schemas';
import { NotFoundError, ConflictError } from '../lib/errors';

export const roleHandler = new Elysia({ prefix: '/roles' })
  .get(
    '/',
    async () => {
      const roles = await db.query(api.roles.listRoles);
      const formattedRoles = roles.map(role => ({ ...role, id: role!._id }));
      return { roles: formattedRoles };
    },
    {
      detail: { tags: ['Roles'] },
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      const role = await db.query(api.roles.findRoleById, { id: params.id as any });

      if (!role) throw new NotFoundError('Role');

      return { role: { ...role, id: role._id } };
    },
    {
      detail: { tags: ['Roles'] },
    }
  )
  .post(
    '/',
    async ({ body }) => {
      const existingRole = await db.query(api.roles.findRoleByName, { name: body.name });

      if (existingRole) throw new ConflictError('Role already exists', 'Role name must be unique');

      const newRoleId = await db.mutation(api.roles.createRole, body);
      const newRole = await db.query(api.roles.findRoleById, { id: newRoleId });

      return { role: { ...newRole, id: newRole!._id } };
    },
    {
      body: createRoleSchema,
      detail: { tags: ['Roles'] },
    }
  )
  .patch(
    '/:id',
    async ({ params, body }) => {
      const existingRole = await db.query(api.roles.findRoleById, { id: params.id as any });

      if (!existingRole) throw new NotFoundError('Role');

      await db.mutation(api.roles.updateRole, { roleId: params.id as any, updates: body });
      const updatedRole = await db.query(api.roles.findRoleById, { id: params.id as any });

      return { role: { ...updatedRole, id: updatedRole!._id } };
    },
    {
      body: updateRoleSchema,
      detail: { tags: ['Roles'] },
    }
  )
  .post(
    '/:id/permissions',
    async ({ params, body }) => {
      const existingRole = await db.query(api.roles.findRoleById, { id: params.id as any });

      if (!existingRole) throw new NotFoundError('Role');

      await db.mutation(api.roles.assignPermissionsToRole, { 
        roleId: params.id as any, 
        permissionIds: body.permissionIds as any[]
      });

      const updatedRole = await db.query(api.roles.findRoleById, { id: params.id as any });
      return { role: { ...updatedRole, id: updatedRole!._id } };
    },
    {
      body: assignPermissionsSchema,
      detail: { tags: ['Roles'] },
    }
  );