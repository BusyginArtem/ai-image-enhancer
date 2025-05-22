"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

function PageAnimateFadeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence initial={false} mode="wait" >
      <motion.div
        key={pathname}
        exit={{ opacity: 0 }}
        // initial={{ opacity: 1 }}
        initial={false}
        transition={{ duration: 0.3 }}
        // animate={{ opacity: 1 }}
        // layout
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageAnimateFadeWrapper;
