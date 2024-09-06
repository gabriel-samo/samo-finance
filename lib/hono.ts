// Import the hono client for making API requests
import { hc } from "hono/client";

// Import the type definition for the application routes
import type { AppType } from "@/app/api/[[...route]]/route";

// Create an instance of the hono client with the API URL from environment variables
export const client = hc<AppType>(process.env.NEXT_PUBLIC_API_URL!);
