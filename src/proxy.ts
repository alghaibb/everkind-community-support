import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add pathname to headers for layouts to access
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // Check for staff routes that need password change check
  if (pathname.startsWith("/staff") && !pathname.includes("/change-password")) {
    const sessionCookie = getSessionCookie(request);

    if (sessionCookie) {
      // Check if user needs to change password via API
      try {
        const response = await fetch(
          `${request.nextUrl.origin}/api/auth/check-password-change`,
          {
            headers: {
              cookie: request.headers.get("cookie") || "",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.mustChangePassword) {
            return NextResponse.redirect(
              new URL("/staff/change-password", request.url)
            );
          }
        }
      } catch (error) {
        // Continue if check fails - layout will handle it
        console.error("Password change check failed:", error);
      }
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (they handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*$).*)",
  ],
};
