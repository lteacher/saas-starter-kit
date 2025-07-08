import { Elysia } from 'elysia';
import { hashPassword, verifyPassword } from '../utils/password';
import { registerSchema, loginSchema } from '@saas-starter/schemas';
import { findUserByEmailWithRoles, createUser, updateLastLogin } from '@saas-starter/db';
import { ConflictError, UnauthorizedError, InternalServerError } from '../lib/errors';

export const authHandler = new Elysia({ prefix: '/auth' })
  .post(
    '/register',
    async ({ body }) => {
      const existingUser = await findUserByEmailWithRoles(body.email);

      if (existingUser) throw new ConflictError('User already exists', 'Email is already registered');

      const passwordHash = await hashPassword(body.password);
      
      const newUser = await createUser({
        email: body.email,
        username: body.username,
        passwordHash,
      });

      const { _id, ...userData } = newUser;
      return {
        id: `${_id}`,
        email: userData.email,
        username: userData.username,
      };
    },
    {
      body: registerSchema,
      detail: { tags: ['Auth'] },
    }
  )
  .post(
    '/login',
    async ({ body }) => {
      const user = await findUserByEmailWithRoles(body.email);

      if (!user || !user.isActive) throw new UnauthorizedError('Invalid credentials');

      const isValidPassword = await verifyPassword(body.password, user.passwordHash);

      if (!isValidPassword) throw new UnauthorizedError('Invalid credentials');

      await updateLastLogin(`${user._id}`);

      const { _id: userId, ...userInfo } = user;
      return {
        user: {
          id: `${userId}`,
          email: userInfo.email,
          username: userInfo.username,
          roles: user.roles.map(role => ({
            name: role.name,
            permissions: role.permissions,
          })),
        },
      };
    },
    {
      body: loginSchema,
      detail: { tags: ['Auth'] },
    }
  );