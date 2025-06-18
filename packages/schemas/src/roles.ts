import { t } from 'elysia';
import { RoleSchema } from './base';

export const createRoleSchema = t.Pick(RoleSchema, ['name', 'description']);
export const updateRoleSchema = t.Partial(t.Pick(RoleSchema, ['name', 'description']));

export const assignPermissionsSchema = t.Object({
  permissionIds: t.Array(t.String()),
});