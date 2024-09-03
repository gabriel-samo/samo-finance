import { Hono } from "hono";
import { eq } from "drizzle-orm";
// import { HTTPException } from "hono/http-exception";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle";
import { accounts } from "@/db/schema";
import { clerkOptions } from "@/utils/clerkOpions";

const app = new Hono().get("/", clerkMiddleware(clerkOptions), async (c) => {
  // try {
  const auth = getAuth(c);

  if (!auth?.userId) {
    // NEW version of Hono
    return c.json({ error: "Unauthorized" }, 401);
    // OLD version of Hono
    // throw new HTTPException(401, {
    //   res: c.json({ error: "Unauthorized" }, 401)
    // });
  }

  const data = await db
    .select({
      id: accounts.id,
      name: accounts.name
    })
    .from(accounts)
    .where(eq(accounts.userId, auth.userId));
  return c.json({ data });
  // } catch (error: any) {
  //   console.error("Error fetching accounts:", error);
  //   return c.json(
  //     {
  //       message: error.message,
  //       stack: error.stack,
  //       cause: error.cause,
  //       name: error.name
  //     },
  //     500
  //   );
  // }
});

export default app;
