import {NextResponse, NextRequest} from "next/server";
import {auth} from "@/auth";

export async function middleware(req: NextRequest) {
  const session = await auth();

  // If there is no token and the user is not accessing the sign-in page, redirect to /signin
  if (!session) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // If the token has expired, redirect to /signin
  if (session && Date.parse(session.expires) < Date.now()) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Allow the request to continue if the user is authenticated or accessing the sign-in page
  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the following:
   * 1. /api routes (API routes should be handled separately if needed)
   * 2. /auth (to avoid redirect loop)
   * 3. /_next, /static, /img (Next.js assets)
   */
  matcher: ["/((?!api|_next|auth|signup|static|img).*)"],
};
