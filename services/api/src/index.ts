import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { authHandler } from './handlers/auth';
import { userHandler } from './handlers/users';
import { roleHandler } from './handlers/roles';
import { permissionHandler } from './handlers/permissions';
import { errorHandler } from './plugins/error-handler';
import { requestLoggerPlugin } from './plugins/request-logger';

// Create the main Elysia application
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
          title: 'SaaS Starter Kit API',
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
    message: 'SaaS Starter Kit API',
    version: '1.0.0',
    status: 'healthy',
  }))
  .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
  .use(authHandler)
  .use(userHandler)
  .use(roleHandler)
  .use(permissionHandler);

export type App = typeof app;

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 SaaS Starter Kit API running on port', process.env.PORT || 3000);
});
