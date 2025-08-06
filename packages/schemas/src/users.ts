import { t } from 'elysia';
import { UserSchema } from './base';

export const updateUserSchema = t.Partial(
  t.Pick(UserSchema, ['firstName', 'lastName', 'username']),
);

export const getUsersSchema = t.Object({
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
  offset: t.Optional(t.Number({ minimum: 0 })),
});

export const assignRoleSchema = t.Object({
  roleId: t.String(),
});

export const createUserSchema = t.Object({
  email: t.String({ format: 'email' }),
  username: t.String({ minLength: 3, maxLength: 50 }),
  firstName: t.Optional(t.String()),
  lastName: t.Optional(t.String()),
  roleIds: t.Array(t.String()),
  tempPassword: t.Optional(t.Boolean()),
});

export const removeRoleParamsSchema = t.Object({
  id: t.String(),
  roleId: t.String(),
});
