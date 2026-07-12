"use client";

import { hoverTransition } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const OUTLINE_PATH =
  "M9 27 C 20 33, 30 17, 44 21 S 64 29, 77 23 L 79 11 C 68 5, 52 7, 38 5 S 18 3, 9 11 Z";

function TopSurrealFrame() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 88 36"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <defs>
        <filter
          id="top-inner-shadow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0"
            dy="1.5"
            stdDeviation="2.2"
            floodColor="#000000"
            floodOpacity="0.55"
          />
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="1"
            floodColor="#000000"
            floodOpacity="0.25"
          />
        </filter>
      </defs>

      <path
        d={OUTLINE_PATH}
        fill="rgba(0, 0, 0, 0.18)"
        stroke="none"
        filter="url(#top-inner-shadow)"
      />

      <path
        d={OUTLINE_PATH}
        stroke="#E8281A"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
      <path
        d="M14 23 C 28 28, 40 18, 54 22 S 70 24, 74 19"
        stroke="#E8281A"
        strokeWidth="0.75"
        opacity="0.55"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
      />
      <path
        d="M12 12 C 30 8, 48 11, 66 9 S 78 7, 80 13"
        stroke="#E8281A"
        strokeWidth="0.5"
        opacity="0.35"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
          className="tap-target group fixed bottom-5 right-5 z-30 bg-transparent px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] text-white/80 transition-colors duration-hover ease-editorial hover:text-red md:bottom-6 md:right-6 md:px-5 md:py-3 md:text-[12px]"
        >
          <TopSurrealFrame />
          <span className="relative z-[1]">Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
