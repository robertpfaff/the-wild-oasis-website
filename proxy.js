import { auth } from "@/app/_lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAccount = req.nextUrl.pathname.startsWith("/account");

  if (isOnAccount && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/account/:path*"],
};
