"use client";

import { Auth, signInWithCustomToken } from "firebase/auth";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

import useFirebaseClientAuth from "@/hooks/useFirebaseClientAuth";

async function syncFirebaseAuth(session: Session, auth: Auth) {
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

  const auth = useFirebaseClientAuth();

  useEffect(() => {
    if (!session) {
      return;
    }

    syncFirebaseAuth(session, auth);
  }, [session, auth]);

  return <>{children}</>;
}
