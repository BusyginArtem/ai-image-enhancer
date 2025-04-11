import type { NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";

import env from "@/env";

export default {
  providers: [
    GithubProvider({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
