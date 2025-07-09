import { t } from 'elysia';
import type { User, Role, Permission } from '@saas-starter/db';

// Base schemas that match our database interfaces
export const UserSchema = t.Object({
  id: t.String(),
  email: t.String({ format: 'email' }),
  username: t.String(),
  passwordHash: t.String(),
  firstName: t.Optional(t.String()),
  lastName: t.Optional(t.String()),
  avatarUrl: t.Optional(t.String()),
  isActive: t.Boolean(),
  isVerified: t.Boolean(),
  createdAt: t.Date(),
  updatedAt: t.Optional(t.Date()),
  lastLoginAt: t.Optional(t.Date()),
  passwordResetToken: t.Optional(t.String()),
  passwordResetExpires: t.Optional(t.Date()),
  emailVerificationToken: t.Optional(t.String()),
  emailVerifiedAt: t.Optional(t.Date()),
  fullName: t.Optional(t.String()),
});

export const RoleSchema = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.Optional(t.String()),
  isActive: t.Boolean(),
  createdAt: t.Date(),
});

export const PermissionSchema = t.Object({
  id: t.String(),
  name: t.String(),
  resource: t.String(),
  action: t.String(),
  description: t.Optional(t.String()),
  createdAt: t.Date(),
});
