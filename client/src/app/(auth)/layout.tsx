import Link from "next/link";
import React from "react";

import Logo from "@/components/header/logo";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container flex h-screen flex-col items-center pt-16">
      <div className="mb-4">
        <Link
          href="/"
          aria-label="Home page"
          className="flex flex-row items-center justify-center gap-2"
        >
          <Logo />
          <span className="text-2xl font-semibold">AI Image Enhancer</span>
        </Link>
      </div>

      {children}
    </main>
  );
}
