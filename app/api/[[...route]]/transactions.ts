import moment from "moment"; // Importing moment library for date manipulation

import { z } from "zod"; // Importing Zod for schema validation
import { Hono } from "hono"; // Importing Hono for creating the app
import { createId } from "@paralleldrive/cuid2"; // Importing createId for generating unique IDs
import { zValidator } from "@hono/zod-validator"; // Importing zValidator for request validation
import { clerkMiddleware, getAuth } from "@hono/clerk-auth"; // Importing Clerk middleware and getAuth for authentication
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm"; // Importing Drizzle ORM functions for database operations

import { db } from "@/db/drizzle"; // Importing the database instance
import { clerkOptions } from "@/utils/clerkOpions"; // Importing Clerk options for authentication
import {
  transactions,
  insertTransactionSchema,
  categories,
  accounts
} from "@/db/schema"; // Importing database schemas

// Initialize a new Hono app
const app = new Hono()
  // Define GET method for the root path
  .get(
    // Path for the GET request
    "/",
    // Middleware for validating the query parameters using Zod
    zValidator(
      "query",
      z.object({
        from: z.string().optional(), // Optional 'from' date parameter
        to: z.string().optional(), // Optional 'to' date parameter
        accountId: z.string().optional() // Optional 'accountId' parameter
      })
    ),
    // Middleware for authentication using Clerk
    clerkMiddleware(clerkOptions),
    // Handler function for the GET request
    async (c) => {
      // Get the authentication object from the context
      const auth = getAuth(c);

      // Extract validated query parameters from the request
      const { from, to, accountId } = c.req.valid("query");

      // If the user is not authenticated, return a 401 Unauthorized response
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Set default date range (last 30 days)
      const defaultTo = new Date();
      const defaultFrom = moment(defaultTo).subtract(30, "days").toDate();

      // Parse and format the 'from' and 'to' dates if provided, otherwise use defaults
      const startDate = from
        ? moment(moment(from).format("YYYY-MM-DD")).toDate()
        : defaultFrom;
      const endDate = to
        ? moment(moment(to).format("YYYY-MM-DD")).toDate()
        : defaultTo;

      console.log("startDate", startDate); // Log the start date for debugging
      console.log("endDate", endDate); // Log the end date for debugging

      // Query the database to get transactions for the authenticated user
      const data = await db
        .select({
          id: transactions.id, // Select transaction ID
          date: transactions.date, // Select transaction date
          category: categories.name, // Select category name
          categoryId: transactions.categoryId, // Select category ID
          payee: transactions.payee, // Select payee
          amount: transactions.amount, // Select amount
          notes: transactions.notes, // Select notes
          account: accounts.name, // Select account name
          accountId: transactions.accountId // Select account ID
        })
        .from(transactions) // From the transactions table
        .innerJoin(accounts, eq(transactions.accountId, accounts.id)) // Join with accounts table
        .leftJoin(categories, eq(transactions.categoryId, categories.id)) // Left join with categories table
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined, // Filter by accountId if provided
            eq(accounts.userId, auth.userId), // Filter by authenticated user ID
            gte(transactions.date, startDate), // Filter by start date
            lte(transactions.date, endDate) // Filter by end date
          )
        )
        .orderBy(desc(transactions.date)); // Order by transaction date in descending order
      // Return the queried transactions as a JSON response
      return c.json({ data });
    }
  )
  // Define GET method for the path with an ID parameter
  .get(
    // Path for the GET request
    "/:id",
    // Middleware for validating the request parameters using Zod
    zValidator(
      "param",
      z.object({
        id: z.string().optional() // Validate that the ID parameter is an optional string
      })
    ),
    // Middleware for authentication using Clerk
    clerkMiddleware(clerkOptions),
    // Handler function for the GET request
    async (c) => {
      // Get the authentication object from the context
      const auth = getAuth(c);
      // Get the validated ID parameter from the request
      const { id } = c.req.valid("param");

      // If the ID parameter is missing, return a 400 Bad Request response
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      // If the user is not authenticated, return a 401 Unauthorized response
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Query the database to get the transaction with the specified ID for the authenticated user
      const [data] = await db
        .select({
          id: transactions.id, // Select transaction ID
          date: transactions.date, // Select transaction date
          categoryId: transactions.categoryId, // Select category ID
          payee: transactions.payee, // Select payee
          amount: transactions.amount, // Select amount
          notes: transactions.notes, // Select notes
          accountId: transactions.accountId // Select account ID
        })
        .from(transactions) // From the transactions table
        .innerJoin(accounts, eq(transactions.accountId, accounts.id)) // Join with accounts table
        .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId))); // Where the user ID matches the authenticated user ID and the transaction ID matches the specified ID

      // If no transaction is found, return a 404 Not Found response
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      // Return the queried transaction as a JSON response
      return c.json({ data });
    }
  )
  // Define POST method for the root path
  .post(
    // Path for the POST request
    "/",
    // Middleware for authentication using Clerk
    clerkMiddleware(clerkOptions),
    // Middleware for validating the request body using Zod
    zValidator("json", insertTransactionSchema.omit({ id: true })),
    // Handler function for the POST request
    async (c) => {
      // Get the authentication object from the context
      const auth = getAuth(c);
      // Get the validated values from the request body
      const values = c.req.valid("json");

      // If the user is not authenticated, return a 401 Unauthorized response
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Insert a new transaction into the database
      const [data] = await db
        .insert(transactions) // Insert into the transactions table
        .values({
          id: createId(), // Generate a new ID for the transaction
          ...values // Set the transaction details from the request body
        })
        .returning(); // Return the inserted data

      // Return the inserted transaction as a JSON response
      return c.json({ data });
    }
  )
  // Define POST method for bulk delete
  .post(
    // Path for the POST request
    "/bulk-delete",
    // Middleware for authentication using Clerk
    clerkMiddleware(clerkOptions),
    // Middleware for validating the request body using Zod
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()) // Validate that the request body contains an array of strings (transaction IDs)
      })
    ),
    // Handler function for the POST request
    async (c) => {
      // Get the authentication object from the context
      const auth = getAuth(c);
      // Get the validated values from the request body
      const values = c.req.valid("json");

      // If the user is not authenticated, return a 401 Unauthorized response
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Create a common table expression (CTE) for transactions to delete
      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id }) // Select transaction ID
          .from(transactions) // From the transactions table
          .innerJoin(accounts, eq(transactions.accountId, accounts.id)) // Join with accounts table
          .where(
            and(
              inArray(transactions.id, values.ids), // Filter by transaction IDs
              eq(accounts.userId, auth.userId) // Filter by authenticated user ID
            )
          )
      );
      // Delete the transactions from the database
      const data = await db
        .with(transactionsToDelete) // Use the CTE
        .delete(transactions) // Delete from the transactions table
        .where(
          inArray(
            transactions.id,
            sql`(SELECT id FROM ${transactionsToDelete})` // Filter by transaction IDs from the CTE
          )
        )
        .returning({
          id: transactions.id // Return the deleted transaction IDs
        });

      // Return the deleted transaction IDs as a JSON response
      return c.json({ data });
    }
  )
  // Define the PATCH method for updating a transaction by its ID
  .patch(
    // Path for the PATCH request
    "/:id",
    // Middleware for authentication using Clerk
    clerkMiddleware(clerkOptions),
    // Middleware for validating the request parameter 'id' using Zod
    zValidator("param", z.object({ id: z.string().optional() })),
    // Middleware for validating the request body using Zod, picking only the fields from the insertTransactionSchema except 'id'
    zValidator("json", insertTransactionSchema.omit({ id: true })),
    // Handler function for the PATCH request
    async (c) => {
      // Get the authentication object from the context
      const auth = getAuth(c);
      // Get the validated 'id' from the request parameters
      const { id } = c.req.valid("param");
      // Get the validated values from the request body
      const values = c.req.valid("json");

      // If the 'id' is not provided, return a 400 Bad Request response
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      // If the user is not authenticated, return a 401 Unauthorized response
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Create a common table expression (CTE) for transactions to update
      const transactionsToUpdate = db.$with("transactions_to_update").as(
        db
          .select({ id: transactions.id }) // Select transaction ID
          .from(transactions) // From the transactions table
          .innerJoin(accounts, eq(transactions.accountId, accounts.id)) // Join with accounts table
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId))) // Filter by transaction ID and authenticated user ID
      );
      // Update the transaction in the database
      const [data] = await db
        .with(transactionsToUpdate) // Use the CTE
        .update(transactions) // Update the transactions table
        .set(values) // Set the new values
        .where(
          inArray(
            transactions.id,
            sql`(SELECT id FROM ${transactionsToUpdate})` // Filter by transaction IDs from the CTE
          )
        )
        .returning(); // Return the updated data

      // If no transaction was found and updated, return a 404 Not Found response
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      // Return the updated transaction data as a JSON response
      return c.json({ data });
    }
  )
  // Define the DELETE method for deleting a transaction by its ID
  .delete(
    // Path for the DELETE request
    "/:id",
    // Middleware for authentication using Clerk
    clerkMiddleware(clerkOptions),
    // Middleware for validating the request parameter 'id' using Zod
    zValidator("param", z.object({ id: z.string().optional() })),
    // Handler function for the DELETE request
    async (c) => {
      // Get the authentication object from the context
      const auth = getAuth(c);
      // Get the validated 'id' from the request parameters
      const { id } = c.req.valid("param");

      // If the 'id' is not provided, return a 400 Bad Request response
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      // If the user is not authenticated, return a 401 Unauthorized response
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Create a common table expression (CTE) for transactions to delete
      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({ id: transactions.id }) // Select transaction ID
          .from(transactions) // From the transactions table
          .innerJoin(accounts, eq(transactions.accountId, accounts.id)) // Join with accounts table
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId))) // Filter by transaction ID and authenticated user ID
      );

      // Delete the transaction in the database
      const [data] = await db
        .with(transactionsToDelete) // Use the CTE
        .delete(transactions) // Delete from the transactions table
        .where(
          inArray(
            transactions.id,
            sql`(SELECT id FROM ${transactionsToDelete})` // Filter by transaction IDs from the CTE
          )
        )
        .returning({ id: transactions.id }); // Return the deleted transaction ID

      // If no transaction was found and deleted, return a 404 Not Found response
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      // Return the deleted transaction data as a JSON response
      return c.json({ data });
    }
  );

// Export the Hono app as the default export
export default app;
