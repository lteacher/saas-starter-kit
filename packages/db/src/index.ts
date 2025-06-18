import { createClient } from 'gel';

// Create and configure the database client
export const createDbClient = () => {
  return createClient({
    dsn: process.env.DATABASE_URL,
  });
};

// Default client instance
export const db = createDbClient();

// Database connection health check
export const checkConnection = async (): Promise<boolean> => {
  await db.querySingle('SELECT 1');
  return true;
};


// Export the generated EdgeQL query builder
export { default as e } from '../dbschema/edgeql-js';

// Export generated TypeScript interfaces
export * from '../dbschema/interfaces';

export default db;