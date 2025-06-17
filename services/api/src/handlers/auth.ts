import { Elysia } from 'elysia';
import { db } from '@saas-starter/db';
import { hashPassword, verifyPassword } from '../utils/password';
import { registerSchema, loginSchema } from '@saas-starter/schemas/auth';
import { findUserByEmail, createUser, updateLastLogin } from '../lib/user';
import { ConflictError, UnauthorizedError, InternalServerError } from '../lib/errors';

export const authHandler = new Elysia({ prefix: '/auth' })
  .post(
    '/register',
    async ({ body }) => {
      const existingUser = await findUserByEmail(body.email).run(db);

      if (existingUser) throw new ConflictError('User already exists', 'Email is already registered');

      const passwordHash = await hashPassword(body.password);
      
      const newUser = await createUser({
        email: body.email,
        username: body.username,
        passwordHash,
        firstName: body.firstName,
        lastName: body.lastName,
      }).run(db);

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
      const user = await findUserByEmail(body.email).run(db);

      if (!user || !user.isActive) throw new UnauthorizedError('Invalid credentials');

      const isValidPassword = await verifyPassword(body.password, user.passwordHash);

      if (!isValidPassword) throw new UnauthorizedError('Invalid credentials');

      await updateLastLogin(user.id).run(db);

      return {
        user: {
          id: user.id,
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