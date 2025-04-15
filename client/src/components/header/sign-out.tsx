"use client";

import { signOutAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const SignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutAction();

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

