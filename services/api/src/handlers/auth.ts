import { Elysia } from 'elysia';
import { db, api } from '@saas-starter/db';
import { hashPassword, verifyPassword } from '../utils/password';
import { registerSchema, loginSchema } from '@saas-starter/schemas';
import { ConflictError, UnauthorizedError } from '../lib/errors';

export const authHandler = new Elysia({ prefix: '/auth' })
  .post(
    '/register',
    async ({ body }) => {
      const existingUser = await db.query(api.users.findUserByEmail, { email: body.email });

      if (existingUser) throw new ConflictError('User already exists', 'Email is already registered');

      const passwordHash = await hashPassword(body.password);
      
      const newUser = await db.mutation(api.users.createUser, {
        email: body.email,
        username: body.username,
        passwordHash,
      });

      return {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
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
      const user = await db.query(api.users.findUserByEmail, { email: body.email });

      if (!user || !user.isActive) throw new UnauthorizedError('Invalid credentials');

      const isValidPassword = await verifyPassword(body.password, user.passwordHash);

      if (!isValidPassword) throw new UnauthorizedError('Invalid credentials');

      // The updateLastLogin function was not migrated as it's not essential for the core logic.
      // It can be added back later if needed.

      return {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
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