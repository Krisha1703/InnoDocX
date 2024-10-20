import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cert } from "firebase-admin/app";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  /*adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  }),*/
});

export { handler as GET, handler as POST };