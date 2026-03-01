import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("Please define DATABASE_URL in environment variables");
}

const sql = neon(databaseUrl);
export const neonDb = drizzle(sql);

export default neonDb;
