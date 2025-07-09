# Frontend Guidelines - Qwik Best Practices

## Project Structure

### Directory Organization

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (buttons, inputs, etc.)
│   ├── auth/            # Authentication-specific components
│   ├── dashboard/       # Dashboard-specific components
│   └── feature/         # Feature-specific component groups
├── routes/              # File-based routing
│   ├── layout.tsx       # Root layout
│   ├── index.tsx        # Home page
│   └── feature/         # Feature routes with nested layouts
├── context/             # Global state and context providers
├── lib/                 # Utilities and API clients
└── global.css           # Global styles
```

### Component Organization

- **Group by feature**: Keep related components together (e.g., `components/users/`, `components/roles/`)
- **Base components**: Place reusable UI components in `components/ui/`
- **One component per file**: Each component should have its own file with clear naming

## Component Architecture

### Component Design Principles

#### 1. Composable Components

```tsx
// ✅ Good - Composable and focused
export const UserCard = component$<{ user: User }>(({ user }) => {
  return (
    <div class="card">
      <UserAvatar user={user} />
      <UserInfo user={user} />
      <UserActions user={user} />
    </div>
  );
});

// ❌ Bad - Monolithic component
export const UserCard = component$<{ user: User }>(({ user }) => {
  return <div class="card">{/* 100+ lines of mixed avatar, info, and action logic */}</div>;
});
```

#### 2. Proper TypeScript Interfaces

```tsx
// ✅ Always define interfaces for props
interface UserFormProps {
  initialData?: Partial<User>;
  isLoading?: boolean;
  error?: string;
  onSubmit?: (data: UserFormData) => void;
}

export const UserForm = component$<UserFormProps>(
  ({ initialData, isLoading = false, error, onSubmit }) => {
    // Component implementation
  },
);
```

#### 3. Event Handler Patterns

```tsx
// ✅ Always wrap event handlers with $()
export const ToggleButton = component$(() => {
  const isToggled = useSignal(false);

  const handleToggle = $(() => {
    isToggled.value = !isToggled.value;
  });

  return <button onClick$={handleToggle}>{isToggled.value ? 'On' : 'Off'}</button>;
});
```

## State Management

### Local Component State

```tsx
// ✅ Use useSignal for reactive local state
export const Counter = component$(() => {
  const count = useSignal(0);

  const increment = $(() => {
    count.value++;
  });

  return (
    <div>
      <span>{count.value}</span>
      <button onClick$={increment}>+</button>
    </div>
  );
});
```

### Global State with Context

```tsx
// ✅ Context for shared application state
export const AuthContext = createContextId<AuthState>('auth');

export const AuthProvider = component$(() => {
  const authState = useSignal<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useContextProvider(AuthContext, authState);

  return <Slot />;
});

// Usage in components
export const Header = component$(() => {
  const authState = useContext(AuthContext);

  return (
    <header>
      {authState.value.isAuthenticated ? <UserMenu user={authState.value.user} /> : <LoginButton />}
    </header>
  );
});
```

## Routing & Data Loading

### Layout Patterns

```tsx
// ✅ Use proper layout hierarchy
// routes/layout.tsx - Root layout
export default component$(() => {
  const authData = useAuthLoader();

  return (
    <html>
      <head>
        <RouterHead />
      </head>
      <body>
        <AuthProvider initialUser={authData.value}>
          <main>
            <Slot />
          </main>
        </AuthProvider>
      </body>
    </html>
  );
});

// routes/dashboard/layout.tsx - Protected layout
export const onRequest: RequestHandler = async ({ cookie, redirect }) => {
  const authToken = cookie.get('auth_token')?.value;
  if (!authToken) {
    throw redirect(302, '/login');
  }
};

export default component$(() => {
  return (
    <div class="dashboard-layout">
      <Sidebar />
      <div class="main-content">
        <Slot />
      </div>
    </div>
  );
});
```

### Server-Side Data Loading

```tsx
// ✅ Use routeLoader$ for server-side data fetching
export const useUsersData = routeLoader$(async ({ query }) => {
  try {
    const limit = parseInt(query.get('limit') || '20');
    const offset = parseInt(query.get('offset') || '0');

    const response = await apiClient.users.get({
      query: { limit, offset },
    });

    if (response.error) {
      throw new Error('Failed to fetch users');
    }

    return {
      users: response.data?.users || [],
      pagination: { limit, offset, total: response.data?.total || 0 },
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { users: [], pagination: { limit, offset, total: 0 } };
  }
});

// Usage in component
export default component$(() => {
  const usersData = useUsersData();

  return (
    <div>
      <UserTable users={usersData.value.users} />
      <Pagination pagination={usersData.value.pagination} />
    </div>
  );
});
```

### Form Handling with Actions

```tsx
// ✅ Use routeAction$ for form submissions
export const useCreateUser = routeAction$(async (data, { fail, redirect }) => {
  try {
    // Validate required fields
    if (!data.email || !data.username) {
      return fail(400, { error: 'Missing required fields' });
    }

    // Process form data
    const userData = {
      email: data.email as string,
      username: data.username as string,
      firstName: data.firstName as string,
      lastName: data.lastName as string,
    };

    // Call API
    const response = await apiClient.users.post(userData);

    if (response.error) {
      return fail(400, { error: response.error.message });
    }

    // Redirect on success
    throw redirect(302, '/dashboard/users');
  } catch (error) {
    return fail(500, { error: 'Internal server error' });
  }
});

// Form component
export default component$(() => {
  const createUserAction = useCreateUser();

  return (
    <Form action={createUserAction}>
      <UserForm isLoading={createUserAction.isRunning} error={createUserAction.value?.error} />
    </Form>
  );
});
```

## API Integration

### Type-Safe API Client

```tsx
// lib/api-client.ts
import { treaty } from '@elysiajs/eden';
import type { App } from '@your-app/api';

export const apiClient = treaty<App>(import.meta.env.VITE_API_URL || 'http://localhost:3000');

// Usage in loaders
export const useRolesData = routeLoader$(async () => {
  try {
    const [rolesResponse, permissionsResponse] = await Promise.all([
      apiClient.api.roles.get(),
      apiClient.api.permissions.get(),
    ]);

    return {
      roles: rolesResponse.data?.roles || [],
      permissions: permissionsResponse.data?.permissions || [],
    };
  } catch (error) {
    console.error('Error fetching roles data:', error);
    return { roles: [], permissions: [] };
  }
});
```

## Styling & UI

### Component Styling Patterns

```tsx
// ✅ Use utility-first approach with DaisyUI
export const Button = component$<{
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: any;
}>(({ variant = 'primary', size = 'md', disabled, children }) => {
  const classes = ['btn', `btn-${variant}`, `btn-${size}`, disabled && 'btn-disabled']
    .filter(Boolean)
    .join(' ');

  return (
    <button class={classes} disabled={disabled}>
      {children}
    </button>
  );
});
```

### Responsive Design

```tsx
// ✅ Mobile-first responsive patterns
export const UserGrid = component$<{ users: User[] }>(({ users }) => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
});
```

## Error Handling

### Component Error Boundaries

```tsx
// ✅ Handle errors gracefully
export const UserList = component$(() => {
  const usersData = useUsersData();

  // Handle loading state
  if (usersData.value.users.length === 0) {
    return (
      <div class="text-center py-8">
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div class="space-y-4">
      {usersData.value.users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
});
```

## Performance Best Practices

### Leverage Qwik's Resumability

```tsx
// ✅ Let Qwik handle lazy loading naturally
export const Dashboard = component$(() => {
  return (
    <div class="dashboard">
      <QuickStats /> {/* Only loads when visible */}
      <RecentActivity /> {/* Only loads when needed */}
      <UserManagement /> {/* Only loads when interacted with */}
    </div>
  );
});
```

### Avoid Unnecessary Re-renders

```tsx
// ✅ Use signals efficiently
export const FilterableList = component$<{ items: Item[] }>(({ items }) => {
  const filter = useSignal('');

  // Computed value - only recalculates when filter changes
  const filteredItems = useComputed$(() =>
    items.filter((item) => item.name.toLowerCase().includes(filter.value.toLowerCase())),
  );

  return (
    <div>
      <input bind:value={filter} placeholder="Filter items..." />
      <ItemList items={filteredItems.value} />
    </div>
  );
});
```

## Testing Considerations

### Component Testing Structure

```tsx
// ✅ Structure components for testability
export const UserForm = component$<UserFormProps>(
  ({
    initialData,
    onSubmit = $(() => {}), // Default no-op for testing
  }) => {
    const formData = useSignal(initialData || {});

    const handleSubmit = $(async () => {
      await onSubmit(formData.value);
    });

    return (
      <form onSubmit$={handleSubmit} data-testid="user-form">
        {/* Form fields */}
      </form>
    );
  },
);
```

Remember: Qwik's power comes from its resumability and server-first approach. Always prefer server-side rendering and data loading over client-side patterns.
