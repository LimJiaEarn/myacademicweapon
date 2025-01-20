import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
 

const isPublicRoute = createRouteMatcher(["/api/webhooks/clerk", '/', '/contribute', '/sign-in', '/study-resources','/study-resources/(.*)', '/profile/(.*)', '/privacypolicy'])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})
 
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}