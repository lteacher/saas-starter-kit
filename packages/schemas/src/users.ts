import { t } from 'elysia';
import { UserSchema } from './base';

export const updateUserSchema = t.Partial(t.Pick(UserSchema, ['firstName', 'lastName', 'username']));

export const getUsersSchema = t.Object({
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
  offset: t.Optional(t.Number({ minimum: 0 })),
});