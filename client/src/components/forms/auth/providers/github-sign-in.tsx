"use client";

import { useActionState } from "react";

import { signInGitHub } from "@/actions/auth";
import Github from "@/components/forms/auth/icons/github";
import { Button } from "@/components/ui/button";

const GithubSignIn = () => {
  const [, formAction, isPending] = useActionState(signInGitHub, undefined);

  return (
    <form action={formAction}>
      <Button className="w-full" variant="outline" disabled={isPending}>
        <Github />
        Continue with GitHub
      </Button>
    </form>
  );
};

export default GithubSignIn;
