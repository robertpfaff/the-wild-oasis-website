/* import { NextResponse } from "next/server";

export function middleware(request) {
  console.log(request);

  return NextResponse.redirect(new URL("/about", request.url));
}
*/
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    // Not signed in, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
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
