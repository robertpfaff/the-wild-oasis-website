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
      } catch {
        return false;
      }
    },
    async session({ session, user }) {
      // Add guest info to session
      const guest = await getGuest(session.user.email);
      
      if (guest) {
        session.user.guestId = guest.id;
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;