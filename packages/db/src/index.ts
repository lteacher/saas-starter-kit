import { createClient, $ } from 'gel';
import type { Result } from '@saas-starter/utils';
import { success, error } from '@saas-starter/utils';

// Create and configure the database client
export const createDbClient = () => {
  return createClient({
    dsn: process.env.DATABASE_URL,
  });
};

// Default client instance
export const db = createDbClient();

// Export introspected types
export const types = await $.introspect.types(db);

// Database connection health check
export const checkConnection = async (): Promise<Result<boolean>> => {
  try {
    await db.querySingle('SELECT 1');
    return success(true);
  } catch (err) {
    return error(err as Error);
  }
};

// Transaction wrapper utility
export const withTransaction = async <T>(
  operation: (tx: typeof db) => Promise<T>
): Promise<Result<T>> => {
  try {
    const result = await db.transaction(operation);
    return success(result);
  } catch (err) {
    return error(err as Error);
  }
};


// Export the generated EdgeQL query builder
export * from '../dbschema/edgeql-js';
export { default as e } from '../dbschema/edgeql-js';

export default db;