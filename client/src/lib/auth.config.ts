import type { NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import env from "@/env";

export const accountFields = {
  credits: 20,
  usedCredits: 0,
  subscription: "free",
};

export default {
  providers: [
    GithubProvider({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
      account(account) {
        return {
          ...account,
          ...accountFields,
        };
      },
    }),
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      account(account) {
        return {
          ...account,
          ...accountFields,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
