import { Elysia } from 'elysia';
import { createRoleSchema, updateRoleSchema, assignPermissionsSchema } from '@saas-starter/schemas';
import {
  listRoles,
  findRoleById,
  findRoleByName,
  createRole,
  updateRole,
  updateRolePermissions,
} from '@saas-starter/db';
import { NotFoundError, ConflictError, InternalServerError, BadRequestError } from '../lib/errors';
import { requireRolesRead, requireRolesCreate, requireRolesUpdate } from '../plugins/auth';
import {
  transformRoleWithPermissions,
  transformMongoIds,
  isValidObjectId,
} from '../utils/mongo-transforms';

export const roleHandler = new Elysia({ prefix: '/roles' })
  .use(requireRolesRead)
  .get(
    '/',
    async () => {
      const roles = await listRoles();
      return transformMongoIds(roles);
    },
    {
      detail: { tags: ['Roles'] },
    },
  )
  .get(
    '/:id',
    async ({ params }) => {
      if (!isValidObjectId(params.id)) {
        throw new BadRequestError('Invalid role ID format');
      }

      const role = await findRoleById(params.id);
      if (!role) throw new NotFoundError('Role');

      return transformRoleWithPermissions(role);
    },
    {
      detail: { tags: ['Roles'] },
    },
  )
  .use(requireRolesCreate)
  .post(
    '/',
    async ({ body }) => {
      const existingRole = await findRoleByName(body.name);

      if (existingRole) throw new ConflictError('Role already exists', 'Role name must be unique');

      const newRole = await createRole(body);
      return transformRoleWithPermissions(newRole);
    },
    {
      body: createRoleSchema,
      detail: { tags: ['Roles'] },
    },
  )
  .use(requireRolesUpdate)
  .patch(
    '/:id',
    async ({ params, body }) => {
      if (!isValidObjectId(params.id)) {
        throw new BadRequestError('Invalid role ID format');
      }

      const existingRole = await findRoleById(params.id);
      if (!existingRole) throw new NotFoundError('Role');

      const updatedRole = await updateRole(params.id, body);
      if (!updatedRole) throw new InternalServerError('Update failed');

      return transformRoleWithPermissions(updatedRole);
    },
    {
      body: updateRoleSchema,
      detail: { tags: ['Roles'] },
    },
  )
  .post(
    '/:id/permissions',
    async ({ params, body }) => {
      if (!isValidObjectId(params.id)) {
        throw new BadRequestError('Invalid role ID format');
      }

      const existingRole = await findRoleById(params.id);
      if (!existingRole) throw new NotFoundError('Role');

      await updateRolePermissions(params.id, body.permissions);

      const updatedRole = await findRoleById(params.id);
      if (!updatedRole) throw new InternalServerError('Role not found after update');

      return transformRoleWithPermissions(updatedRole);
    },
    {
      body: assignPermissionsSchema,
      detail: { tags: ['Roles'] },
    },
  );
