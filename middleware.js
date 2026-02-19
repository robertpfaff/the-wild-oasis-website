import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "__Secure-authjs.session-token",
  });
  console.log("MIDDLEWARE TOKEN:", token); // Add this line
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    // Add more protected routes here if needed
  ],
};