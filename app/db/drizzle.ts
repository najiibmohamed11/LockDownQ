import { drizzle } from 'drizzle-orm/postgres-js';
if (!process.env.DATABASE_URI) {
  console.log('no env file');
}
export const db = drizzle(process.env.DATABASE_URI || '');
