"use client";

import { signOut as signOutFirebase } from "firebase/auth";
import { useRouter } from "next/navigation";

import { signOutAction } from "@/actions/auth";
import useFirebaseClientAuth from "@/hooks/useFirebaseClientAuth";
import { Button } from "../ui/button";

const SignOut = () => {
  const router = useRouter();
  const auth = useFirebaseClientAuth();

  const handleSignOut = async () => {
    await signOutAction();
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

