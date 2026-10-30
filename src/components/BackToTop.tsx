"use client";

import { hoverTransition } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 320);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Step aside once the footer arrives so the button never covers its headline.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && !footerInView && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={hoverTransition}
          onClick={scrollToTop}
          data-interactive="true"
          aria-label="Back to top"
          className="top-button tap-target group fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-[calc(1.25rem+env(safe-area-inset-right,0px))] z-30 gap-2 px-3.5 py-2 font-display text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-hover ease-editorial md:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] md:right-[calc(1.5rem+env(safe-area-inset-right,0px))] md:px-4 md:py-2.5 md:text-[11px]"
        >
          <ArrowUp
            aria-hidden
            className="relative z-[1] h-3.5 w-3.5 stroke-[1.8] transition-transform duration-hover ease-editorial group-hover:-translate-y-0.5 md:h-4 md:w-4"
          />
          <span className="relative z-[1]">Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
