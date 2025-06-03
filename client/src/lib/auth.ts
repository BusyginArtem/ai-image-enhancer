import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import authAdapter from "@/services/auth-adapter";
import DbAccountsAdapter from "@/services/db/accounts-db-adapter";
import FirebaseAccountsService from "@/services/db/firebase-admin/accounts-db";
import FirebaseSubscriptionsService from "@/services/db/firebase-admin/subscriptions-db";
import FirebaseUsersService from "@/services/db/firebase-admin/users-db";
import DbSubscriptionsAdapter from "@/services/db/subscriptions-db-adapter";
import DbUsersAdapter from "@/services/db/users-db-adapter";
import { adminAuth } from "@/services/firebase/admin";
import authConfig from "./auth.config";
import { AccountIdentifier, SubscriptionIdentifier } from "./definitions";

const usersDB = new DbUsersAdapter(FirebaseUsersService);
const accountsDB = new DbAccountsAdapter(FirebaseAccountsService);
const subscriptionsDB = new DbSubscriptionsAdapter(
  FirebaseSubscriptionsService,
);

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
  events: {
    async linkAccount({ user, account, profile }) {
      console.log("user >>>>>>>>>>>>>>>>>>>>>", user);
      console.log("account >>>>>>>>>>>>>>>>>>>>>", account);
      console.log("profile >>>>>>>>>>>>>>>>>>>>>", profile);

      if (account.provider === "github") {
        if (account.id) {
          try {
            const freeSubscriptionId = (await subscriptionsDB.findByName({
              name: "FREE",
            })) as SubscriptionIdentifier;

            if (!freeSubscriptionId) {
              console.log(
                "Free subscription not found. Cannot update account.",
              );
              return;
            }

            await accountsDB.update({
              id: account.id as AccountIdentifier,
              data: {
                subscriptionId: freeSubscriptionId,
              },
            });
            console.log(
              `Account ${account.id} for provider ${account.provider} (user: ${user.id}) updated with extra field(s).`,
            );
          } catch (error) {
            console.log(
              `Error updating account ${account.id} with extra field(s):`,
              error,
            );
          }
        } else {
          console.log(
            "account.id was not available in linkAccount event for GitHub. Cannot directly update document by ID.",
            { userId: user.id, providerAccountId: account.providerAccountId },
          );
        }
      }
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

        return usersDB.getByEmail({ email: credentials.email as string });
      },
    }),
  ],
});
