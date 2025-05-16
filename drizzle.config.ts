import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URI) {
  console.log('som thing went wron');
}

export default defineConfig({
  schema: './app/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URI || '',
  },
});

//"postgresql://postgres:12345678@localhost:5432/postgres"
