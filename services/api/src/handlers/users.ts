import { Elysia } from 'elysia';
import { db, api } from '@saas-starter/db';
import { updateUserSchema, getUsersSchema } from '@saas-starter/schemas';
import { NotFoundError } from '../lib/errors';

export const userHandler = new Elysia({ prefix: '/users' })
  .get(
    '/',
    async ({ query }) => {
      const users = await db.query(api.users.listUsers, { 
        paginationOpts: { limit: query.limit, offset: query.offset }
      });
      const formattedUsers = users.map(user => ({ ...user, id: user._id }));
      return { users: formattedUsers };
    },
    {
      query: getUsersSchema,
      detail: { tags: ['Users'] },
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      const user = await db.query(api.users.findUserById, { id: params.id as any });

      if (!user) throw new NotFoundError('User');

      return { user: { ...user, id: user._id } };
    },
    {
      detail: { tags: ['Users'] },
    }
  )
  .patch(
    '/:id',
    async ({ params, body }) => {
      const existingUser = await db.query(api.users.findUserById, { id: params.id as any });

      if (!existingUser) throw new NotFoundError('User');

      await db.mutation(api.users.updateUser, { userId: params.id as any, updates: body });
      
      const updatedUser = await db.query(api.users.findUserById, { id: params.id as any });

      return { user: { ...updatedUser, id: updatedUser!._id } };
    },
    {
      body: updateUserSchema,
      detail: { tags: ['Users'] },
    }
  );