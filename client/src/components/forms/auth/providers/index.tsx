"use client";

import useAuthError from "@/hooks/useAuthError";
import GithubSignIn from "./github-sign-in";
import GoogleSignIn from "./google-sign-in";

export default function AuthProviders() {
  useAuthError();

  return (
    <>
      <GithubSignIn />

      <GoogleSignIn />
    </>
  );
}
