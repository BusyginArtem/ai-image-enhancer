"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useId } from "react";
import { toast } from "react-toastify";

enum AuthError {
  OAuthAccountNotLinked = "OAuthAccountNotLinked",
}

const errorMap = {
  [AuthError.OAuthAccountNotLinked]:
    "To confirm your identity, sign in with the same account you used originally.",
};

export default function useAuthError() {
  const searchParams = useSearchParams();

  const error = searchParams.get("error");

  const toastId = useId();

  useEffect(() => {
    if (error && error in errorMap) {
      toast.error(errorMap[error as AuthError], {
        toastId,
      });
    }
  }, [error]);
}
