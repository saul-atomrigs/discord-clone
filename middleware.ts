import { createRouteMatcher, clerkMiddleware } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/api/uploadthing']);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
