import { t } from 'elysia';
import { PermissionSchema } from './base';

export const createPermissionSchema = t.Pick(PermissionSchema, ['name', 'resource', 'action', 'description']);
export const updatePermissionSchema = t.Partial(t.Pick(PermissionSchema, ['name', 'resource', 'action', 'description']));