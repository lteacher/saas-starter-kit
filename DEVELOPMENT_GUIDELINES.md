# Development Guidelines

This document outlines the coding standards and best practices for this SaaS starter kit.

## Core Principles

### Functional Programming

- **Prefer functional programming paradigms** over object-oriented approaches
- Write **pure, concise, and composable functions**
- Avoid side effects where possible
- Use immutable data structures

### Code Structure

- **Write short, flattened code** over deep nesting
- **Return early** rather than using deeply nested conditional blocks
- Keep functions small and focused on a single responsibility
- Prefer composition over inheritance

### Modern JavaScript/TypeScript

- **Use modern language features**: destructuring, spread operator, nullish coalescing (`??`), optional chaining (`?.`)
- Prefer `const` and `let` over `var`
- Use template literals for string interpolation
- Leverage async/await over Promise chains

## Function Design

### Parameters

- **Use object parameters** instead of positional arguments when you have more than 3 parameters
- Always destructure object parameters for clarity
- Provide default values where appropriate

```typescript
// ❌ Avoid: Too many positional parameters
function createUser(
  name: string,
  email: string,
  role: string,
  isActive: boolean,
  department: string,
) {
  // ...
}

// ✅ Prefer: Object parameters with destructuring
function createUser({ name, email, role, isActive = true, department }: CreateUserParams) {
  // ...
}
```

### Return Values

- Return early to avoid deep nesting
- Use explicit return types for clarity
- Prefer Result/Option types for error handling

```typescript
// ❌ Avoid: Deep nesting
function validateUser(user: User): boolean {
  if (user) {
    if (user.email) {
      if (user.email.includes('@')) {
        return true;
      }
    }
  }
  return false;
}

// ✅ Prefer: Early returns
function validateUser(user: User): boolean {
  if (!user) return false;
  if (!user.email) return false;
  if (!user.email.includes('@')) return false;

  return true;
}
```

## Documentation Standards

### Function and Class Comments

- **Always document function, class, and method signatures** with clear comments
- Focus on explaining **what the function does** and **why it exists**
- Use single-line comments for simple explanations, multi-line for complex ones
- Keep comments concise but informative

```typescript
// Creates a new user account with role-based access control
async function createUser({ name, email, role }: CreateUserParams): Promise<Result<User, Error>> {
  // Implementation
}

// Service class for managing user authentication and account operations
class UserService {
  // Authenticates user credentials and returns session tokens
  async authenticate({ email, password }: LoginCredentials): Promise<AuthResult> {
    // Implementation
  }

  /**
   * Updates user profile information with validation.
   * Only allows updates to fields the user has permission to modify.
   */
  async updateProfile(userId: string, updates: ProfileUpdates): Promise<Result<User, Error>> {
    // Implementation
  }
}
```

### Inline Comments

- **Write inline comments** when logic appears complex or non-obvious
- Comments should explain **why**, not **what**
- Place comments immediately before the relevant code block

```typescript
// Check if user has exceeded login attempts to prevent brute force attacks
if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
  return lockUserAccount(user.id);
}

// Use Argon2 for password hashing due to better resistance against GPU attacks
const hashedPassword = await argon2.hash(password, { saltLength: 32 });
```

### Comment Quality Rules

- **Comments must be relevant** to the current codebase
- **Never reference conversations, reviews, or past implementations** in comments
- Avoid comments that become outdated quickly
- Don't state the obvious

```typescript
// ❌ Avoid: References external context
// Updated based on previous review to switch from bcrypt to argon2

// ❌ Avoid: States the obvious
// Increment counter by 1
counter++;

// ✅ Good: Explains business logic
// Use Argon2 for password hashing due to better resistance against GPU attacks
const hashedPassword = await argon2.hash(password);
```

## Error Handling

### Prefer Exception Throwing

- **Throw exceptions for error conditions** rather than returning Result types
- **Use try/catch blocks at appropriate boundaries** throughout the codebase
- **Provide meaningful error messages** in thrown exceptions
- **Have consistent error handling patterns** at all levels

```typescript
// Custom error classes for specific error types
class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User with id ${id} not found`);
    this.name = 'UserNotFoundError';
  }
}

class ValidationError extends Error {
  constructor(field: string, message: string) {
    super(`Validation failed for ${field}: ${message}`);
    this.name = 'ValidationError';
  }
}

// Database layer - throws exceptions
async function findUser(id: string): Promise<User> {
  const user = await db.user.findUnique({ where: { id } });

  if (!user) {
    throw new UserNotFoundError(id);
  }

  return user;
}

// Service layer - catches and re-throws as needed
async function getUserProfile(id: string): Promise<UserProfile> {
  try {
    const user = await findUser(id);
    return formatUserProfile(user);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      throw new Error(`Profile not available: ${error.message}`);
    }
    throw error; // Re-throw unknown errors
  }
}

// API route - catches and returns appropriate HTTP responses
app.get('/api/users/:id', async (ctx) => {
  try {
    const profile = await getUserProfile(ctx.params.id);
    return ctx.json(profile);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return ctx.json({ error: error.message }, 404);
    }
    console.error('Unexpected error:', error);
    return ctx.json({ error: 'Internal server error' }, 500);
  }
});
```

### Error Boundary Guidelines

- **Catch errors at natural boundaries**: API routes, service functions, components, utilities
- **Use specific error types** for different error conditions across all layers
- **Re-throw when appropriate** to let higher layers handle specific cases
- **Log errors appropriately** based on context (server logs, client debugging)

```typescript
// ❌ Avoid: Swallowing errors or generic handling
try {
  await someOperation();
} catch {
  // Silent failure - bad
}

// ✅ Good: Specific error handling with meaningful messages
try {
  await createUser(userData);
} catch (error) {
  if (error instanceof ValidationError) {
    throw new Error(`Invalid user data: ${error.message}`);
  } else if (error instanceof DatabaseError) {
    console.error('Database error:', error);
    throw new Error('Unable to save user data');
  } else {
    throw error; // Re-throw unknown errors
  }
}
```

## TypeScript Guidelines

### Type Definitions

- Use interfaces for object shapes
- Use type aliases for unions and complex types
- Prefer strict typing over `any`
- Use generic types for reusable components

### Import/Export Patterns

- Use named exports over default exports
- Group imports by source (external, internal, relative)
- Use path mapping for clean imports

```typescript
// External dependencies
import { Elysia } from 'elysia';
import { Type } from '@sinclair/typebox';

// Internal packages
import type { User } from '@packages/types';
import { validateEmail } from '@packages/utils';

// Relative imports
import { userService } from './user.service';
```

## File Organization

### Naming Conventions

- Use kebab-case for file names: `user-service.ts`
- Use PascalCase for components and classes: `UserCard.tsx`
- Use camelCase for functions and variables: `getCurrentUser`
- Use UPPER_SNAKE_CASE for constants: `MAX_LOGIN_ATTEMPTS`

### File Structure

- Keep files focused and under 200 lines when possible
- Use index files for clean re-exports
- Group related functionality in directories

## Testing Guidelines

### Test Structure

- Write tests that describe behavior, not implementation
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Test edge cases and error conditions

```typescript
describe('createUser', () => {
  it('should create user with valid data', async () => {
    // Arrange
    const userData = { name: 'John Doe', email: 'john@example.com', role: 'user' };

    // Act
    const result = await createUser(userData);

    // Assert
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe(userData.email);
    }
  });
});
```

---

These guidelines ensure consistent, maintainable, and readable code throughout the project.
