import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    // Not signed in, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Signed in, continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    // Add more protected routes here if needed
  ],
};
