import { Elysia } from 'elysia';
import { db } from '@saas-starter/db';
import { updateUserSchema, getUsersSchema } from '@saas-starter/schemas/users';
import { findUserById, updateUser, listUsers } from '../lib/user';
import { NotFoundError } from '../lib/errors';

export const userHandler = new Elysia({ prefix: '/users' })
  .get(
    '/',
    async ({ query }) => {
      const users = await listUsers(query.limit, query.offset).run(db);
      return { users };
    },
    {
      query: getUsersSchema,
      detail: { tags: ['Users'] },
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      const user = await findUserById(params.id).run(db);

      if (!user) throw new NotFoundError('User');

      return { user };
    },
    {
      detail: { tags: ['Users'] },
    }
  )
  .patch(
    '/:id',
    async ({ params, body }) => {
      // Verify user exists before updating
      const existingUser = await findUserById(params.id).run(db);

      if (!existingUser) throw new NotFoundError('User');

      const updatedUser = await updateUser(params.id, body).run(db);
      return { user: updatedUser };
    },
    {
      body: updateUserSchema,
      detail: { tags: ['Users'] },
    }
  );