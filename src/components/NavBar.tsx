"use client";

import InteractiveText from "@/components/InteractiveText";
import type { PhotoRiverCategory } from "@/data/images";
import { hoverTransition, panelTransition, revealTransition } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type ActiveImage = {
  name: string;
  description: string;
} | null;

export type ContentView = "photography" | "mixed-media";

type NavBarProps = {
  activeImage: ActiveImage;
  activeView: ContentView;
  activeFilter?: PhotoRiverCategory | null;
  onFilterSelect?: (category: PhotoRiverCategory) => void;
  onMixedMediaSelect?: () => void;
};

const PHOTOGRAPHY_CATEGORIES: Array<{
  label: string;
  value: PhotoRiverCategory;
}> = [
  { label: "COMMERCIAL", value: "commercial" },
  { label: "EDITORIAL", value: "editorial" },
  { label: "ART", value: "art" },
  { label: "COSPLAY", value: "cosplay" },
];

const ABOUT_BIO =
  "Ezra Gillera is a photographer and mixed-media artist working across editorial, commercial, art, and cosplay — blending precision lighting with techwear-inflected urban landscapes. Based between Tokyo and Los Angeles, his practice treats every frame as a study in contrast: structure and chaos, garment and body, analog grain and digital finish.";

function NavSurrealFrame({ show }: { show: boolean }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full transition-all duration-hover ease-editorial ${
        show
          ? "scale-100 opacity-100"
          : "scale-[0.97] opacity-0 group-hover:scale-100 group-hover:opacity-100"
      }`}
      viewBox="0 0 200 44"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <path
        d="M11 31 C 24 39, 41 17, 63 23 S 104 35, 131 21 S 168 31, 189 19 L 187 11 C 162 5, 139 9, 111 7 S 54 3, 31 11 S 9 13, 11 31 Z"
        stroke="#E8281A"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
      <path
        d="M17 27 C 36 33, 52 21, 76 25 S 121 29, 149 23 S 176 21, 182 17"
        stroke="#E8281A"
        strokeWidth="0.75"
        opacity="0.55"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
      />
      <path
        d="M14 14 C 42 8, 68 12, 98 10 S 154 6, 184 14"
        stroke="#E8281A"
        strokeWidth="0.5"
        opacity="0.35"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NavHeading({
  children,
  onClick,
  ariaExpanded,
  isActive = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ariaExpanded?: boolean;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      data-interactive="true"
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-current={isActive ? "page" : undefined}
      className="tap-target group relative -mx-1 bg-transparent px-3 py-2"
    >
      <NavSurrealFrame show={isActive} />
      <InteractiveText
        as="span"
        className={`relative z-[1] ${isActive ? "text-white" : "text-white/55"}`}
      >
        {children}
      </InteractiveText>
    </button>
  );
}

function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [ref, handler, enabled]);
}

export default function NavBar({
  activeImage,
  activeView,
  activeFilter = null,
  onFilterSelect,
  onMixedMediaSelect,
}: NavBarProps) {
  const [photoMenuOpen, setPhotoMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const photoMenuRef = useRef<HTMLDivElement>(null);
  const closePhotoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const clearPhotoCloseTimeout = useCallback(() => {
    if (closePhotoTimeoutRef.current) {
      clearTimeout(closePhotoTimeoutRef.current);
      closePhotoTimeoutRef.current = null;
    }
  }, []);

  const schedulePhotoMenuClose = useCallback(() => {
    clearPhotoCloseTimeout();
    closePhotoTimeoutRef.current = setTimeout(() => {
      setPhotoMenuOpen(false);
    }, 180);
  }, [clearPhotoCloseTimeout]);

  const openPhotoMenu = useCallback(() => {
    clearPhotoCloseTimeout();
    setPhotoMenuOpen(true);
  }, [clearPhotoCloseTimeout]);

  const togglePhotoMenu = useCallback(() => {
    setPhotoMenuOpen((open) => !open);
  }, []);

  useOutsideClick(photoMenuRef, () => setPhotoMenuOpen(false), isMobile);

  useEffect(() => {
    return () => clearPhotoCloseTimeout();
  }, [clearPhotoCloseTimeout]);

  return (
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...revealTransition, delay: 0.42 }}
      className="relative z-30 w-full bg-black text-white"
    >
      <div className="flex flex-col gap-4 px-4 py-4 sm:gap-5 md:flex-row md:items-start md:justify-between md:gap-8 md:px-6 md:py-5">
        <div className="flex min-h-[3.25rem] w-full items-start md:max-w-[34%] md:min-h-[3.5rem] md:flex-1">
          <AnimatePresence mode="wait">
            {activeImage ? (
              <motion.div
                key={`${activeImage.name}-${activeImage.description}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={hoverTransition}
                className="flex min-h-[3.25rem] flex-col justify-center gap-1 md:min-h-[3.5rem]"
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-white md:text-[12px]">
                  {activeImage.name}
                </p>
                <p className="text-[11px] tracking-[0.08em] text-white/55 md:text-[12px]">
                  {activeImage.description}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={hoverTransition}
                className="flex min-h-[3.25rem] items-center md:min-h-[3.5rem]"
              >
                <span className="text-[11px] tracking-[0.22em] text-white/35 md:text-[12px]">
                  <span className="animate-pulse">—</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav
          className="flex w-full flex-wrap items-center gap-x-2 gap-y-1 md:w-auto md:justify-center md:gap-x-4"
          aria-label="Primary"
        >
          <NavHeading
            onClick={onMixedMediaSelect}
            isActive={activeView === "mixed-media"}
          >
            MIXED MEDIA
          </NavHeading>

          <div
            ref={photoMenuRef}
            className="relative"
            onMouseEnter={!isMobile ? openPhotoMenu : undefined}
            onMouseLeave={!isMobile ? schedulePhotoMenuClose : undefined}
          >
            <NavHeading
              onClick={isMobile ? togglePhotoMenu : undefined}
              ariaExpanded={photoMenuOpen}
              isActive={activeView === "photography"}
            >
              PHOTOGRAPHY
            </NavHeading>

            <AnimatePresence>
              {photoMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={panelTransition}
                  className="absolute left-0 top-full z-50 mt-1 flex min-w-[12rem] flex-col bg-black py-1 md:left-1/2 md:mt-2 md:-translate-x-1/2"
                  onMouseEnter={!isMobile ? openPhotoMenu : undefined}
                  onMouseLeave={!isMobile ? schedulePhotoMenuClose : undefined}
                >
                  {PHOTOGRAPHY_CATEGORIES.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      data-interactive="true"
                      onClick={() => {
                        onFilterSelect?.(item.value);
                        setPhotoMenuOpen(false);
                      }}
                      className="group flex min-h-11 w-full items-center gap-2 bg-transparent px-2 text-left"
                    >
                      <span
                        className={`w-2 text-red transition-opacity duration-hover ease-editorial ${
                          activeFilter === item.value
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        —
                      </span>
                      <InteractiveText
                        as="span"
                        className={
                          activeFilter === item.value
                            ? "text-white"
                            : "text-white group-hover:text-red"
                        }
                      >
                        {item.label}
                      </InteractiveText>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex w-full flex-col items-start gap-2 md:w-auto md:items-end md:gap-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 md:gap-x-4">
            <Link
              href="/"
              data-interactive="true"
              className="tap-target inline-flex items-center px-2"
              aria-label="Kodetic home"
            >
              <Image
                src="/logo.png"
                alt="Kodetic"
                width={28}
                height={28}
                priority
                className="h-5 w-5 object-contain md:h-6 md:w-6"
              />
            </Link>

            <button
              type="button"
              data-interactive="true"
              onClick={() => setAboutOpen((open) => !open)}
              className="tap-target relative min-w-[4.5rem] bg-transparent px-2"
              aria-expanded={aboutOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {aboutOpen ? (
                  <motion.span
                    key="close"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={hoverTransition}
                    className="inline-block"
                  >
                    <InteractiveText as="span">CLOSE</InteractiveText>
                  </motion.span>
                ) : (
                  <motion.span
                    key="about"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={hoverTransition}
                    className="inline-block"
                  >
                    <InteractiveText as="span">ABOUT</InteractiveText>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {aboutOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={panelTransition}
            className="overflow-hidden"
          >
            <div className="px-4 py-4 md:px-6 md:py-5">
              <p className="max-w-2xl text-[11px] leading-relaxed tracking-[0.06em] text-white/70 md:ml-auto md:text-right md:text-[12px]">
                {ABOUT_BIO}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
