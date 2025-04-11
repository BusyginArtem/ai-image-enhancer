"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Github } from "@/components/ui/github";
import { signInGitHub } from "@/actions/auth";

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
