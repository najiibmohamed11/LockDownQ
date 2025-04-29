import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/teacher(.*)'])
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/'])

export default clerkMiddleware(async (auth, req) => {
  // If user is signed in and tries to access auth pages, redirect them
  if (isPublicRoute(req)) {
    const { userId } = await auth()
    if (userId) {
      // Redirect to dashboard/teacher page if already authenticated
      return Response.redirect(new URL('/teacher', req.url))
    }
  }

  // Protect teacher routes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}