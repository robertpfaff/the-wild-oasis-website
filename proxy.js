import { NextResponse } from "next/server";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  
  // Only protect /account routes
  if (pathname.startsWith("/account")) {
    const sessionCookie = request.cookies.get("authjs.session-token") || request.cookies.get("__Secure-authjs.session-token");
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
