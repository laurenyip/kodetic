"use client";

import { hoverTransition } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 320);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={hoverTransition}
          onClick={scrollToTop}
          data-interactive="true"
          aria-label="Back to top"
          className="tap-target fixed bottom-5 right-5 z-30 border border-white/20 bg-black px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-white/80 transition-colors duration-hover ease-editorial hover:border-red hover:text-red md:bottom-6 md:right-6 md:text-[12px]"
        >
          Top
        </motion.button>
      )}
    </AnimatePresence>
  );
}
