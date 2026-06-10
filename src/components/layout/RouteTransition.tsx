"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Global route transition wrapper.
 * Uses motion.div for enter animations. Exit animations via AnimatePresence 
 * are disabled as they cause 'Failed to execute removeChild' DOM conflicts 
 * in React 19 / Next 15 App Router during concurrent rendering.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();

  if (reduce) {
    return <main id="main" aria-label="Main content" className="min-h-[60vh]">{children}</main>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <main id="main" aria-label="Main content" className="min-h-[60vh]">
        {children}
      </main>
    </motion.div>
  );
}
