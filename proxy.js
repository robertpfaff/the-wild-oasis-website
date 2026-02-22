import { auth } from "@/app/_lib/auth";
import { NextResponse } from "next/server";

export async function proxy(request) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
