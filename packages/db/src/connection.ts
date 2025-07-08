import { MongoClient, Db } from 'mongodb';

const connectionString = process.env.DATABASE_URL || 'mongodb://admin:password@localhost:27017';
const client = new MongoClient(connectionString);

// Connect at module level using top-level await
await client.connect();
export const db = client.db(process.env.DB_NAME || 'saas-starter-kit');

// Closes the database connection
export const closeDatabase = async (): Promise<void> => {
  await client.close();
};

// Database connection health check
export const checkConnection = async (): Promise<boolean> => {
  try {
    await db.admin().ping();
    return true;
  } catch {
    return false;
  }
};