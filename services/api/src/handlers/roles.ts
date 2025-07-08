import { Elysia } from 'elysia';
import { createRoleSchema, updateRoleSchema, assignPermissionsSchema } from '@saas-starter/schemas';
import { listRoles, findRoleById, findRoleByName, createRole, updateRole, updateRolePermissions } from '@saas-starter/db';
import { NotFoundError, ConflictError } from '../lib/errors';

export const roleHandler = new Elysia({ prefix: '/roles' })
  .get(
    '/',
    async () => {
      const roles = await listRoles();
      return roles.map(role => {
        const { _id, ...roleData } = role;
        return { 
          ...roleData, 
          id: `${_id}` 
        };
      });
    },
    {
      detail: { tags: ['Roles'] },
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      const role = await findRoleById(params.id);

      if (!role) throw new NotFoundError('Role');

      const { _id, ...roleData } = role;
      return { 
        ...roleData, 
        id: `${_id}` 
      };
    },
    {
      detail: { tags: ['Roles'] },
    }
  )
  .post(
    '/',
    async ({ body }) => {
      const existingRole = await findRoleByName(body.name);

      if (existingRole) throw new ConflictError('Role already exists', 'Role name must be unique');

      const newRole = await createRole(body);
      const { _id, ...roleData } = newRole;
      return { 
        ...roleData, 
        id: `${_id}` 
      };
    },
    {
      body: createRoleSchema,
      detail: { tags: ['Roles'] },
    }
  )
  .patch(
    '/:id',
    async ({ params, body }) => {
      const existingRole = await findRoleById(params.id);

      if (!existingRole) throw new NotFoundError('Role');

      const updatedRole = await updateRole(params.id, body);
      if (!updatedRole) throw new Error('Update failed');
      const { _id, ...roleData } = updatedRole;
      return { 
        ...roleData, 
        id: `${_id}` 
      };
    },
    {
      body: updateRoleSchema,
      detail: { tags: ['Roles'] },
    }
  )
  .post(
    '/:id/permissions',
    async ({ params, body }) => {
      const existingRole = await findRoleById(params.id);

      if (!existingRole) throw new NotFoundError('Role');

      await updateRolePermissions(params.id, body.permissions);

      const updatedRole = await findRoleById(params.id);
      if (!updatedRole) throw new Error('Role not found after update');
      const { _id, ...roleData } = updatedRole;
      return { 
        ...roleData, 
        id: `${_id}` 
      };
    },
    {
      body: assignPermissionsSchema,
      detail: { tags: ['Roles'] },
    }
  );