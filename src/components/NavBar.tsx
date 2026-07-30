"use client";

import { withBasePath } from "@/lib/base-path";
import InteractiveText from "@/components/InteractiveText";
import LinenSheen from "@/components/LinenSheen";
import type { PhotoRiverCategory } from "@/data/images";
import { hoverTransition, panelTransition, revealTransition } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type ActiveImage = {
  name: string;
  description: string;
} | null;

export type ContentView = PhotoRiverCategory;

type NavBarProps = {
  activeImage: ActiveImage;
  activeView: ContentView;
  onCategorySelect?: (category: PhotoRiverCategory) => void;
};

const TOP_CATEGORIES: Array<{
  label: string;
  value: PhotoRiverCategory;
}> = [
  { label: "MIXED MEDIA", value: "mixed-media" },
  { label: "CLIENT WORK", value: "commercial" },
  { label: "EDITORIAL", value: "editorial" },
  { label: "ART", value: "art" },
  { label: "COSPLAY", value: "cosplay" },
];

const ABOUT_BIO =
  "Ezra Gillera is a photographer and mixed-media artist working across editorial, client work, art, and cosplay — blending precision lighting with techwear-inflected urban landscapes. Based between Tokyo and Los Angeles, his practice treats every frame as a study in contrast: structure and chaos, garment and body, analog grain and digital finish.";

function NavLink({
  children,
  onClick,
  isActive = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      data-interactive="true"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className="tap-target-sm group relative bg-transparent px-1.5 py-1 md:px-2"
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-1 bottom-0.5 h-px bg-red transition-opacity duration-hover ease-editorial ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
        }`}
      />
      <InteractiveText
        as="span"
        className={`relative z-[1] font-display text-[10px] font-medium uppercase tracking-[0.14em] text-black md:text-[11px] md:tracking-[0.16em] ${
          isActive ? "opacity-100" : "opacity-70"
        }`}
      >
        {children}
      </InteractiveText>
    </button>
  );
}

export default function NavBar({
  activeImage,
  activeView,
  onCategorySelect,
}: NavBarProps) {
  const [aboutOpen, setAboutOpen] = useState(false);

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
      transition={{ ...revealTransition, delay: 0.35 }}
      className="nav-canvas relative z-30 w-full text-black"
    >
      <LinenSheen />

      <div className="relative z-[1] flex items-center gap-2 px-3 py-2 md:gap-3 md:px-5 md:py-2.5">
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <Link
            href="/"
            data-interactive="true"
            className="tap-target-sm inline-flex items-center gap-1.5"
            aria-label="Kodetic home"
          >
            <Image
              src={withBasePath("/logo.png")}
              alt="Kodetic"
              width={22}
              height={22}
              priority
              className="h-4 w-4 object-contain md:h-[18px] md:w-[18px]"
            />
            <span className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-black md:text-xs md:tracking-[0.2em]">
              KODETIC
            </span>
          </Link>

          <AnimatePresence mode="wait">
            {activeImage ? (
              <motion.p
                key="active-desc"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={hoverTransition}
                className="hidden max-w-[14rem] truncate font-sans text-[11px] font-normal tracking-[0.02em] text-black/70 sm:block md:max-w-[18rem] md:text-xs"
              >
                {activeImage.description || activeImage.name}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>

        <nav
          className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-0.5 gap-y-0"
          aria-label="Primary"
        >
          {TOP_CATEGORIES.map((item) => (
            <NavLink
              key={item.value}
              onClick={() => onCategorySelect?.(item.value)}
              isActive={activeView === item.value}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          data-interactive="true"
          onClick={() => setAboutOpen((open) => !open)}
          className="tap-target-sm shrink-0 border border-red bg-white/55 px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-black transition-colors duration-hover ease-editorial hover:bg-red/15 md:px-3 md:text-[11px]"
          aria-expanded={aboutOpen}
        >
          {aboutOpen ? "X" : "ABOUT"}
        </button>
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
            <div className="relative px-4 py-5 md:px-6 md:py-6">
              <p className="font-display text-[10px] uppercase tracking-[0.22em] text-red md:text-[11px]">
                About
              </p>
              <p className="mt-2 max-w-2xl font-sans text-xs font-normal leading-relaxed tracking-[0.02em] text-black/85 md:text-sm">
                {ABOUT_BIO}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
