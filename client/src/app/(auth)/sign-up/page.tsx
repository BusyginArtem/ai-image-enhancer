import Link from "next/link";

import AuthProviders from "@/components/forms/auth/providers";
import SignUpForm from "@/components/forms/auth/sign-up-form";
import { Button } from "@/components/ui/button";
import { APP_PATH } from "@/lib/constants";

export default async function SignUpPage() {
  return (
    <div className="border-border mx-auto w-full max-w-sm space-y-6 rounded-sm border-2 p-8 shadow-md">
      <h1 className="mb-6 text-center text-2xl font-bold">Create Account</h1>

      <AuthProviders />

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

      <SignUpForm />

      <div className="text-center">
        <Button variant="link" asChild>
          <Link href={APP_PATH.SIGN_IN}>Already have an account? Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
