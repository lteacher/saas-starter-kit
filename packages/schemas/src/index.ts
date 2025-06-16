import { t } from 'elysia';

// Common schemas
export const IdSchema = t.String({ minLength: 1 });
export const EmailSchema = t.String({ format: 'email' });
export const PasswordSchema = t.String({ minLength: 8 });

// User schemas
export const CreateUserSchema = t.Object({
  name: t.String({ minLength: 1 }),
  email: EmailSchema,
  password: PasswordSchema,
  roleId: IdSchema,
});

export const UpdateUserSchema = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  email: t.Optional(EmailSchema),
  roleId: t.Optional(IdSchema),
  isActive: t.Optional(t.Boolean()),
});

export const LoginSchema = t.Object({
  email: EmailSchema,
  password: t.String({ minLength: 1 }),
});

// Role schemas
export const CreateRoleSchema = t.Object({
  name: t.String({ minLength: 1 }),
  description: t.Optional(t.String()),
  permissions: t.Array(IdSchema),
});

export const UpdateRoleSchema = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  description: t.Optional(t.String()),
  permissions: t.Optional(t.Array(IdSchema)),
});

// Permission schemas
export const CreatePermissionSchema = t.Object({
  name: t.String({ minLength: 1 }),
  description: t.Optional(t.String()),
  resource: t.String({ minLength: 1 }),
  action: t.String({ minLength: 1 }),
});

export const UpdatePermissionSchema = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  description: t.Optional(t.String()),
  resource: t.Optional(t.String({ minLength: 1 })),
  action: t.Optional(t.String({ minLength: 1 })),
});

// Response schemas
export const UserResponseSchema = t.Object({
  id: IdSchema,
  name: t.String(),
  email: EmailSchema,
  isActive: t.Boolean(),
  createdAt: t.String({ format: 'date-time' }),
  updatedAt: t.String({ format: 'date-time' }),
  role: t.Object({
    id: IdSchema,
    name: t.String(),
    permissions: t.Array(t.Object({
      id: IdSchema,
      name: t.String(),
      resource: t.String(),
      action: t.String(),
    })),
  }),
});

export const AuthResponseSchema = t.Object({
  user: UserResponseSchema,
  accessToken: t.String(),
  refreshToken: t.String(),
});

export const ErrorResponseSchema = t.Object({
  error: t.String(),
  message: t.String(),
  statusCode: t.Number(),
});