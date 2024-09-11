// Import necessary functions and types from drizzle-zod and drizzle-orm/pg-core packages
import { createInsertSchema } from "drizzle-zod";
import { pgTable, text } from "drizzle-orm/pg-core";

// Define the "accounts" table schema using pgTable function
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(), // Define "id" column as primary key of type text
  pladeId: text("plade_id"), // Define "plade_id" column of type text to connect to real account. NOT WORK WITH EDGE RUNTIME
  name: text("name").notNull(), // Define "name" column of type text and set it as not null
  userId: text("user_id").notNull() // Define "user_id" column of type text and set it as not null
});

// Create a schema for inserting data into the "accounts" table using createInsertSchema function
export const insertAccountSchema = createInsertSchema(accounts);

// Define the "categories" table schema using pgTable function
export const categories = pgTable("categories", {
  id: text("id").primaryKey(), // Define "id" column as primary key of type text
  pladeId: text("plade_id"), // Define "plade_id" column of type text to connect to real account. NOT WORK WITH EDGE RUNTIME
  name: text("name").notNull(), // Define "name" column of type text and set it as not null
  userId: text("user_id").notNull() // Define "user_id" column of type text and set it as not null
});

// Create a schema for inserting data into the "categories" table using createInsertSchema function
export const insertCategorySchema = createInsertSchema(categories);
