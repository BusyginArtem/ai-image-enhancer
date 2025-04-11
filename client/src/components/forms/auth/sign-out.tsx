"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/button";

const SignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };

  return (
    <div className='flex justify-center'>
      <Button variant='destructive' onClick={handleSignOut} className='w-[5.5rem]'>
        Sign Out
      </Button>
    </div>
  );
};

export { SignOut };
