import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  
  // Only protect /account routes
  if (pathname.startsWith("/account")) {
    // Check for NextAuth session token (handles both http and https)
    const sessionToken = 
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value;
    
    if (!sessionToken) {
      // Redirect to login if no session
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
