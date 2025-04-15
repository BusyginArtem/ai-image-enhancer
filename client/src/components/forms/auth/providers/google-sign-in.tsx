"use client";

import { useActionState } from "react";

import { signInGoogle } from "@/actions/auth";
import Google from "@/components/forms/auth/icons/google";
import { Button } from "@/components/ui/button";

const GoogleSignIn = () => {
  const [, formAction, isPending] = useActionState(signInGoogle, undefined);

  return (
    <form action={formAction}>
      <Button className="w-full" variant="outline" disabled={isPending}>
        <Google />
        Continue with Google
      </Button>
    </form>
  );
};

export default GoogleSignIn;
