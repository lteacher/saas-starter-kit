import { t } from 'elysia';
import { RoleSchema } from './base';

export const createRoleSchema = t.Object({
  name: t.String(),
  description: t.Optional(t.String()),
  isActive: t.Optional(t.Boolean())
});
export const updateRoleSchema = t.Partial(t.Pick(RoleSchema, ['name', 'description']));

export const assignPermissionsSchema = t.Object({
  permissions: t.Array(t.Object({
    name: t.String(),
    resource: t.String(),
    action: t.String(),
    description: t.Optional(t.String())
  })),
});