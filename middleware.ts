import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Create a route matcher to identify protected routes
const isProtectedRoute = createRouteMatcher(["/"]);

// Define the middleware using Clerk's middleware function
export default clerkMiddleware((auth, req) => {
  // If the request matches a protected route, enforce authentication
  if (isProtectedRoute(req)) auth().protect();

  // Continue to the next middleware or route handler
  return NextResponse.next();
});

// Configuration for the middleware
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
