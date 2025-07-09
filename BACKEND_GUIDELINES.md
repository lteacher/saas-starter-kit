# Backend Guidelines - Elysia Best Practices

## Project Structure

### Directory Organization

```
src/
├── handlers/            # Route handlers organized by resource
│   ├── auth.ts         # Authentication routes
│   ├── users.ts        # User management routes
│   ├── roles.ts        # Role management routes
│   └── permissions.ts  # Permission management routes
├── lib/                # Business logic and data access
│   ├── user.ts         # User-related database operations
│   ├── role.ts         # Role-related database operations
│   ├── permission.ts   # Permission-related database operations
│   └── errors.ts       # Custom error classes
├── plugins/            # Reusable Elysia plugins
│   ├── auth.ts         # Authentication middleware
│   ├── error-handler.ts # Global error handling
│   └── request-logger.ts # Request logging
├── services/           # External service integrations
│   ├── email.ts        # Email service
│   └── storage.ts      # File storage service
├── utils/              # Utility functions
│   ├── password.ts     # Password hashing utilities
│   └── validation.ts   # Custom validation helpers
└── index.ts            # Main application entry point
```

## Application Architecture

### Main Application Setup

```typescript
// src/index.ts
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';

import { authHandler } from './handlers/auth';
import { userHandler } from './handlers/users';
import { roleHandler } from './handlers/roles';
import { permissionHandler } from './handlers/permissions';
import { errorHandler } from './plugins/error-handler';
import { requestLoggerPlugin } from './plugins/request-logger';

export const app = new Elysia({ prefix: '/api' })
  .use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    }),
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Your App API',
          version: '1.0.0',
          description: 'Authentication and user management API with RBAC',
        },
        tags: [
          { name: 'Auth', description: 'Authentication endpoints' },
          { name: 'Users', description: 'User management endpoints' },
          { name: 'Roles', description: 'Role management endpoints' },
          { name: 'Permissions', description: 'Permission management endpoints' },
        ],
      },
    }),
  )
  .use(requestLoggerPlugin)
  .use(errorHandler)
  .get('/', () => ({
    message: 'Your App API',
    version: '1.0.0',
    status: 'healthy',
  }))
  .get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }))
  .use(authHandler)
  .use(userHandler)
  .use(roleHandler)
  .use(permissionHandler);

export type App = typeof app;

app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 API running on port', process.env.PORT || 3000);
});
```

## Handler Patterns

### Resource-Based Handlers

```typescript
// src/handlers/users.ts
import { Elysia } from 'elysia';
import { db } from '@your-app/db';
import { updateUserSchema, getUsersSchema } from '@your-app/schemas';
import { findUserById, updateUser, listUsers } from '../lib/user';
import { NotFoundError } from '../lib/errors';

export const userHandler = new Elysia({ prefix: '/users' })
  .get(
    '/',
    async ({ query }) => {
      const users = await listUsers(query.limit, query.offset).run(db);
      return { users };
    },
    {
      query: getUsersSchema,
      detail: { tags: ['Users'] },
    },
  )
  .get(
    '/:id',
    async ({ params }) => {
      const user = await findUserById(params.id).run(db);

      if (!user) throw new NotFoundError('User');

      return { user };
    },
    {
      detail: { tags: ['Users'] },
    },
  )
  .patch(
    '/:id',
    async ({ params, body }) => {
      // Verify user exists before updating
      const existingUser = await findUserById(params.id).run(db);

      if (!existingUser) throw new NotFoundError('User');

      const updatedUser = await updateUser(params.id, body).run(db);
      return { user: updatedUser };
    },
    {
      body: updateUserSchema,
      detail: { tags: ['Users'] },
    },
  );
```

### Authentication Handler

```typescript
// src/handlers/auth.ts
import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { db } from '@your-app/db';
import { registerSchema, loginSchema } from '@your-app/schemas';
import { createUser, findUserByEmail } from '../lib/user';
import { hashPassword, verifyPassword } from '../utils/password';
import { ConflictError, UnauthorizedError } from '../lib/errors';

export const authHandler = new Elysia({ prefix: '/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!,
    }),
  )
  .post(
    '/register',
    async ({ body, jwt }) => {
      // Check if user already exists
      const existingUser = await findUserByEmail(body.email).run(db);

      if (existingUser) {
        throw new ConflictError('User already exists', 'Email already registered');
      }

      // Hash password and create user
      const passwordHash = await hashPassword(body.password);
      const newUser = await createUser({
        ...body,
        passwordHash,
      }).run(db);

      // Generate JWT token
      const token = await jwt.sign({ userId: newUser.id });

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
        },
        token,
      };
    },
    {
      body: registerSchema,
      detail: { tags: ['Auth'] },
    },
  )
  .post(
    '/login',
    async ({ body, jwt }) => {
      // Find user by email
      const user = await findUserByEmail(body.email).run(db);

      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await verifyPassword(body.password, user.passwordHash);

      if (!isValidPassword) {
        throw new UnauthorizedError('Invalid credentials');
      }

      // Generate JWT token
      const token = await jwt.sign({ userId: user.id });

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        token,
      };
    },
    {
      body: loginSchema,
      detail: { tags: ['Auth'] },
    },
  );
```

## Data Access Layer

### Database Operations

```typescript
// src/lib/user.ts
import { e } from '@your-app/db';

// Get all users with pagination
export const listUsers = (limit?: number, offset?: number) =>
  e.select(e.User, (user) => ({
    id: true,
    email: true,
    username: true,
    firstName: true,
    lastName: true,
    isActive: true,
    isVerified: true,
    createdAt: true,
    roles: {
      name: true,
      permissions: {
        name: true,
        resource: true,
        action: true,
      },
    },
    order_by: user.createdAt,
    limit,
    offset,
  }));

// Find user by ID with full relations
export const findUserById = (id: string) =>
  e.select(e.User, (user) => ({
    id: true,
    email: true,
    username: true,
    firstName: true,
    lastName: true,
    isActive: true,
    isVerified: true,
    createdAt: true,
    roles: {
      id: true,
      name: true,
      permissions: {
        id: true,
        name: true,
        resource: true,
        action: true,
      },
    },
    filter_single: { id },
  }));

// Create new user
export const createUser = (userData: {
  email: string;
  username: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
}) => e.insert(e.User, userData);

// Update user information
export const updateUser = (
  userId: string,
  updates: {
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
  },
) =>
  e.update(e.User, (user) => ({
    filter_single: { id: userId },
    set: updates,
  }));
```

### Complex Operations with Proper Type Casting

```typescript
// src/lib/role.ts
import { e } from '@your-app/db';

// Assign permissions to a role (with proper UUID casting)
export const assignPermissionsToRole = (roleId: string, permissionIds: string[]) =>
  e.update(e.Role, (role) => ({
    filter_single: { id: roleId },
    set: {
      permissions: {
        '+=': e.select(e.Permission, (perm) => ({
          filter: e.op(perm.id, 'in', e.cast(e.uuid, e.set(...permissionIds))),
        })),
      },
    },
  }));

// Remove permissions from a role
export const removePermissionsFromRole = (roleId: string, permissionIds: string[]) =>
  e.update(e.Role, (role) => ({
    filter_single: { id: roleId },
    set: {
      permissions: {
        '-=': e.select(e.Permission, (perm) => ({
          filter: e.op(perm.id, 'in', e.cast(e.uuid, e.set(...permissionIds))),
        })),
      },
    },
  }));
```

## Plugin System

### Error Handling Plugin

```typescript
// src/plugins/error-handler.ts
import { Elysia } from 'elysia';
import { NotFoundError, ValidationError, UnauthorizedError, ConflictError } from '../lib/errors';

export const errorHandler = new Elysia()
  .error({
    NOT_FOUND: NotFoundError,
    VALIDATION_ERROR: ValidationError,
    UNAUTHORIZED: UnauthorizedError,
    CONFLICT: ConflictError,
  })
  .onError(({ code, error, set }) => {
    console.error(`Error [${code}]:`, error.message);

    switch (code) {
      case 'NOT_FOUND':
        set.status = 404;
        return { error: error.message, code: 'NOT_FOUND' };

      case 'VALIDATION_ERROR':
        set.status = 400;
        return { error: error.message, code: 'VALIDATION_ERROR' };

      case 'UNAUTHORIZED':
        set.status = 401;
        return { error: error.message, code: 'UNAUTHORIZED' };

      case 'CONFLICT':
        set.status = 409;
        return { error: error.message, code: 'CONFLICT' };

      case 'PARSE':
        set.status = 400;
        return { error: 'Invalid JSON payload', code: 'PARSE_ERROR' };

      case 'VALIDATION':
        set.status = 400;
        return {
          error: 'Validation failed',
          details: error.message,
          code: 'VALIDATION_ERROR',
        };

      default:
        console.error('Unhandled error:', error);
        set.status = 500;
        return { error: 'Internal server error', code: 'INTERNAL_ERROR' };
    }
  });
```

### Request Logger Plugin

```typescript
// src/plugins/request-logger.ts
import { Elysia } from 'elysia';

export const requestLoggerPlugin = new Elysia()
  .onRequest(({ request, set }) => {
    const start = Date.now();
    // Store start time for duration calculation
    set.headers['x-request-start'] = start.toString();

    console.log(`${request.method} ${request.url}`);
  })
  .onResponse(({ request, set }) => {
    const start = parseInt(set.headers['x-request-start'] as string);
    const duration = Date.now() - start;

    console.log(`${request.method} ${request.url} - ${set.status} (${duration}ms)`);
  });
```

### Authentication Middleware Plugin

```typescript
// src/plugins/auth.ts
import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { UnauthorizedError } from '../lib/errors';
import { findUserById } from '../lib/user';
import { db } from '@your-app/db';

export const authPlugin = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!,
    }),
  )
  .derive({ as: 'scoped' }, async ({ headers, jwt }) => {
    const authorization = headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authorization.slice(7); // Remove 'Bearer ' prefix

    try {
      const payload = await jwt.verify(token);

      if (!payload || !payload.userId) {
        throw new UnauthorizedError('Invalid token');
      }

      // Fetch current user data
      const user = await findUserById(payload.userId).run(db);

      if (!user || !user.isActive) {
        throw new UnauthorizedError('User not found or inactive');
      }

      return { currentUser: user };
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  });
```

## Error Handling

### Custom Error Classes

```typescript
// src/lib/errors.ts
export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  public details?: string;

  constructor(message: string, details?: string) {
    super(message);
    this.name = 'ConflictError';
    this.details = details;
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

## Schema Validation

### Input Validation Patterns

```typescript
// Using schemas consistently across handlers
export const userHandler = new Elysia({ prefix: '/users' }).post(
  '/',
  async ({ body }) => {
    // Schema validation happens automatically
    const newUser = await createUser(body).run(db);
    return { user: newUser };
  },
  {
    body: createUserSchema, // TypeBox schema with validation
    detail: { tags: ['Users'] },
    response: {
      201: t.Object({
        user: UserSchema,
      }),
    },
  },
);
```

## Security Best Practices

### Environment Configuration

```typescript
// Validate required environment variables on startup
const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL', 'FRONTEND_URL'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}
```

### Password Security

```typescript
// src/utils/password.ts
import { Bun } from 'bun';

export async function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password, {
    algorithm: 'bcrypt',
    cost: 12, // Higher cost for better security
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return Bun.password.verify(password, hash);
}
```

## Testing Considerations

### Handler Testing Structure

```typescript
// Structure handlers for easy testing
export const createUserHandler = async (userData: CreateUserData) => {
  // Validate input
  if (!userData.email || !userData.username) {
    throw new ValidationError('Missing required fields');
  }

  // Check for existing user
  const existingUser = await findUserByEmail(userData.email).run(db);
  if (existingUser) {
    throw new ConflictError('User already exists');
  }

  // Create user
  return createUser(userData).run(db);
};

// Use in handler
export const userHandler = new Elysia({ prefix: '/users' }).post(
  '/',
  async ({ body }) => {
    const user = await createUserHandler(body);
    return { user };
  },
  {
    body: createUserSchema,
    detail: { tags: ['Users'] },
  },
);
```

## Performance Optimization

### Database Query Optimization

```typescript
// ✅ Use efficient queries with proper projections
export const listUsersForTable = () =>
  e.select(e.User, (user) => ({
    id: true,
    email: true,
    username: true,
    firstName: true,
    lastName: true,
    isActive: true,
    createdAt: true,
    // Only fetch role names, not full role objects
    roles: { name: true },
    order_by: user.createdAt,
  }));

// ❌ Avoid over-fetching data
export const listUsersInefficient = () =>
  e.select(e.User, (user) => ({
    '*': true, // Fetches everything
    roles: {
      '*': true, // Fetches all role data
      permissions: { '*': true }, // Fetches all permission data
    },
  }));
```

### Response Caching

```typescript
// Add caching headers for static data
export const permissionHandler = new Elysia({ prefix: '/permissions' }).get(
  '/',
  async ({ set }) => {
    const permissions = await listPermissions().run(db);

    // Cache for 5 minutes since permissions change rarely
    set.headers['Cache-Control'] = 'public, max-age=300';

    return { permissions };
  },
  {
    detail: { tags: ['Permissions'] },
  },
);
```

Remember: Elysia's strength lies in its simplicity and type safety. Keep handlers focused, use the plugin system for reusable functionality, and always validate inputs with schemas.
