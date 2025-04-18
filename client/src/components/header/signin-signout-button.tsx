import Link from "next/link";

import { auth } from "@/lib/auth";
import { APP_PATH } from "@/lib/constants";
import { Button } from "../ui/button";
import { SignOut } from "./sign-out";

export default async function SignInOutButton() {
  const session = await auth();

  return session ? (
    <SignOut />
  ) : (
    <Button className="w-[5.5rem] rounded-lg" asChild>
      <Link href={APP_PATH.SIGN_IN}>Sign In</Link>
    </Button>
  );
}
