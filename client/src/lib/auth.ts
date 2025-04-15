import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { FirestoreAdapter } from "@auth/firebase-adapter";
import authConfig from "./auth.config";
import { adminDb, adminFirestoreAuth } from "./firebase.admin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: FirestoreAdapter(adminDb),
  debug: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/auth-error",
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("user >>>>>>>>>>>>>>>>>>>>>", user);
      console.log("account >>>>>>>>>>>>>>>>>>>>>", account);
      console.log("profile >>>>>>>>>>>>>>>>>>>>>", profile);
      console.log("email >>>>>>>>>>>>>>>>>>>>>", email);
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

        const firebaseToken = await adminFirestoreAuth.createCustomToken(
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

        //

        const userSnapshot = await adminDb
          .collection("users")
          .where("email", "==", credentials.email)
          .get();

        if (userSnapshot.empty) {
          return null;
        }

        const user = userSnapshot.docs[0].data();

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
