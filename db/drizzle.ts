// Import the neon function from the @neondatabase/serverless package
import { neon } from "@neondatabase/serverless";

// Import the drizzle function from the drizzle-orm/neon-http package
import { drizzle } from "drizzle-orm/neon-http";

// Initialize the SQL connection using the DATABASE_URL environment variable
export const sql = neon(process.env.DATABASE_URL!);

// Create a drizzle ORM instance using the initialized SQL connection
export const db = drizzle(sql);
