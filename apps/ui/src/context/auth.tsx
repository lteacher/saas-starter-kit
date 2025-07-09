import {
  createContextId,
  useContext,
  useSignal,
  component$,
  Slot,
  useContextProvider,
  $,
} from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import type { Signal } from '@builder.io/qwik';
import type { AuthUser, AuthState, LoginInput } from '@saas-starter/types';
import { useLogoutAction } from '../routes/auth/actions';

export interface AuthContext {
  state: Signal<AuthState>;
  login: (credentials: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: AuthUser | null) => void;
}

export const AuthContextId = createContextId<AuthContext>('auth-context');

export const useAuth = () => {
  const context = useContext(AuthContextId);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Creates authentication context with proper Qwik patterns
export const createAuthContext = ({
  initialUser,
  loginAction,
}: {
  initialUser?: AuthUser | null;
  loginAction?: any;
}): AuthContext => {
  const state = useSignal<AuthState>({
    user: initialUser || null,
    isAuthenticated: !!initialUser,
    isLoading: false,
  });

  const nav = useNavigate();
  const logoutAction = useLogoutAction();

  // Login function that calls server action
  const login = $(async (credentials: LoginInput) => {
    state.value = { ...state.value, isLoading: true };

    try {
      if (!loginAction) {
        throw new Error('Login action not available');
      }

      const result = await loginAction.submit(credentials);

      if (result.value?.success && result.value.user) {
        // Update context with user data
        state.value = {
          user: result.value.user,
          isAuthenticated: true,
          isLoading: false,
        };

        // Navigate to dashboard
        nav('/dashboard');
      } else {
        state.value = { user: null, isAuthenticated: false, isLoading: false };
        throw new Error(result.value?.message || 'Login failed');
      }
    } catch (error) {
      state.value = { user: null, isAuthenticated: false, isLoading: false };
      throw error;
    }
  });

  // Logout function that redirects to logout route
  const logout = $(async () => {
    state.value = { ...state.value, isLoading: true };

    // Clear local state
    state.value = { user: null, isAuthenticated: false, isLoading: false };

    // Redirect to logout route which will clear cookies and redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/logout';
    } else {
      nav('/logout');
    }
  });

  // Updates user state when authentication changes
  const updateUser = $((user: AuthUser | null) => {
    state.value = {
      user,
      isAuthenticated: !!user,
      isLoading: false,
    };
  });

  return {
    state,
    login,
    logout,
    updateUser,
  };
};

// AuthProvider component to wrap the app
export const AuthProvider = component$<{ initialUser?: AuthUser | null; loginAction?: any }>(
  ({ initialUser, loginAction }) => {
    const authContext = createAuthContext({ initialUser, loginAction });
    useContextProvider(AuthContextId, authContext);

    return <Slot />;
  },
);
