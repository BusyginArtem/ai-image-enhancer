"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mt-4 flex w-full flex-col items-center justify-center">
      <div className="max-w-lg space-y-8 rounded-lg border p-6 text-center">
        <h5 className="text-[2rem] leading-[1.12] font-bold">
          Something went wrong
        </h5>

        <div className="text-center">
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </div>
    </section>
  );
}
