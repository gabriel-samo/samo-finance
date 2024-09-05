import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import accountsRouter from "./accounts";
// import { HTTPException } from "hono/http-exception";

export const runtime = "edge";

const app = new Hono().basePath("/api");

// Old version of Hono
// app.onError((err, c) => {
//   if (err instanceof HTTPException) {
//     return err.getResponse();
//   }
//   return c.json({ error: "Internal Error" }, 500);
// });

// app.use("*", async (c, next) => {
//   const corsMiddleware = cors({
//     origin: ["https://finance.gabrielsamo.com"],
//     allowHeaders: ["Origin", "Content-Type", "Authorization"],
//     allowMethods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"]
//   });
//   await corsMiddleware(c, next);
// });

const routes = app.route("/accounts", accountsRouter);

export const GET = handle(
  app.onError((err, c) => {
    console.error(err);
    return c.json(
      {
        message: err.message,
        stack: err.stack,
        cause: err.cause,
        name: err.name
      },
      500
    );
  })
);
export const POST = handle(
  app.onError((err, c) => {
    console.error(err);
    return c.json(
      {
        message: err.message,
        stack: err.stack,
        cause: err.cause,
        name: err.name
      },
      500
    );
  })
);

export type AppType = typeof routes;
