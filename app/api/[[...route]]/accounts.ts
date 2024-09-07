import { z } from "zod";
import { Hono } from "hono";
import { and, eq, inArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
// import { HTTPException } from "hono/http-exception";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle";
import { accounts, insertAccountsSchema } from "@/db/schema";
import { clerkOptions } from "@/utils/clerkOpions";

// Initialize a new Hono app
const app = new Hono()
  // Define GET method for the root path
  .get(
    // Path for the GET request
    "/",
    // Middleware for authentication using Clerk
    clerkMiddleware(clerkOptions),
    // Handler function for the GET request
    async (c) => {
      // Get the authentication object from the context
      const auth = getAuth(c);

      // If the user is not authenticated, return a 401 Unauthorized response
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
        // OLD version of Hono commented for future reference
        // throw new HTTPException(401, {
        //   res: c.json({ error: "Unauthorized" }, 401)
        // });
      }

      // Query the database to get accounts for the authenticated user
      const data = await db
        .select({
          id: accounts.id, // Select the account ID
          name: accounts.name // Select the account name
        })
        .from(accounts) // From the accounts table
        .where(eq(accounts.userId, auth.userId)); // Where the user ID matches the authenticated user ID

      // Return the queried accounts as a JSON response
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
    zValidator("json", insertAccountsSchema.pick({ name: true })),
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

      // Insert a new account into the database
      const [data] = await db
        .insert(accounts) // Insert into the accounts table
        .values({
          id: createId(), // Generate a new ID for the account
          userId: auth.userId, // Set the user ID to the authenticated user ID
          ...values // Set the account name from the request body
        })
        .returning(); // Return the inserted data

      // Return the inserted account as a JSON response
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
        ids: z.array(z.string()) // Validate that the request body contains an array of strings (account IDs)
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

      // Delete accounts from the database where the user ID matches the authenticated user ID
      // and the account ID is in the list of IDs provided in the request body
      const data = await db
        .delete(accounts) // Delete from the accounts table
        .where(
          and(
            eq(accounts.userId, auth.userId), // Ensure the user ID matches the authenticated user ID
            inArray(accounts.id, values.ids) // Ensure the account ID is in the list of IDs provided
          )
        )
        .returning({
          id: accounts.id // Return the ID of the deleted accounts
        });

      // Return the deleted account IDs as a JSON response
      return c.json({ data });
    }
  );

// Export the Hono app as the default export
export default app;
