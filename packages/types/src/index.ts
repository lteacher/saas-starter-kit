import type { Static } from 'elysia';
import { 
  UserSchema, 
  RoleSchema, 
  PermissionSchema,
  registerSchema,
  loginSchema,
  updateUserSchema,
  getUsersSchema
} from '@saas-starter/schemas';

// Core entity types derived from schemas
export type User = Static<typeof UserSchema>;
export type Role = Static<typeof RoleSchema>;
export type Permission = Static<typeof PermissionSchema>;

// Auth types derived from schemas
export type RegisterInput = Static<typeof registerSchema>;
export type LoginInput = Static<typeof loginSchema>;

// User management types
export type UpdateUserInput = Static<typeof updateUserSchema>;
export type GetUsersInput = Static<typeof getUsersSchema>;

// Frontend-specific auth types
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  roles: Array<{
    name: string;
    permissions: Permission[];
  }>;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Role and Permission Management types
export interface RoleWithStats extends Role {
  userCount: number;
}

export interface PermissionGroup {
  resource: string;
  permissions: Permission[];
}

// API Response types
export interface LoginResponse {
  user: AuthUser;
  token?: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  username: string;
}