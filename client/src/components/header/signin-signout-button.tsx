"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

import { APP_PATH } from "@/lib/constants";
import { Button } from "../ui/button";
import { SignOut } from "./sign-out";

export default function SignInOutButton() {
  const { data: session } = useSession();

  return session ? (
    <SignOut />
  ) : (
    <Button className='rounded-lg w-[5.5rem]' asChild>
      <Link href={APP_PATH.SIGN_IN}>Sign In</Link>
    </Button>
  );
}
