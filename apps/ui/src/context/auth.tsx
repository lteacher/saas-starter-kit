import { createContextId, useContext, useSignal, useVisibleTask$, component$, Slot, useContextProvider, $, isBrowser } from '@builder.io/qwik';
import type { Signal } from '@builder.io/qwik';
import type { AuthUser, AuthState, LoginInput, RegisterInput } from '@saas-starter/types';
import { client } from '../lib/api-client';

export interface AuthContext {
  state: Signal<AuthState>;
  login: (credentials: LoginInput) => Promise<void>;
  register: (userData: RegisterInput) => Promise<void>;
  logout: () => void;
}

export const AuthContextId = createContextId<AuthContext>('auth-context');

export const useAuth = () => {
  const context = useContext(AuthContextId);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const createAuthContext = (): AuthContext => {
  const state = useSignal<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Auto-check auth on client-side initialization
  useVisibleTask$(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        state.value = {
          user: JSON.parse(storedUser),
          isAuthenticated: true,
          isLoading: false,
        };
      } catch {
        localStorage.removeItem('auth_user');
        state.value = { user: null, isAuthenticated: false, isLoading: false };
      }
    } else {
      state.value = { user: null, isAuthenticated: false, isLoading: false };
    }
  });

  const login = $(async ({ email, password }: LoginInput) => {
    state.value = { ...state.value, isLoading: true };
    
    try {
      const response = await client.api.auth.login.post({ email, password });
      
      if (response.data && 'user' in response.data) {
        const user = response.data.user as AuthUser;
        
        if (isBrowser) {
          // Store in localStorage for client-side persistence
          localStorage.setItem('auth_user', JSON.stringify(user));
          
          // Set HTTP-only cookies for server-side validation
          document.cookie = `auth_user=${JSON.stringify(user)}; path=/; max-age=86400; SameSite=Strict`;
          document.cookie = `auth_token=authenticated; path=/; max-age=86400; SameSite=Strict`;
        }
        
        state.value = {
          user,
          isAuthenticated: true,
          isLoading: false,
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      state.value = { user: null, isAuthenticated: false, isLoading: false };
      throw error;
    }
  });

  const register = $(async ({ email, username, password }: RegisterInput) => {
    state.value = { ...state.value, isLoading: true };
    
    try {
      await client.api.auth.register.post({ email, username, password });
      // Auto-login after successful registration
      await login({ email, password });
    } catch (error) {
      state.value = { user: null, isAuthenticated: false, isLoading: false };
      throw error;
    }
  });

  const logout = $(() => {
    if (isBrowser) {
      localStorage.removeItem('auth_user');
    }
    state.value = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
    };
  });

  return {
    state,
    login,
    register,
    logout,
  };
};

// AuthProvider component to wrap the app
export const AuthProvider = component$(() => {
  const authContext = createAuthContext();
  useContextProvider(AuthContextId, authContext);
  
  return <Slot />;
});