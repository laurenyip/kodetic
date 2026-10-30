"use client";

import InteractiveText from "@/components/InteractiveText";
import LinenSheen from "@/components/LinenSheen";
import { panelTransition } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
      className="group relative inline-flex min-h-11 shrink-0 items-center justify-start bg-transparent px-1 md:min-h-8 md:px-1.5"
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-1 bottom-2 h-[2px] bg-purple transition-opacity duration-hover ease-editorial md:inset-x-1.5 md:bottom-1 ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
        }`}
      />
      <InteractiveText
        as="span"
        className={`relative z-[1] whitespace-nowrap font-display text-[11px] font-semibold uppercase tracking-[0.1em] md:text-xs md:tracking-[0.12em] ${
          isActive ? "text-purple" : "text-black opacity-80"
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
  const headerRef = useRef<HTMLDivElement | null>(null);
  const isHome =
    pathname === "/" ||
    pathname === "" ||
    pathname.replace(/\/$/, "") === "";

  useEffect(() => {
    setAboutOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!aboutOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAboutOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setAboutOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [aboutOpen]);

  return (
    <div ref={headerRef} className="relative z-30 w-full">
      <header className="nav-canvas relative w-full pt-[env(safe-area-inset-top,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] text-black">
        <LinenSheen />

        <div className="relative z-[1] flex flex-col items-stretch px-3 py-1.5 md:flex-row md:items-center md:gap-4 md:px-5 md:py-2.5 lg:px-8">
          <div className="flex w-full shrink-0 items-center justify-start gap-3 md:w-auto">
            <Link
              href="/"
              data-interactive="true"
              className="inline-flex min-h-11 shrink-0 items-center justify-start md:min-h-8"
              aria-label="Kodetic home"
              aria-current={isHome ? "page" : undefined}
            >
              <span className="font-display text-sm font-bold uppercase tracking-[0.14em] text-black md:tracking-[0.16em]">
                KODETIC
              </span>
            </Link>

            <button
              type="button"
              data-interactive="true"
              onClick={() => setAboutOpen((open) => !open)}
              className={`group relative inline-flex min-h-11 min-w-[3.75rem] shrink-0 items-center justify-center px-1 font-display text-[11px] font-bold uppercase tracking-[0.12em] transition-colors duration-hover ease-editorial hover:text-purple md:min-h-8 md:text-xs ${
                aboutOpen ? "text-purple" : "text-black"
              }`}
              aria-expanded={aboutOpen}
              aria-controls="about-panel"
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-x-1 bottom-2 h-[2px] bg-purple transition-opacity duration-hover ease-editorial md:bottom-1 ${
                  aboutOpen ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                }`}
              />
              {aboutOpen ? "CLOSE" : "ABOUT"}
            </button>
          </div>

          {/* One row on every width; on phones it scrolls sideways instead of wrapping onto three lines. */}
          <nav
            className="-mx-3 flex min-w-0 items-center gap-x-3 overflow-x-auto overscroll-x-contain px-3 [mask-image:linear-gradient(to_right,#000_calc(100%-1.5rem),transparent)] [scrollbar-width:none] md:mx-0 md:flex-1 md:justify-end md:overflow-visible md:px-0 md:[mask-image:none] [&::-webkit-scrollbar]:hidden"
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
      </header>

      {/* Drops over the page instead of growing the sticky header. */}
      <AnimatePresence>
        {aboutOpen && (
          <motion.div
            id="about-panel"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={panelTransition}
            className="nav-canvas absolute inset-x-0 top-full z-[2] max-h-[min(70dvh,34rem)] overflow-y-auto overscroll-contain border-t border-black/10 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
          >
            <div className="relative px-4 pt-6 pb-10 md:px-8 md:pt-8 md:pb-12">
              <h2 className="font-display text-xs uppercase tracking-[0.22em] text-purple">
                About
              </h2>
              <div className="mt-3 max-w-2xl space-y-3.5 font-sans text-sm font-normal leading-relaxed tracking-[0.02em] text-black/85">
                {ABOUT_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
