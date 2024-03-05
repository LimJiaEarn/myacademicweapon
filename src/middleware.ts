import { authMiddleware, redirectToSignIn  } from "@clerk/nextjs";
import { NextResponse } from 'next/server';
 
export default authMiddleware({

  // Routes that can be accessed while signed out
  publicRoutes: ['/', '/about-us', '/study-resources', '/study-resources/jc', '/study-resources/secondary', '/study-resources/primary'],

  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ['/study-resources', '/about-us']
});
 
export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};