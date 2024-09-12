// Importing the 'z' object from the 'zod' library, which is used for schema validation and parsing.
// This will help us define and validate the shape of our data.
import { z } from "zod";
// Importing the 'relations' function from the 'drizzle-orm' library, which is used to define relationships
// between different tables in our database schema.
import { relations } from "drizzle-orm";
// Importing the 'createInsertSchema' function from the 'drizzle-zod' library, which is used to create
// schemas for inserting data into our tables. This ensures that the data being inserted adheres to the
// defined structure and constraints of the table.
import { createInsertSchema } from "drizzle-zod";
// Importing various column types and table creation function from the 'drizzle-orm/pg-core' package.
// - 'integer' is used to define integer columns.
// - 'pgTable' is used to define a new table schema.
// - 'text' is used to define text columns.
// - 'timestamp' is used to define timestamp columns.
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Define the "accounts" table schema using pgTable function
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(), // Define "id" column as primary key of type text
  pladeId: text("plade_id"), // Define "plade_id" column of type text to connect to real account. NOT WORK WITH EDGE RUNTIME
  name: text("name").notNull(), // Define "name" column of type text and set it as not null
  userId: text("user_id").notNull() // Define "user_id" column of type text and set it as not null
});

// Define the relationships for the "accounts" table
export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions) // An account can have many transactions
}));

// Create a schema for inserting data into the "accounts" table using createInsertSchema function
export const insertAccountSchema = createInsertSchema(accounts);

// Define the "categories" table schema using pgTable function
export const categories = pgTable("categories", {
  id: text("id").primaryKey(), // Define "id" column as primary key of type text
  pladeId: text("plade_id"), // Define "plade_id" column of type text to connect to real account. NOT WORK WITH EDGE RUNTIME
  name: text("name").notNull(), // Define "name" column of type text and set it as not null
  userId: text("user_id").notNull() // Define "user_id" column of type text and set it as not null
});

// Define the relationships for the "categories" table
export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions) // A category can have many transactions
}));

// Create a schema for inserting data into the "categories" table using createInsertSchema function
export const insertCategorySchema = createInsertSchema(categories);

// Define the "transactions" table schema using pgTable function
export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(), // Define "id" column as primary key of type text
  amount: integer("amount").notNull(), // Define "amount" column of type integer and set it as not null
  payee: text("payee").notNull(), // Define "payee" column of type text and set it as not null
  notes: text("notes"), // Define "notes" column of type text, can be null
  date: timestamp("date", { mode: "date" }).notNull(), // Define "date" column of type timestamp and set it as not null
  accountId: text("account_id")
    .references(() => accounts.id, {
      onDelete: "cascade" // If the referenced account is deleted, delete the transaction as well
    })
    .notNull(), // Define "account_id" column of type text, set it as not null, and reference the "id" column in the "accounts" table
  categoryId: text("categoy_id").references(() => categories.id, {
    onDelete: "set null" // If the referenced category is deleted, set the categoryId to null
  }) // Define "category_id" column of type text and reference the "id" column in the "categories" table
});

// Define the relationships for the "transactions" table
export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId], // The "accountId" field in the "transactions" table references the "id" field in the "accounts" table
    references: [accounts.id]
  }),
  category: one(categories, {
    fields: [transactions.categoryId], // The "categoryId" field in the "transactions" table references the "id" field in the "categories" table
    references: [categories.id]
  })
}));

// Create a schema for inserting data into the "transactions" table using createInsertSchema function
// Coerce the "date" field to a JavaScript Date object
export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date()
});
