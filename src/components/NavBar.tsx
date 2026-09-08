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
  { label: "COSPLAY", href: "/cosplay/" },
  { label: "MISCELLANEOUS", href: "/miscellaneous/" },
] as const;

const ABOUT_PARAGRAPHS = [
  "Kodetic, also known as Ezra, is a multidisciplinary artist primarily based in Vancouver, BC, Canada. Over the past several years, he has developed a creative practice rooted in photography, film, design, and digital media. His work moves across disciplines, blending different creative mediums to explore people, culture, ideas, and the world around him.",
  "Through his work, he has created a space for experimentation and collaboration, working with artists, brands, organizations, and communities to bring ideas to life through visual storytelling. His practice sits at the intersection of art and communication, combining creative direction with an understanding of digital media and contemporary culture.",
  "Whether through photography, film, design, or collaborative projects, his work is driven by curiosity, authenticity, and a desire to create meaningful connections.",
  "At its core, Kodetic is an evolving creative practice built around the belief that creativity is a fundamental way of understanding, connecting, and experiencing the world.",
];

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
      className="tap-target-sm group relative justify-start bg-transparent px-0 py-1 md:px-1.5 md:py-1.5"
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0.5 h-px bg-purple transition-opacity duration-hover ease-editorial md:inset-x-0.5 ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
        }`}
      />
      <InteractiveText
        as="span"
        className={`relative z-[1] font-display text-[10px] font-semibold uppercase tracking-[0.1em] text-black md:text-[11px] md:tracking-[0.12em] ${
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

      <div className="relative z-[1] flex flex-col items-stretch gap-2 px-3 py-3 md:flex-row md:items-center md:gap-3 md:px-5 md:py-3.5 lg:px-8">
        <div className="flex w-full shrink-0 items-center justify-start gap-2 md:w-auto md:gap-3">
          <Link
            href="/"
            data-interactive="true"
            className="tap-target-sm inline-flex shrink-0 items-center justify-start"
            aria-label="Kodetic home"
            aria-current={isHome ? "page" : undefined}
          >
            <span className="font-display text-xs font-bold uppercase tracking-[0.14em] text-black md:text-sm md:tracking-[0.16em]">
              KODETIC
            </span>
          </Link>

          <button
            type="button"
            data-interactive="true"
            onClick={() => setAboutOpen((open) => !open)}
            className="tap-target-sm shrink-0 border border-purple bg-white/55 px-2 py-1 font-display text-[10px] font-bold uppercase tracking-[0.12em] text-black transition-colors duration-hover ease-editorial hover:bg-purple/15 md:px-2.5 md:py-1 md:text-[11px]"
            aria-expanded={aboutOpen}
          >
            {aboutOpen ? "X" : "ABOUT"}
          </button>
        </div>

        <nav
          className="flex w-full min-w-0 flex-wrap items-center justify-start gap-x-3 gap-y-0.5 md:flex-1 md:justify-end md:gap-x-3"
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
            <div className="relative px-4 pt-6 pb-12 md:px-8 md:pt-8 md:pb-16">
              <p className="font-display text-[10px] uppercase tracking-[0.22em] text-purple md:text-xs">
                About
              </p>
              <div className="mt-3 max-w-2xl space-y-3.5 font-sans text-xs font-normal leading-relaxed tracking-[0.02em] text-black/85 md:text-sm">
                {ABOUT_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
