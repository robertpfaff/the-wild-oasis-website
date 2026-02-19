import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-services";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
  authorized({ auth, request }) {
    return !!auth?.user;
  },
  async signIn({ user, account, profile }) {
    // ...existing code...
  },
  async session({ session, user }) {
    // ...existing code...
  },
  redirect({ url, baseUrl }) {
    // If url is a relative path, allow NextAuth to handle callbackUrl logic
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    // If url is a full URL and matches your baseUrl, allow it
    if (url.startsWith(baseUrl)) return url;
    // Otherwise, fallback to baseUrl (homepage)
    return baseUrl;
  },
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);