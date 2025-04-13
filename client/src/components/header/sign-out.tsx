"use client";

import { signOut as signOutFirebase } from "firebase/auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { Button } from "../ui/button";

const SignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    await signOutFirebase(auth);
    router.refresh();
  };

  return (
    <div className="flex justify-center">
      <Button
        variant="destructive"
        onClick={handleSignOut}
        className="w-[5.5rem]"
      >
        Sign Out
      </Button>
    </div>
  );
};

export { SignOut };

