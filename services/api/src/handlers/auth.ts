import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { verifyPassword } from '../utils/password';
import { loginSchema } from '@saas-starter/schemas';
import {
  findUserByEmailWithRoles,
  findUserByUsernameWithRoles,
  updateLastLogin,
} from '@saas-starter/db';
import { UnauthorizedError } from '../lib/errors';

export const authHandler = new Elysia({ prefix: '/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'default-secret-key',
    }),
  )
  .post(
    '/login',
    async ({ body, jwt }) => {
      // Try to find user by email first, then by username
      let user = await findUserByEmailWithRoles(body.identifier);

      if (!user) {
        // If not found by email, try by username
        user = await findUserByUsernameWithRoles(body.identifier);
      }

      if (!user || !user.isActive) throw new UnauthorizedError('Invalid credentials');

      const isValidPassword = await verifyPassword(body.password, user.passwordHash);

      if (!isValidPassword) throw new UnauthorizedError('Invalid credentials');

      await updateLastLogin(`${user._id}`);

      // Generate JWT token
      const token = await jwt.sign({ userId: `${user._id}` });

      const { _id: userId, ...userInfo } = user;
      return {
        user: {
          id: `${userId}`,
          email: userInfo.email,
          username: userInfo.username,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          tempPassword: userInfo.tempPassword,
          roles: user.roles.map((role) => ({
            name: role.name,
            permissions: role.permissions,
          })),
        },
        token,
      };
    },
    {
      body: loginSchema,
      detail: { tags: ['Auth'] },
    },
  );
