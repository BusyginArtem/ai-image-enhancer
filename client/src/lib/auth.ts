import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { hashPassword, verifyPasswords } from "@/lib/auth-password";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import authConfig from "./auth.config";
import { adminFirestoreAuth, firestoreAdminDB } from "./firebase.admin";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: FirestoreAdapter(firestoreAdminDB),
  debug: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/auth-error",
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") {
        return true;
      }

      if (account?.provider === "github") {
        return true;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.provider === "credentials") {
        } else if (token.provider === "github") {
          const firebaseToken = await adminFirestoreAuth.createCustomToken(
            token.sub as string,
          );
          session.firebaseToken = firebaseToken;
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

        const documentSnapshots = await getDocs(
          query(
            collection(db, "users"),
            where("email", "==", credentials.email),
          ),
        );

        if (documentSnapshots.empty) {
          const newUser = {
            email: credentials.email,
            password: await hashPassword(credentials.password as string),
          };

          const userRef = await addDoc(collection(db, "users"), newUser);

          return {
            id: userRef.id,
            email: credentials.email,
          };
        }

        const user = documentSnapshots.docs[0].data();

        // const isMatch = await verifyPasswords(
        //   credentials.password as string,
        //   user.password,
        // );

        // if (!isMatch) {
        //   return null;
        // }

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
});

/**
 async authorize(credentials, request) {
  // The credentials object contains the fields defined in the credentials config
  if (!credentials?.email || !credentials?.password) {
    return null
  }

  try {
    // Check if user exists in OAuth providers first
    const oauthUser = await getDocs(
      query(collection(db, "users"), 
      where("email", "==", credentials.email))
    )

    if (!oauthUser.empty) {
      // User exists in OAuth - don't allow credentials login
      return null
    }

    // Check credentials_users collection
    const credentialUser = await getDocs(
      query(collection(db, "credentials_users"),
      where("email", "==", credentials.email))
    )

    if (credentialUser.empty) {
      // New credentials user - create account
      const newUser = {
        email: credentials.email,
        password: await hashPassword(credentials.password),
        provider: "credentials"
      }

      const userRef = await addDoc(collection(db, "credentials_users"), newUser)

      return {
        id: userRef.id,
        email: credentials.email,
        provider: "credentials"
      }
    }

    // Existing credentials user - verify password
    const user = credentialUser.docs[0].data()
    
    if (!user?.password) {
      return null
    }

    const isMatch = await verifyPasswords(credentials.password, user.password)

    if (!isMatch) {
      return null
    }

    return {
      id: credentialUser.docs[0].id, 
      email: user.email,
      provider: "credentials"
    }

  } catch (error) {
    return null
  }
}
 */
