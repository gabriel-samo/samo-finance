import { Hono } from "hono";
import { handle } from "hono/vercel";
import accountsRouter from "./accounts";
// import { HTTPException } from "hono/http-exception";

// Specify the runtime environment for the application
export const runtime = "edge";

// Initialize a new Hono app with a base path of "/api"
const app = new Hono().basePath("/api");

// Old version of Hono error handling (commented out for reference)
// app.onError((err, c) => {
//   if (err instanceof HTTPException) {
//     return err.getResponse();
//   }
//   return c.json({ error: "Internal Error" }, 500);
// });

// Define routes for the accounts API
const routes = app.route("/accounts", accountsRouter);

// Handle GET requests with error handling
export const GET = handle(
  app.onError((err, c) => {
    console.error(err); // Log the error to the console
    return c.json(
      {
        message: err.message, // Return the error message
        stack: err.stack, // Return the error stack trace
        cause: err.cause, // Return the error cause
        name: err.name // Return the error name
      },
      500 // Return a 500 Internal Server Error status
    );
  })
);

// Handle POST requests with error handling
export const POST = handle(
  app.onError((err, c) => {
    console.error(err); // Log the error to the console
    return c.json(
      {
        message: err.message, // Return the error message
        stack: err.stack, // Return the error stack trace
        cause: err.cause, // Return the error cause
        name: err.name // Return the error name
      },
      500 // Return a 500 Internal Server Error status
    );
  })
);

// Handle PATCH requests with error handling
export const PATCH = handle(
  app.onError((err, c) => {
    console.error(err); // Log the error to the console
    return c.json(
      {
        message: err.message, // Return the error message
        stack: err.stack, // Return the error stack trace
        cause: err.cause, // Return the error cause
        name: err.name // Return the error name
      },
      500 // Return a 500 Internal Server Error status
    );
  })
);

// Handle DELETE requests with error handling
export const DELETE = handle(
  app.onError((err, c) => {
    console.error(err); // Log the error to the console
    return c.json(
      {
        message: err.message, // Return the error message
        stack: err.stack, // Return the error stack trace
        cause: err.cause, // Return the error cause
        name: err.name // Return the error name
      },
      500 // Return a 500 Internal Server Error status
    );
  })
);

// Define the type for the routes
export type AppType = typeof routes;
