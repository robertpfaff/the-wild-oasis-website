import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-services";

const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn(context) {
      const { user, account, profile } = context;
      try {
        console.log("signIn callback user:", user);
        const existingGuest = await getGuest(user.email);
        if (!existingGuest) {
          console.log("Creating new guest for:", user.email);
          await createGuest({ email: user.email, fullName: user.name });
        }
        return true;
      } catch (err) {
        console.error("signIn callback error:", err);
        return false;
      }
    },
    async session(context) {
      const { session, user } = context;
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;
      return session;
    },
  }
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);