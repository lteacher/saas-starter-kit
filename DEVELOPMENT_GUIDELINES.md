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
function createUser(name: string, email: string, role: string, isActive: boolean, department: string) {
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

### Prefer Result Types
- Use Result/Either types instead of throwing exceptions
- Handle errors explicitly at function boundaries
- Provide meaningful error messages

```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Finds a user by their unique identifier with proper error handling
async function findUser(id: string): Promise<Result<User, UserNotFoundError>> {
  const user = await db.user.findUnique({ where: { id } });
  
  if (!user) {
    return { success: false, error: new UserNotFoundError(id) };
  }
  
  return { success: true, data: user };
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