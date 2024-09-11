import { z } from "zod";
import { Hono } from "hono";
import { and, eq, inArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle";
import { clerkOptions } from "@/utils/clerkOpions";
import { categories, insertCategorySchema } from "@/db/schema";

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
      }

      // Query the database to get categories for the authenticated user
      const data = await db
        .select({
          id: categories.id, // Select the category ID
          name: categories.name // Select the category name
        })
        .from(categories) // From the categories table
        .where(eq(categories.userId, auth.userId)); // Where the user ID matches the authenticated user ID

      // Return the queried categories as a JSON response
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

      // Query the database to get the category with the specified ID for the authenticated user
      const [data] = await db
        .select({
          id: categories.id, // Select the category ID
          name: categories.name // Select the category name
        })
        .from(categories) // From the categories table
        .where(and(eq(categories.userId, auth.userId), eq(categories.id, id))); // Where the user ID matches the authenticated user ID and the category ID matches the specified ID

      // If no category is found, return a 404 Not Found response
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      // Return the queried category as a JSON response
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
    zValidator("json", insertCategorySchema.pick({ name: true })),
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

      // Insert a new category into the database
      const [data] = await db
        .insert(categories) // Insert into the categories table
        .values({
          id: createId(), // Generate a new ID for the category
          userId: auth.userId, // Set the user ID to the authenticated user ID
          ...values // Set the category name from the request body
        })
        .returning(); // Return the inserted data

      // Return the inserted category as a JSON response
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
        ids: z.array(z.string()) // Validate that the request body contains an array of strings (category IDs)
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

      // Delete categories from the database where the user ID matches the authenticated user ID
      // and the category ID is in the list of IDs provided in the request body
      const data = await db
        .delete(categories) // Delete from the categories table
        .where(
          and(
            eq(categories.userId, auth.userId), // Ensure the user ID matches the authenticated user ID
            inArray(categories.id, values.ids) // Ensure the category ID is in the list of IDs provided
          )
        )
        .returning({
          id: categories.id // Return the ID of the deleted categories
        });

      // Return the deleted category IDs as a JSON response
      return c.json({ data });
    }
  )
  // Define the PATCH method for updating a category by its ID
  .patch(
    // Path for the PATCH request
    "/:id",
    // Middleware for authentication using Clerk
    clerkMiddleware(clerkOptions),
    // Middleware for validating the request parameter 'id' using Zod
    zValidator("param", z.object({ id: z.string().optional() })),
    // Middleware for validating the request body using Zod, picking only the 'name' field from the insertCategoriesSchema
    zValidator("json", insertCategorySchema.pick({ name: true })),
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

      // Update the category in the database where the user ID matches the authenticated user ID
      // and the category ID matches the provided 'id', then return the updated category data
      const [data] = await db
        .update(categories) // Update the categories table
        .set(values) // Set the new values for the category
        .where(
          and(
            eq(categories.userId, auth.userId), // Ensure the user ID matches the authenticated user ID
            eq(categories.id, id) // Ensure the category ID matches the provided 'id'
          )
        )
        .returning(); // Return the updated category data

      // If no category was found and updated, return a 404 Not Found response
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      // Return the updated category data as a JSON response
      return c.json({ data });
    }
  )
  // Define the DELETE method for deleting a category by its ID
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

      // Delete the category in the database where the user ID matches the authenticated user ID
      // and the category ID matches the provided 'id', then return the deleted category data
      const [data] = await db
        .delete(categories) // Delete from the categories table
        .where(
          and(
            eq(categories.userId, auth.userId), // Ensure the user ID matches the authenticated user ID
            eq(categories.id, id) // Ensure the category ID matches the provided 'id'
          )
        )
        .returning({ id: categories.id }); // Return the deleted category id

      // If no category was found and deleted, return a 404 Not Found response
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      // Return the deleted category data as a JSON response
      return c.json({ data });
    }
  );

// Export the Hono app as the default export
export default app;
