import React from "react";
import Link from "next/link";

import Logo from "@/components/header/logo";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container my-8 flex h-screen flex-col items-center justify-center">
      <div className="mb-4">
        <Link
          href="/"
          aria-label="Home page"
          className="flex flex-row items-center justify-center gap-2"
        >
          <Logo />
          <span className="text-2xl font-semibold text-slate-50">AI Image Enhancer</span>
        </Link>
      </div>

      {children}
    </main>
  );
}
