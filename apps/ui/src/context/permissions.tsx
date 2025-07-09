import {
  createContextId,
  useContext,
  useSignal,
  component$,
  Slot,
  useContextProvider,
  $,
  useTask$,
} from '@builder.io/qwik';
import type { Signal } from '@builder.io/qwik';
import type { AuthUser, AuthState } from '@saas-starter/types';
import { useAuth } from './auth';

export interface PermissionsState {
  permissions: string[];
  canManageUsers: boolean;
  canViewUsers: boolean;
  canManageRoles: boolean;
  canViewRoles: boolean;
  isAdmin: boolean;
  isLoaded: boolean;
}

export interface PermissionsContext {
  // Raw state for advanced use cases
  state: Signal<PermissionsState>;

  // Clean getters for common usage
  permissions: string[];
  canManageUsers: boolean;
  canViewUsers: boolean;
  canManageRoles: boolean;
  canViewRoles: boolean;
  isAdmin: boolean;
  isLoaded: boolean;

  refreshPermissions: () => void;
}

export const PermissionsContextId = createContextId<PermissionsContext>('permissions-context');

// Hook to access permissions context within components
export const usePermissions = () => {
  const context = useContext(PermissionsContextId);
  if (!context) {
    throw new Error('usePermissions must be used within PermissionsProvider');
  }
  return context;
};

// Extracts all permissions from a user's roles
export const getUserPermissions = (user: AuthUser): string[] => {
  const permissions = new Set<string>();

  user.roles.forEach((role) => {
    role.permissions.forEach((permission) => {
      permissions.add(permission.name);
    });
  });

  return Array.from(permissions);
};

// Checks if user has a specific permission
export const hasPermission = (user: AuthUser | null, permission: string): boolean => {
  if (!user) return false;

  const userPermissions = getUserPermissions(user);
  return userPermissions.includes(permission);
};

// Checks if user has any of the specified permissions
export const hasAnyPermission = (user: AuthUser | null, permissions: string[]): boolean => {
  if (!user) return false;

  const userPermissions = getUserPermissions(user);
  return permissions.some((permission) => userPermissions.includes(permission));
};

// Checks if user has all of the specified permissions
export const hasAllPermissions = (user: AuthUser | null, permissions: string[]): boolean => {
  if (!user) return false;

  const userPermissions = getUserPermissions(user);
  return permissions.every((permission) => userPermissions.includes(permission));
};

// Checks if user can perform user management operations
export const canManageUsers = (user: AuthUser | null): boolean => {
  return hasAnyPermission(user, ['users:create', 'users:update', 'users:delete']);
};

// Checks if user can view user data
export const canViewUsers = (user: AuthUser | null): boolean => {
  return hasPermission(user, 'users:read');
};

// Checks if user can manage roles
export const canManageRoles = (user: AuthUser | null): boolean => {
  return hasAnyPermission(user, ['roles:create', 'roles:update', 'roles:delete']);
};

// Checks if user can view roles
export const canViewRoles = (user: AuthUser | null): boolean => {
  return hasPermission(user, 'roles:read');
};

// Checks if user has admin role
export const isAdmin = (user: AuthUser | null): boolean => {
  if (!user) return false;
  return user.roles.some((role) => role.name === 'admin');
};

// Calculates complete permissions state from user data
const calculatePermissions = (user: AuthUser | null): PermissionsState => {
  if (!user) {
    return {
      permissions: [],
      canManageUsers: false,
      canViewUsers: false,
      canManageRoles: false,
      canViewRoles: false,
      isAdmin: false,
      isLoaded: true,
    };
  }

  const permissions = getUserPermissions(user);

  return {
    permissions,
    canManageUsers: canManageUsers(user),
    canViewUsers: canViewUsers(user),
    canManageRoles: canManageRoles(user),
    canViewRoles: canViewRoles(user),
    isAdmin: isAdmin(user),
    isLoaded: true,
  };
};

// Creates permissions context with reactive state
export const createPermissionsContext = (authState: Signal<AuthState>): PermissionsContext => {
  const state = useSignal<PermissionsState>(calculatePermissions(authState.value.user));

  // Watch auth state changes and update permissions accordingly
  useTask$(({ track }) => {
    const user = track(() => authState.value.user);

    state.value = calculatePermissions(user);
  });

  const refreshPermissions = $(() => {
    const user = authState.value.user;
    if (user) {
      state.value = calculatePermissions(user);
    }
  });

  return {
    // Raw state for advanced use cases
    state,

    // Clean getters for common usage
    get permissions() {
      return state.value.permissions;
    },
    get canManageUsers() {
      return state.value.canManageUsers;
    },
    get canViewUsers() {
      return state.value.canViewUsers;
    },
    get canManageRoles() {
      return state.value.canManageRoles;
    },
    get canViewRoles() {
      return state.value.canViewRoles;
    },
    get isAdmin() {
      return state.value.isAdmin;
    },
    get isLoaded() {
      return state.value.isLoaded;
    },

    refreshPermissions,
  };
};

// Context provider component to wrap parts of the app that need permissions
export const PermissionsProvider = component$(() => {
  const auth = useAuth();
  const permissionsContext = createPermissionsContext(auth.state);
  useContextProvider(PermissionsContextId, permissionsContext);

  return <Slot />;
});
