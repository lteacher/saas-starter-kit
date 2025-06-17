import { e } from '@saas-starter/db';

// Find a user by their email address with full profile and permissions
export const findUserByEmail = (email: string) =>
  e.select(e.User, user => ({
    id: true,
    email: true,
    username: true,
    passwordHash: true,
    isActive: true,
    isVerified: true,
    roles: {
      name: true,
      permissions: {
        name: true,
        resource: true,
        action: true,
      },
    },
    filter_single: { email },
  }));

// Find a user by their ID with full profile and permissions
export const findUserById = (id: string) =>
  e.select(e.User, user => ({
    id: true,
    email: true,
    username: true,
    firstName: true,
    lastName: true,
    isActive: true,
    isVerified: true,
    createdAt: true,
    lastLoginAt: true,
    roles: {
      name: true,
      permissions: {
        name: true,
        resource: true,
        action: true,
      },
    },
    filter_single: { id },
  }));

// Create a new user with default 'user' role
export const createUser = (userData: {
  email: string;
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
}) =>
  e.insert(e.User, {
    ...userData,
    roles: e.select(e.Role, role => ({ filter_single: { name: 'user' } })),
  });

// Update user's last login timestamp to current time
export const updateLastLogin = (userId: string) =>
  e.update(e.User, user => ({
    filter_single: { id: userId },
    set: { lastLoginAt: e.datetime_current() },
  }));

// Update user profile information
export const updateUser = (userId: string, updates: {
  firstName?: string;
  lastName?: string;
  username?: string;
}) =>
  e.update(e.User, user => ({
    filter_single: { id: userId },
    set: updates,
  }));

// Get paginated list of users with basic profile and roles
export const listUsers = (limit?: number, offset?: number) =>
  e.select(e.User, user => ({
    id: true,
    email: true,
    username: true,
    firstName: true,
    lastName: true,
    isActive: true,
    createdAt: true,
    roles: { name: true },
    order_by: user.createdAt,
    limit,
    offset,
  }));