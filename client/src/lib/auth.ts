import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { verifyPasswords } from "@/lib/auth-password";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import authConfig from "./auth.config";
import { firestore } from "./firebase.admin";

export const {
  handlers,
  signIn,
  signOut,
  auth,
  unstable_update: update,
} = NextAuth({
  adapter: FirestoreAdapter(firestore),
  debug: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/auth-error",
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, account, trigger, session }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }

      if (trigger === "update" && session?.user) {
        token.address = session.user.address;
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }

      // if (token) {
      //   session.user.address = token.address || null;
      // }

      return session;
    },
  },
  providers: [
    ...authConfig.providers,
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        // const conn: MongoClient | undefined = await connectMongoDb();
        // const db = conn.db();

        // const user: UserEntity | null = await db.collection<UserEntity>("users").findOne({
        //   email: credentials.email!,
        // });

        // if (!user) {
        //   return null;
        // }

        // const isMatch = await verifyPasswords(credentials.password as string, user.password);

        // if (!isMatch) {
        //   return null;
        // }

        // return {
        //   id: user._id.toString(),
        //   email: user.email,
        //   address: null,
        // };

        return null;
      },
    }),
  ],
});
