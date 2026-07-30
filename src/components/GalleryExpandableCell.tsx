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
  hasRiverFocus: boolean;
  highlight: GalleryHighlight;
  setItemRef: (id: string, element: HTMLElement | null) => void;
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
  const stickyHeader = document.querySelector<HTMLElement>(
    "header[data-site-header]",
  );
  const headerBottom = stickyHeader?.getBoundingClientRect().bottom ?? 0;
  const topBoundary = Math.max(pad, headerBottom + pad);
  const availableHeight = Math.max(180, window.innerHeight - topBoundary - pad);
  const maxW = Math.min(window.innerWidth * 0.92, 920);
  const maxH = availableHeight;

  let width = maxW;
  let height = width / aspect;
  if (height > maxH) {
    height = maxH;
    width = height * aspect;
  }

  const cx = origin.left + origin.width / 2;
  const cy = origin.top + origin.height / 2;

  let left = cx - width / 2;
  let top = cy - height / 2;

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
  return (
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
      <button
        type="button"
        data-interactive="true"
        aria-label="Close image"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="tap-target absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center bg-black/80 font-display text-sm tracking-[0.18em] text-white/85 transition-colors duration-hover ease-editorial hover:text-red md:right-3 md:top-3 md:text-base"
      >
        X
      </button>
    </div>
  );
}

export default function GalleryExpandableCell({
  image,
  index,
  isHovered,
  isExpanded,
  hasExpandedSibling,
  hasRiverFocus,
  highlight,
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
  const aspect = natural ? natural.w / natural.h : 4 / 5;

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
    if (isExpanded || !figureRef.current) return;
    setOriginRect(figureRef.current.getBoundingClientRect());
    onExpand();
  };

  const handleClose = () => {
    onCollapse();
  };

  useLayoutEffect(() => {
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
  }, [isExpanded, originRect]);

  useEffect(() => {
    if (!isExpanded) setOriginRect(null);
  }, [isExpanded]);

  const motionState =
    fadeWhileSiblingExpanded ?? subtleHover ?? riverStyles;

  const animateEntrance = index < 18 && !hasRiverFocus && !hasExpandedSibling;
  const note = image.note?.trim() ?? "";

  return (
    <>
      <motion.figure
        ref={(element) => {
          figureRef.current = element;
          setItemRef(image.id, element);
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
        style={{ aspectRatio: `${aspect}` }}
        className={`group relative scroll-mt-32 cursor-crosshair bg-transparent ${
          isExpanded ? "pointer-events-none" : ""
        } z-0 w-[min(100%,22rem)] sm:w-[min(100%,18rem)] md:w-[min(100%,20rem)] lg:w-[min(100%,22rem)] ${
          isHovered && !isExpanded ? "z-[5]" : ""
        } ${
          highlight === "primary" && hasRiverFocus && !isExpanded ? "z-10" : ""
        }`}
      >
        <div className="relative h-full w-full overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.55),0_0_40px_rgba(40,24,60,0.18)]">
          {shouldLoadImage ? (
            <Image
              src={withBasePath(image.src)}
              alt={image.name}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 22rem"
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
          className={`mt-3 max-w-[22rem] transition-opacity duration-hover ease-editorial ${
            isHovered && !isExpanded ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="min-h-[1.25rem] font-sans text-sm font-light leading-relaxed tracking-[0.02em] text-white/55 md:text-[15px]">
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
