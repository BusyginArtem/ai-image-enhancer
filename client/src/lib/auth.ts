import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import authAdapter from "@/services/auth-adapter";
import DbAdapter from "@/services/db/adapter";
import FirebaseAdminService from "@/services/db/firebase-admin";
import { adminAuth } from "@/services/firebase/admin";
import authConfig from "./auth.config";

const db = new DbAdapter(FirebaseAdminService);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: authAdapter,
  debug: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/auth-error",
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ account }) {
      // console.log("user >>>>>>>>>>>>>>>>>>>>>", user);
      // console.log("account >>>>>>>>>>>>>>>>>>>>>", account);
      // console.log("profile >>>>>>>>>>>>>>>>>>>>>", profile);
      // console.log("email >>>>>>>>>>>>>>>>>>>>>", email);
      // console.log("credentials >>>>>>>>>>>>>>>>>>>>>", credentials);
      if (account?.provider === "credentials") {
        return true;
      }

      if (account?.provider === "github") {
        // TODO add logic
        return true;
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.uid = user.id;
      }

      if (account?.provider === "credentials") {
        token.credentials = true;
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        const firebaseToken = await adminAuth.createCustomToken(
          token.sub as string,
        );
        session.firebaseToken = firebaseToken;

        if (token.provider === "credentials") {
        } else if (token.provider === "github") {
        }
      }

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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        return db.getUserByEmail({ email: credentials.email as string });
      },
    }),
  ],
});
