import { Elysia } from 'elysia';
import { updateUserSchema, getUsersSchema } from '@saas-starter/schemas';
import { findUserByIdWithRoles, updateUser, listUsersWithRoles } from '@saas-starter/db';
import { NotFoundError } from '../lib/errors';

export const userHandler = new Elysia({ prefix: '/users' })
  .get(
    '/',
    async ({ query }) => {
      const result = await listUsersWithRoles({ limit: query.limit, offset: query.offset });
      return { 
        users: result.users.map(user => {
          const { _id: userId, ...userData } = user;
          return {
            ...userData,
            id: `${userId}`,
            roles: user.roles.map(role => {
              const { _id: roleId, ...roleData } = role;
              return {
                ...roleData,
                id: `${roleId}`
              };
            })
          };
        }),
        total: result.total
      };
    },
    {
      query: getUsersSchema,
      detail: { tags: ['Users'] },
    }
  )
  .get(
    '/:id',
    async ({ params }) => {
      const user = await findUserByIdWithRoles(params.id);

      if (!user) throw new NotFoundError('User');

      const { _id: userId, ...userData } = user;
      return { 
        ...userData,
        id: `${userId}`,
        roles: user.roles.map(role => {
          const { _id: roleId, ...roleData } = role;
          return {
            ...roleData,
            id: `${roleId}`
          };
        })
      };
    },
    {
      detail: { tags: ['Users'] },
    }
  )
  .patch(
    '/:id',
    async ({ params, body }) => {
      const existingUser = await findUserByIdWithRoles(params.id);
      if (!existingUser) throw new NotFoundError('User');

      const updatedUser = await updateUser(params.id, body);
      if (!updatedUser) throw new Error('Update failed');
      const userWithRoles = await findUserByIdWithRoles(params.id);
      if (!userWithRoles) throw new Error('User not found after update');
      const { _id: userId, ...userData } = userWithRoles;
      return { 
        ...userData,
        id: `${userId}`,
        roles: userWithRoles.roles.map(role => {
          const { _id: roleId, ...roleData } = role;
          return {
            ...roleData,
            id: `${roleId}`
          };
        })
      };
    },
    {
      body: updateUserSchema,
      detail: { tags: ['Users'] },
    }
  );