"use client";

import InteractiveText from "@/components/InteractiveText";
import LinenSheen from "@/components/LinenSheen";
import { panelTransition, revealTransition } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TOP_CATEGORIES = [
  { label: "MIXED MEDIA", href: "/mixed-media/" },
  { label: "CLIENT WORK", href: "/client-work/" },
  { label: "CREATIVE", href: "/creative/" },
  { label: "MISCELLANEOUS", href: "/miscellaneous/" },
] as const;

const ABOUT_BIO =
  "Ezra Gillera is a photographer and mixed-media artist working across client work, creative portraiture, and experimental collage — blending precision lighting with techwear-inflected urban landscapes. Based between Tokyo and Los Angeles, his practice treats every frame as a study in contrast: structure and chaos, garment and body, analog grain and digital finish.";

function pathMatches(pathname: string, href: string) {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return normalized === href || normalized.startsWith(href);
}

function NavLink({
  href,
  children,
  isActive = false,
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      data-interactive="true"
      aria-current={isActive ? "page" : undefined}
      className="tap-target-sm group relative bg-transparent px-2 py-1.5 md:px-3 md:py-2"
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-1 bottom-0.5 h-px bg-purple transition-opacity duration-hover ease-editorial ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
        }`}
      />
      <InteractiveText
        as="span"
        className={`relative z-[1] font-display text-xs font-semibold uppercase tracking-[0.14em] text-black md:text-sm md:tracking-[0.16em] ${
          isActive ? "opacity-100" : "opacity-70"
        }`}
      >
        {children}
      </InteractiveText>
    </Link>
  );
}

export default function NavBar() {
  const pathname = usePathname() ?? "/";
  const [aboutOpen, setAboutOpen] = useState(false);
  const isHome =
    pathname === "/" ||
    pathname === "" ||
    pathname.replace(/\/$/, "") === "";

  useEffect(() => {
    if (!aboutOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAboutOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aboutOpen]);

  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...revealTransition, delay: 0.2 }}
      className="nav-canvas relative z-30 w-full text-black"
    >
      <LinenSheen />

      <div className="relative z-[1] flex items-center gap-3 px-4 py-4 md:gap-4 md:px-6 md:py-5 lg:px-8">
        <nav
          className="flex min-w-0 flex-1 flex-wrap items-center justify-start gap-x-0.5 gap-y-1"
          aria-label="Primary"
        >
          {TOP_CATEGORIES.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              isActive={pathMatches(pathname, item.href)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          data-interactive="true"
          onClick={() => setAboutOpen((open) => !open)}
          className="tap-target-sm shrink-0 border border-purple bg-white/55 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-black transition-colors duration-hover ease-editorial hover:bg-purple/15 md:px-4 md:py-2 md:text-sm"
          aria-expanded={aboutOpen}
        >
          {aboutOpen ? "X" : "ABOUT"}
        </button>

        <Link
          href="/"
          data-interactive="true"
          className="tap-target-sm inline-flex shrink-0 items-center"
          aria-label="Kodetic home"
          aria-current={isHome ? "page" : undefined}
        >
          <span className="font-display text-sm font-bold uppercase tracking-[0.18em] text-black md:text-base md:tracking-[0.2em]">
            KODETIC
          </span>
        </Link>
      </div>

      <AnimatePresence>
        {aboutOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={panelTransition}
            className="relative z-[1] overflow-hidden border-t border-black/10"
          >
            <div className="relative px-4 py-6 md:px-8 md:py-8">
              <p className="font-display text-xs uppercase tracking-[0.22em] text-purple md:text-sm">
                About
              </p>
              <p className="mt-3 max-w-2xl font-sans text-sm font-normal leading-relaxed tracking-[0.02em] text-black/85 md:text-base">
                {ABOUT_BIO}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
