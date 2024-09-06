// Import the 'config' function from the 'dotenv' package to load environment variables from a .env file
import { config } from "dotenv";

// Import the 'defineConfig' function from the 'drizzle-kit' package to define the configuration for the database
import { defineConfig } from "drizzle-kit";

// Load environment variables from the .env.local file
config({ path: ".env.local" });

// Export the database configuration using 'defineConfig' from 'drizzle-kit'
export default defineConfig({
  // Path to the database schema file
  schema: "./db/schema.ts",

  // Specify the database dialect (in this case, PostgreSQL)
  dialect: "postgresql",

  // Database credentials, with the URL being loaded from an environment variable
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },

  // Enable verbose logging for debugging purposes
  verbose: true,

  // Enable strict mode for additional safety checks
  strict: true
});
