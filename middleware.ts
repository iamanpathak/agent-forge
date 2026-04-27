import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Declare which routes are public (no login required)
const isPublicRoute = createRouteMatcher([
  '/', 
  '/terms', 
  '/privacy', 
  '/api(.*)' // Allows API routes to handle their own auth logic
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    // CORRECTED SYNTAX FOR CLERK V7
    auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};