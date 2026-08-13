"use client";

import type { GalleryImage } from "@/data/gallery";
import {
  GALLERY_HIGHLIGHT_STYLES,
  type GalleryHighlight,
} from "@/lib/gallery-highlight";
import { withBasePath } from "@/lib/base-path";
import { useInView } from "@/lib/use-in-view";
import { hoverTransition, panelTransition } from "@/lib/motion";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type GalleryExpandableCellProps = {
  image: GalleryImage;
  index: number;
  isHovered: boolean;
  isExpanded: boolean;
  hasExpandedSibling: boolean;
  hasRiverFocus?: boolean;
  highlight?: GalleryHighlight;
  /** Fill a CSS grid cell (5-across PDF layouts) instead of floating rem widths */
  fillGrid?: boolean;
  /** Span the full grid row (wide / banner frames) */
  fullRow?: boolean;
  /** Share one row height; width follows the image aspect (portrait + landscape) */
  matchRowHeight?: boolean;
  setItemRef?: (id: string, element: HTMLElement | null) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onExpand: () => void;
  onCollapse: () => void;
};

type RectMetrics = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function fitExpandedFrame(
  origin: DOMRect,
  aspect: number,
): RectMetrics {
  const pad = 12;
  const closeSize = 40;
  const closeGap = 8;
  const stickyHeader = document.querySelector<HTMLElement>(
    "header[data-site-header]",
  );
  const headerBottom = stickyHeader?.getBoundingClientRect().bottom ?? 0;
  const topBoundary = Math.max(pad, headerBottom + pad);
  const availableHeight = Math.max(180, window.innerHeight - topBoundary - pad);
  const sideReserve = closeSize + closeGap + pad;
  const maxW = Math.min(window.innerWidth - pad * 2 - sideReserve, 920);
  const maxH = availableHeight;

  let width = Math.max(160, maxW);
  let height = width / aspect;
  if (height > maxH) {
    height = maxH;
    width = height * aspect;
  }

  const cx = origin.left + origin.width / 2;
  const cy = origin.top + origin.height / 2;

  let left = cx - width / 2;
  let top = cy - height / 2;

  // Prefer room on the right for the close control; fall back to left.
  const rightRoom = window.innerWidth - (left + width) - pad;
  if (rightRoom < sideReserve) {
    left = Math.max(pad, window.innerWidth - width - sideReserve);
  }
  left = Math.max(pad, Math.min(left, window.innerWidth - width - pad));
  top = Math.max(
    topBoundary,
    Math.min(top, window.innerHeight - height - pad),
  );

  return { left, top, width, height };
}

function ExpandedOverlay({
  image,
  originRect,
  aspect,
  onClose,
}: {
  image: GalleryImage;
  originRect: DOMRect;
  aspect: number;
  onClose: () => void;
}) {
  const [target, setTarget] = useState<RectMetrics>(() =>
    fitExpandedFrame(originRect, aspect),
  );

  useLayoutEffect(() => {
    setTarget(fitExpandedFrame(originRect, aspect));
  }, [originRect, aspect]);

  useEffect(() => {
    const onResize = () => setTarget(fitExpandedFrame(originRect, aspect));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [originRect, aspect]);

  const imageSrc = image.fullSrc ?? image.src;
  const closeSize = 40;
  const closeGap = 8;
  const stickyHeader =
    typeof document !== "undefined"
      ? document.querySelector<HTMLElement>("header[data-site-header]")
      : null;
  const headerBottom = stickyHeader?.getBoundingClientRect().bottom ?? 0;
  const minTop = Math.max(12, headerBottom + 8);

  const rightBeside = target.left + target.width + closeGap;
  const leftBeside = target.left - closeGap - closeSize;
  const useRight = rightBeside + closeSize <= window.innerWidth - 12;
  const closeLeft = useRight
    ? rightBeside
    : Math.max(12, leftBeside);
  const closeTop = Math.max(minTop, target.top);

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={image.name}
        className="fixed z-[55] overflow-hidden bg-black/90 shadow-[0_24px_60px_rgba(0,0,0,0.65)]"
        style={{ position: "fixed", ...target }}
      >
        <Image
          src={withBasePath(imageSrc)}
          alt={image.name}
          fill
          priority
          sizes={`${Math.round(target.width)}px`}
          className="object-contain object-center"
        />
      </div>
      <button
        type="button"
        data-interactive="true"
        aria-label="Close image"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="tap-target fixed z-[56] flex h-10 w-10 items-center justify-center border border-white/25 bg-black/80 font-display text-sm tracking-[0.18em] text-white/85 transition-colors duration-hover ease-editorial hover:border-purple hover:text-purple md:text-base"
        style={{ left: closeLeft, top: closeTop }}
      >
        X
      </button>
    </>
  );
}

export default function GalleryExpandableCell({
  image,
  index,
  isHovered,
  isExpanded,
  hasExpandedSibling,
  hasRiverFocus = false,
  highlight = "primary",
  fillGrid = false,
  fullRow = false,
  matchRowHeight = false,
  setItemRef,
  onMouseEnter,
  onMouseLeave,
  onExpand,
  onCollapse,
}: GalleryExpandableCellProps) {
  const figureRef = useRef<HTMLElement | null>(null);
  const inView = useInView(figureRef);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(
    null,
  );
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => setPortalReady(true), []);

  const shouldLoadImage = inView || isExpanded || isHovered;
  const aspect = natural
    ? natural.w / natural.h
    : (image.aspect ?? 4 / 5);

  const riverStyles = hasRiverFocus
    ? GALLERY_HIGHLIGHT_STYLES[highlight]
    : GALLERY_HIGHLIGHT_STYLES.primary;

  const fadeWhileSiblingExpanded =
    hasExpandedSibling && !isExpanded
      ? { opacity: 0.08, filter: "brightness(0.35) saturate(0.15)", scale: 0.98 }
      : null;

  const subtleHover =
    isHovered && !isExpanded && !hasExpandedSibling
      ? { ...riverStyles, scale: 1.01 }
      : null;

  const handleClick = () => {
    if (image.placeholder || isExpanded || !figureRef.current) return;
    setOriginRect(figureRef.current.getBoundingClientRect());
    onExpand();
  };

  const handleClose = () => {
    onCollapse();
  };

  useLayoutEffect(() => {
    if (image.placeholder) return;
    if (!isExpanded || originRect || !figureRef.current) return;

    const element = figureRef.current;
    const headerBottom =
      document
        .querySelector<HTMLElement>("header[data-site-header]")
        ?.getBoundingClientRect().bottom ?? 0;
    const rect = element.getBoundingClientRect();
    const availableHeight = window.innerHeight - headerBottom;
    const targetScroll =
      window.scrollY +
      rect.top -
      headerBottom -
      Math.max(0, (availableHeight - rect.height) / 2);

    document.documentElement.scrollTop = Math.max(0, targetScroll);
    const timeout = window.setTimeout(() => {
      setOriginRect(element.getBoundingClientRect());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [image.placeholder, isExpanded, originRect]);

  useEffect(() => {
    if (!isExpanded) setOriginRect(null);
  }, [isExpanded]);

  if (image.placeholder) {
    return (
      <figure
        aria-hidden
        style={{ aspectRatio: "4 / 5" }}
        className="relative w-full bg-transparent"
      />
    );
  }

  const motionState =
    fadeWhileSiblingExpanded ?? subtleHover ?? riverStyles;

  const animateEntrance = index < 18 && !hasRiverFocus && !hasExpandedSibling;
  const note = image.note?.trim() ?? "";
  const spanFull = fullRow;

  return (
    <>
      <motion.figure
        ref={(element) => {
          figureRef.current = element;
          setItemRef?.(image.id, element);
        }}
        initial={animateEntrance ? { opacity: 0, y: 16 } : false}
        animate={{
          ...motionState,
          opacity: isExpanded ? 0 : motionState.opacity,
        }}
        transition={{
          opacity: panelTransition,
          filter: panelTransition,
          scale: isHovered && !isExpanded ? hoverTransition : panelTransition,
          delay: animateEntrance ? Math.min(index * 0.02, 0.2) : 0,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={handleClick}
        style={
          matchRowHeight
            ? { ["--row-flex" as string]: aspect }
            : { aspectRatio: `${aspect}` }
        }
        className={`group relative w-full scroll-mt-32 cursor-crosshair bg-transparent ${
          isExpanded ? "pointer-events-none" : ""
        } z-0 ${
          matchRowHeight
            ? "min-w-0 max-sm:flex-none sm:[flex:var(--row-flex)_1_0%]"
            : fillGrid || spanFull
              ? spanFull
                ? "col-span-full"
                : ""
              : "w-[min(100%,22rem)] sm:w-[min(100%,18rem)] md:w-[min(100%,20rem)] lg:w-[min(100%,22rem)]"
        } ${isHovered && !isExpanded ? "z-[5]" : ""} ${
          highlight === "primary" && hasRiverFocus && !isExpanded ? "z-10" : ""
        }`}
      >
        <div
          className={`relative overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.55),0_0_40px_rgba(40,24,60,0.18)] ${
            matchRowHeight ? "w-full" : "h-full w-full"
          }`}
          style={matchRowHeight ? { aspectRatio: `${aspect}` } : undefined}
        >
          {shouldLoadImage ? (
            <Image
              src={withBasePath(image.src)}
              alt={image.name}
              fill
              loading="lazy"
              sizes={
                spanFull
                  ? "(max-width: 1400px) 94vw, 1400px"
                  : matchRowHeight
                    ? "(max-width: 640px) 94vw, 42vw"
                    : fillGrid
                      ? "(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                      : "(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 22rem"
              }
              onLoad={(event) => {
                const img = event.currentTarget;
                if (img.naturalWidth && img.naturalHeight) {
                  setNatural({ w: img.naturalWidth, h: img.naturalHeight });
                }
              }}
              className="object-contain object-center"
            />
          ) : (
            <div className="absolute inset-0 bg-white/[0.03]" />
          )}
        </div>

        <figcaption
          className={`mt-2 w-full transition-opacity duration-hover ease-editorial ${
            isHovered && !isExpanded ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="min-h-[1.1rem] font-sans text-xs font-light leading-relaxed tracking-[0.02em] text-white/55 md:text-sm">
            {note || "\u00A0"}
          </p>
        </figcaption>
      </motion.figure>

      {portalReady &&
        isExpanded &&
        originRect &&
        createPortal(
          <ExpandedOverlay
            image={image}
            originRect={originRect}
            aspect={aspect}
            onClose={handleClose}
          />,
          document.body,
        )}
    </>
  );
}
