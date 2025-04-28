import { drizzle } from "drizzle-orm/postgres-js";
if (!process.env.DATABASE_URI) {
  console.log("no env file");
}
export const db = drizzle(
  "postgresql://postgres:12345678@localhost:5432/postgres"
);
