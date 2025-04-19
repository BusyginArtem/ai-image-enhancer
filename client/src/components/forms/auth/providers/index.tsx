"use client";

import useAuthError from "@/hooks/useAuthError";
import GithubSignIn from "./github-sign-in";
import GoogleSignIn from "./google-sign-in";

import { Skeleton } from "@/components/ui/skeleton";

export function AuthProvidersSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

export default function AuthProvidersUI() {
  useAuthError();

  return (
    <>
      <GithubSignIn />

      <GoogleSignIn />
    </>
  );
}
