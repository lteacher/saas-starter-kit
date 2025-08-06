import { t } from 'elysia';
import { UserSchema } from './base';

export const registerSchema = t.Object({
  email: t.String({ format: 'email' }),
  username: t.String({ minLength: 3, maxLength: 50 }),
  password: t.String({ minLength: 8 }),
});

export const loginSchema = t.Object({
  identifier: t.String({ minLength: 1 }),
  password: t.String({ minLength: 1 }),
});
