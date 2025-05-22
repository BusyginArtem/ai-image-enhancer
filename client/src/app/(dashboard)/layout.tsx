import React from "react";

import Header from "@/components/header";
// import { AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />

      {/* <AnimatePresence initial={false} mode="wait"> */}
        {children}
      {/* </AnimatePresence> */}
    </>
  );
}
