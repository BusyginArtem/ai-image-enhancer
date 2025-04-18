import Link from "next/link";
import { Suspense } from "react";

import AuthProviders from "@/components/forms/auth/providers";
import SignInForm from "@/components/forms/auth/sign-in-form";
import { Button } from "@/components/ui/button";
import { APP_PATH } from "@/lib/constants";

export default async function SignInPage() {
  return (
    <div className="border-border mx-auto w-full max-w-sm space-y-6 rounded-sm border-2 p-8">
      <h1 className="mb-6 text-center text-2xl font-bold">Sign In</h1>
      <div className="text-primary text-center text-base leading-5">
        Sign in to get{" "}
        <div className="relative inline-block text-lg leading-6 font-bold">
          <div className="bg-chart-2 absolute bottom-1 h-1 w-full opacity-50"></div>
          10 free
        </div>{" "}
        images
      </div>

      <Suspense>
        <AuthProviders />
      </Suspense>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with email
          </span>
        </div>
      </div>

      <SignInForm />

      <div className="text-center">
        <Button variant="link" asChild>
          <Link href={APP_PATH.SIGN_UP}>
            Don&apos;t have an account? Sign up
          </Link>
        </Button>
      </div>
    </div>
  );
}
