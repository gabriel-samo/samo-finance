import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
// import { HTTPException } from "hono/http-exception";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle";
import { accounts, insertAccountsSchema } from "@/db/schema";
import { clerkOptions } from "@/utils/clerkOpions";

const app = new Hono()
  // method
  .get(
    // path
    "/",
    // middlewares
    clerkMiddleware(clerkOptions),
    // handler. c is the context (request, response, etc...)
    async (c) => {
      // get the auth object
      const auth = getAuth(c);

      // if the user is not authenticated, return a 401
      if (!auth?.userId) {
        // NEW version of Hono
        return c.json({ error: "Unauthorized" }, 401);
        // OLD version of Hono
        // throw new HTTPException(401, {
        //   res: c.json({ error: "Unauthorized" }, 401)
        // });
      }

      // get the accounts from the database
      const data = await db
        // select the id and name
        .select({
          id: accounts.id,
          name: accounts.name
        })
        // from the accounts table
        .from(accounts)
        // where the user id is equal to the auth user id
        .where(eq(accounts.userId, auth.userId));
      // return the accounts
      return c.json({ data });
    }
  )
  // method
  .post(
    // path
    "/",
    // middlewares
    clerkMiddleware(clerkOptions),
    zValidator("json", insertAccountsSchema.pick({ name: true })),
    // handler. c is the context (request, response, etc...)
    async (c) => {
      // get the auth object
      const auth = getAuth(c);
      // get the values from the request
      const values = c.req.valid("json");

      // if the user is not authenticated, return a 401
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // destructuring the data to get the inserted data
      const [data] = await db
        // insert the account into the database
        .insert(accounts)
        // insert the id, user id and values
        .values({
          // generate a new id
          id: createId(),
          // set the user id to the auth user id
          userId: auth.userId,
          // set the name to the name from the request
          ...values
        })
        // return the inserted data
        .returning();

      return c.json({ data });
    }
  );

export default app;
