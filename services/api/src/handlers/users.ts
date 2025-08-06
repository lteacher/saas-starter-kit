import { Elysia } from 'elysia';
import {
  updateUserSchema,
  getUsersSchema,
  assignRoleSchema,
  createUserSchema,
  removeRoleParamsSchema,
} from '@saas-starter/schemas';
import {
  findUserByIdWithRoles,
  updateUser,
  listUsersWithRoles,
  addRoleToUser,
  removeRoleFromUser,
  createUser,
  findUserByEmail,
  findUserByUsername,
} from '@saas-starter/db';
import { NotFoundError, ConflictError, InternalServerError, BadRequestError } from '../lib/errors';
import { requireUsersRead, requireUsersUpdate, requireUsersCreate } from '../plugins/auth';
import {
  transformUserWithRoles,
  createPaginatedResponse,
  isValidObjectId,
} from '../utils/mongo-transforms';

export const userHandler = new Elysia({ prefix: '/users' })
  .use(requireUsersRead)
  .get(
    '/',
    async ({ query }) => {
      const result = await listUsersWithRoles({ limit: query.limit, offset: query.offset });
      const transformedUsers = result.users.map(transformUserWithRoles);

      return createPaginatedResponse(
        transformedUsers,
        result.total,
        Math.floor((query.offset || 0) / (query.limit || 20)) + 1,
        query.limit || 20,
      );
    },
    {
      query: getUsersSchema,
      detail: { tags: ['Users'] },
    },
  )
  .get(
    '/:id',
    async ({ params }) => {
      if (!isValidObjectId(params.id)) {
        throw new BadRequestError('Invalid user ID format');
      }

      const user = await findUserByIdWithRoles(params.id);
      if (!user) throw new NotFoundError('User');

      return transformUserWithRoles(user);
    },
    {
      detail: { tags: ['Users'] },
    },
  )
  .use(requireUsersCreate)
  .post(
    '/',
    async ({ body }) => {
      // Check for existing email
      const existingEmail = await findUserByEmail(body.email);
      if (existingEmail) {
        throw new ConflictError('Email already exists');
      }

      // Check for existing username
      const existingUsername = await findUserByUsername(body.username);
      if (existingUsername) {
        throw new ConflictError('Username already exists');
      }

      const newUser = await createUser(body);
      const userWithRoles = await findUserByIdWithRoles(newUser._id.toString());
      if (!userWithRoles) throw new InternalServerError('User not found after creation');

      return transformUserWithRoles(userWithRoles);
    },
    {
      body: createUserSchema,
      detail: { tags: ['Users'] },
    },
  )
  .use(requireUsersUpdate)
  .patch(
    '/:id',
    async ({ params, body }) => {
      if (!isValidObjectId(params.id)) {
        throw new BadRequestError('Invalid user ID format');
      }

      const existingUser = await findUserByIdWithRoles(params.id);
      if (!existingUser) throw new NotFoundError('User');

      const updatedUser = await updateUser(params.id, body);
      if (!updatedUser) throw new InternalServerError('Update failed');

      const userWithRoles = await findUserByIdWithRoles(params.id);
      if (!userWithRoles) throw new InternalServerError('User not found after update');

      return transformUserWithRoles(userWithRoles);
    },
    {
      body: updateUserSchema,
      detail: { tags: ['Users'] },
    },
  )
  .post(
    '/:id/roles',
    async ({ params, body }) => {
      if (!isValidObjectId(params.id)) {
        throw new BadRequestError('Invalid user ID format');
      }
      if (!isValidObjectId(body.roleId)) {
        throw new BadRequestError('Invalid role ID format');
      }

      const user = await findUserByIdWithRoles(params.id);
      if (!user) throw new NotFoundError('User');

      await addRoleToUser(params.id, body.roleId);

      const updatedUser = await findUserByIdWithRoles(params.id);
      if (!updatedUser) throw new InternalServerError('User not found after role assignment');

      return transformUserWithRoles(updatedUser);
    },
    {
      body: assignRoleSchema,
      detail: { tags: ['Users'] },
    },
  )
  .delete(
    '/:id/roles/:roleId',
    async ({ params }) => {
      if (!isValidObjectId(params.id)) {
        throw new BadRequestError('Invalid user ID format');
      }
      if (!isValidObjectId(params.roleId)) {
        throw new BadRequestError('Invalid role ID format');
      }

      const user = await findUserByIdWithRoles(params.id);
      if (!user) throw new NotFoundError('User');

      await removeRoleFromUser(params.id, params.roleId);

      const updatedUser = await findUserByIdWithRoles(params.id);
      if (!updatedUser) throw new InternalServerError('User not found after role removal');

      return transformUserWithRoles(updatedUser);
    },
    {
      params: removeRoleParamsSchema,
      detail: { tags: ['Users'] },
    },
  );
