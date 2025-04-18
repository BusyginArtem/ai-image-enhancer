"use client";

import { signInWithCustomToken } from "firebase/auth";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

import { auth } from "@/lib/firebase";

async function syncFirebaseAuth(session: Session) {
  if (session?.firebaseToken) {
    try {
      await signInWithCustomToken(auth, session.firebaseToken);
    } catch (error) {
      console.error("Error syncing Firebase auth:", error);
    }
  }
}

export default function FirebaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      return;
    }

    syncFirebaseAuth(session);
  }, [session]);

  return <>{children}</>;
}
