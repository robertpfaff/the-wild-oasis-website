import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-services";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Add your sign-in logic here
      try {
        const existingGuest = await getGuest(user.email);

        if (existingGuest) return true;

        await createGuest({
          email: user.email,
          fullName: user.name,
        });

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },
    async session({ session }) {
      // Don't fetch guest data during session - it creates circular dependencies
      // The account pages will fetch guest data separately if needed
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;