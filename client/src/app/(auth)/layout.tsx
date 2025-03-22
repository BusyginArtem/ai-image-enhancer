import React from "react";
import Link from "next/link";

// import Logo from "@/components/logo";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='container my-8 flex flex-col justify-center items-center h-screen'>
      <div className='mb-4'>
        <Link href='/' aria-label='Home page' className='flex flex-row justify-center items-center gap-2'>
          {/* <Logo /> */}
          <span className='text-2xl font-semibold text-slate-50'>NFT</span>
        </Link>
      </div>

      {children}
    </main>
  );
}
