// "use client";

// import { useSession } from "next-auth/react";
import Link from "next/link";

import { APP_PATH } from "@/lib/constants";
import { Button } from "../ui/button";
import { SignOut } from "./sign-out";
import { auth } from "@/lib/auth";

export default async function SignInOutButton() {
  // const { data: session } = useSession();
  const session = await auth();
  console.log(
    "%c SignInOutButton session",
    "color: green; font-weight: bold;",
    session,
  );
  return session ? (
    <SignOut />
  ) : (
    <Button className="w-[5.5rem] rounded-lg" asChild>
      <Link href={APP_PATH.SIGN_IN}>Sign In</Link>
    </Button>
  );
}
