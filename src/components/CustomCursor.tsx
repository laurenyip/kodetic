"use client";

import { hoverTransition } from "@/lib/motion";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, summary, [role="button"], [data-interactive="true"]';

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest(INTERACTIVE_SELECTOR));
}

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursorX = useSpring(mouseX, { stiffness: 520, damping: 42, mass: 0.45 });
  const cursorY = useSpring(mouseY, { stiffness: 520, damping: 42, mass: 0.45 });

  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateEnabled = () => setEnabled(media.matches);
    updateEnabled();

    if (!media.matches) return;

    document.body.classList.add("has-custom-cursor");

    const onMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      setIsVisible(true);
      setIsInteractive(isInteractiveTarget(event.target));
    };

    const onOver = (event: MouseEvent) => {
      setIsInteractive(isInteractiveTarget(event.target));
    };

    const onLeave = () => {
      setIsVisible(false);
      setIsInteractive(false);
    };

    media.addEventListener("change", updateEnabled);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      media.removeEventListener("change", updateEnabled);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("has-custom-cursor");
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[10000] mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0,
      }}
      transition={hoverTransition}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <span
          className={`absolute left-1/2 top-1/2 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-hover ease-editorial ${
            isInteractive ? "border-purple" : "border-white"
          }`}
        />
        <span
          className={`absolute left-1/2 top-1/2 block h-px w-3 transition-colors duration-hover ease-editorial ${
            isInteractive ? "bg-purple" : "bg-white"
          }`}
          style={{ transform: "translate(-50%, -50%)" }}
        />
        <span
          className={`absolute left-1/2 top-1/2 block h-3 w-px transition-colors duration-hover ease-editorial ${
            isInteractive ? "bg-purple" : "bg-white"
          }`}
          style={{ transform: "translate(-50%, -50%)" }}
        />
        <span
          className={`absolute left-1/2 top-1/2 block h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-hover ease-editorial ${
            isInteractive ? "bg-purple" : "bg-white"
          }`}
        />
      </div>
    </motion.div>
  );
}
