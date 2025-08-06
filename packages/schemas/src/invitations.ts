import { t } from 'elysia';

export const createInvitationSchema = t.Object({
  userId: t.String(),
  email: t.String({ format: 'email' }),
});

export const acceptInvitationSchema = t.Object({
  password: t.String({ minLength: 6 }),
});
