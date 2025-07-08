# SaaS Starter Kit

A modern full-stack template with authentication, RBAC, and admin UI.

## Tech Stack

- **Frontend**: Qwik + Qwik City + TailwindCSS v4 + DaisyUI
- **Backend**: Elysia + Bun
- **Database**: MongoDB
- **Types**: Shared TypeScript types across frontend/backend

## Architecture

```
apps/ui/          # Qwik frontend with server-side auth
services/api/     # Elysia backend with RBAC
packages/db/      # MongoDB connection and migrations
packages/types/   # Shared TypeScript types
packages/schemas/ # Shared validation schemas
```

## Quick Start

```bash
bun install

# Setup database
cd packages/db
docker-compose up -d
bun run db:migrate

# Start development
bun dev  # Frontend: :5173, Backend: :3000
```

## Environment

```bash
# apps/ui/.env.local
VITE_API_URL=http://localhost:3000

# services/api/.env
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

## What's Included

- **Authentication**: Register/login with JWT
- **RBAC**: Users, roles, permissions with UI management
- **Protected Routes**: Server-side route protection
- **Admin UI**: User and role management interface
- **Type Safety**: End-to-end TypeScript with Eden Treaty client

## Key Features

- Server-side auth with Qwik layouts
- Composable UI components following Qwik best practices
- Real API integration (no mock data)
- Responsive dashboard with collapsible sidebar
- Form handling with validation and error states

## Scripts

```bash
bun dev           # Start all services
bun build         # Build all packages
bun lint          # Lint all code
bun format        # Format with Prettier
```

## Database Schema

Default entities: User, Role, Permission, UserSession, AuditLog with proper constraints and relationships.

---

Built with Qwik's resumability, Elysia's performance, and MongoDB's flexibility.