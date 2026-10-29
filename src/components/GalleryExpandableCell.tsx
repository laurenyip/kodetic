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
import { Maximize2, X } from "lucide-react";
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

type ExpandedFrame = {
  left: number;
  top: number;
  width: number;
  height: number;
  /** Close control sits inside the frame (narrow screens) instead of beside it */
  closeInside: boolean;
  /** Width of the image strip; wider than the frame means it pans sideways */
  contentWidth: number;
};

const PAD = 12;
const CLOSE_SIZE = 44;
const CLOSE_GAP = 8;
/** Wider than this, an image is shown at a readable height and pans instead of shrinking */
const PAN_ASPECT = 1.6;

const FOCUSABLE = 'button, [href], [tabindex]:not([tabindex="-1"])';

function fitExpandedFrame(aspect: number): ExpandedFrame {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const closeInside = vw < 768;
  const availableWidth =
    vw - PAD * 2 - (closeInside ? 0 : (CLOSE_SIZE + CLOSE_GAP) * 2);
  const availableHeight = vh - PAD * 2;

  if (aspect > PAN_ASPECT) {
    const height = Math.round(
      closeInside
        ? Math.min(availableHeight, vw * 1.1)
        : Math.min(availableHeight * 0.85, 640),
    );
    const contentWidth = height * aspect;
    if (contentWidth > availableWidth) {
      return {
        left: (vw - availableWidth) / 2,
        top: (vh - height) / 2,
        width: availableWidth,
        height,
        closeInside,
        contentWidth,
      };
    }
  }

  let width = availableWidth;
  let height = width / aspect;
  if (height > availableHeight) {
    height = availableHeight;
    width = height * aspect;
  }

  return {
    left: (vw - width) / 2,
    top: (vh - height) / 2,
    width,
    height,
    closeInside,
    contentWidth: width,
  };
}

function ExpandedOverlay({
  image,
  alt,
  aspect,
  onClose,
}: {
  image: GalleryImage;
  alt: string;
  aspect: number;
  onClose: () => void;
}) {
  const [frame, setFrame] = useState<ExpandedFrame>(() =>
    fitExpandedFrame(aspect),
  );
  const rootRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const panRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number; scroll: number } | null>(null);

  useLayoutEffect(() => {
    setFrame(fitExpandedFrame(aspect));
  }, [aspect]);

  useEffect(() => {
    const onResize = () => setFrame(fitExpandedFrame(aspect));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [aspect]);

  // Modal: everything behind the dialog is inert, focus starts on Close and stays inside.
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>("[data-site-shell]");
    shell?.setAttribute("inert", "");
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !rootRef.current) return;
      const focusables = Array.from(
        rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      shell?.removeAttribute("inert");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const pans = frame.contentWidth > frame.width + 1;
  const imageSrc = image.fullSrc ?? image.src;

  const closeStyle = frame.closeInside
    ? {
        left: frame.left + frame.width - CLOSE_SIZE - 8,
        top: frame.top + 8,
      }
    : {
        left: frame.left + frame.width + CLOSE_GAP,
        top: frame.top,
      };

  return (
    <div ref={rootRef}>
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={panelTransition}
        onClick={onClose}
        className="fixed inset-0 z-[54] bg-black/75"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        className="fixed z-[55] overflow-hidden bg-black/90 shadow-[0_24px_60px_rgba(0,0,0,0.65)]"
        style={{
          left: frame.left,
          top: frame.top,
          width: frame.width,
          height: frame.height,
        }}
      >
        {pans ? (
          <div
            ref={panRef}
            tabIndex={0}
            role="group"
            aria-label="Wide image. Scroll or use the arrow keys to pan."
            className="h-full w-full cursor-grab overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:thin] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple-light active:cursor-grabbing"
            onWheel={(event) => {
              if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                event.currentTarget.scrollLeft += event.deltaY;
              }
            }}
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse") return;
              drag.current = {
                x: event.clientX,
                scroll: event.currentTarget.scrollLeft,
              };
            }}
            onPointerMove={(event) => {
              if (!drag.current) return;
              event.currentTarget.scrollLeft =
                drag.current.scroll - (event.clientX - drag.current.x);
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerLeave={() => {
              drag.current = null;
            }}
          >
            <div
              className="relative h-full"
              style={{ width: frame.contentWidth }}
            >
              <Image
                src={withBasePath(imageSrc)}
                alt={alt}
                fill
                priority
                draggable={false}
                sizes={`${Math.round(frame.contentWidth)}px`}
                className="select-none object-cover"
              />
            </div>
          </div>
        ) : (
          <Image
            src={withBasePath(imageSrc)}
            alt={alt}
            fill
            priority
            sizes={`${Math.round(frame.width)}px`}
            className="object-contain object-center"
          />
        )}
      </div>
      {pans && (
        <p
          className="pointer-events-none fixed z-[56] -translate-x-1/2 font-display text-[11px] uppercase tracking-[0.16em] text-white/75"
          style={{
            left: "50%",
            top: Math.min(
              window.innerHeight - 28,
              frame.top + frame.height + 12,
            ),
          }}
        >
          Drag or scroll sideways to see the full spread
        </p>
      )}
      <button
        ref={closeRef}
        type="button"
        aria-label="Close image"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="tap-target fixed z-[56] flex h-11 w-11 items-center justify-center border border-white/25 bg-black/80 text-white/85 transition-colors duration-hover ease-editorial hover:border-purple-light hover:text-purple-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-light"
        style={closeStyle}
      >
        <X aria-hidden className="h-5 w-5 stroke-[1.6]" />
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
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const wasExpanded = useRef(false);
  const inView = useInView(figureRef);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(
    null,
  );
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => setPortalReady(true), []);

  // Return focus to the photo that opened the dialog.
  useEffect(() => {
    if (isExpanded) {
      wasExpanded.current = true;
    } else if (wasExpanded.current) {
      wasExpanded.current = false;
      window.setTimeout(() => triggerRef.current?.focus(), 0);
    }
  }, [isExpanded]);

  const shouldLoadImage = inView || isExpanded || isHovered;
  const aspect = natural
    ? natural.w / natural.h
    : (image.aspect ?? (fullRow ? 2.2 : 4 / 5));
  const alt = image.alt?.trim() || image.name;

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
    if (image.placeholder || isExpanded) return;
    onExpand();
  };

  const handleNaturalSize = (img: HTMLImageElement) => {
    if (img.naturalWidth && img.naturalHeight) {
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    }
  };

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
  // Frames only show a caption once Ezra adds a note.
  const caption = note;
  const frameShadow =
    "shadow-[0_18px_50px_rgba(0,0,0,0.55),0_0_40px_rgba(40,24,60,0.18)]";

  return (
    <>
      <motion.figure
        ref={(element) => {
          figureRef.current = element;
          setItemRef?.(image.id, element);
        }}
        initial={animateEntrance ? { opacity: 0.35, y: 12 } : false}
        animate={{
          y: 0,
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
        style={
          matchRowHeight
            ? { ["--row-flex" as string]: aspect }
            : spanFull || caption
              ? undefined
              : { aspectRatio: `${aspect}` }
        }
        className={`group relative w-full scroll-mt-32 bg-transparent ${
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
        <button
          ref={triggerRef}
          type="button"
          onClick={handleClick}
          onFocus={onMouseEnter}
          onBlur={onMouseLeave}
          aria-haspopup="dialog"
          aria-label={`View larger: ${alt}`}
          className="relative block h-full w-full cursor-crosshair text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-light"
        >
          {spanFull ? (
            <>
              <div className="flex flex-col gap-3 sm:hidden">
                {(["left", "right"] as const).map((side) => (
                  <div
                    key={side}
                    className={`relative w-full overflow-hidden ${frameShadow}`}
                    style={{ aspectRatio: `${Math.max(aspect / 2, 0.55)}` }}
                  >
                    {shouldLoadImage ? (
                      <div
                        className={`absolute inset-y-0 w-[200%] ${
                          side === "left" ? "left-0" : "right-0"
                        }`}
                      >
                        <Image
                          src={withBasePath(image.src)}
                          alt={side === "left" ? alt : ""}
                          fill
                          loading="lazy"
                          sizes="200vw"
                          onLoad={(event) => handleNaturalSize(event.currentTarget)}
                          className={`object-cover ${
                            side === "left" ? "object-left" : "object-right"
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-white/[0.03]" />
                    )}
                  </div>
                ))}
              </div>
              <div
                className={`relative hidden w-full overflow-hidden sm:block ${frameShadow}`}
                style={{ aspectRatio: `${aspect}` }}
              >
                {shouldLoadImage ? (
                  <Image
                    src={withBasePath(image.src)}
                    alt={alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1400px) 94vw, 1400px"
                    onLoad={(event) => handleNaturalSize(event.currentTarget)}
                    className="object-contain object-center"
                  />
                ) : (
                  <div className="absolute inset-0 bg-white/[0.03]" />
                )}
              </div>
            </>
          ) : (
            <div
              className={`relative overflow-hidden ${frameShadow} ${
                matchRowHeight || caption ? "w-full" : "h-full w-full"
              }`}
              style={
                matchRowHeight || caption
                  ? { aspectRatio: `${aspect}` }
                  : undefined
              }
            >
              {shouldLoadImage ? (
                <Image
                  src={withBasePath(image.src)}
                  alt={alt}
                  fill
                  loading="lazy"
                  sizes={
                    matchRowHeight
                      ? "(max-width: 640px) 94vw, 42vw"
                      : fillGrid
                        ? "(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                        : "(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 22rem"
                  }
                  onLoad={(event) => handleNaturalSize(event.currentTarget)}
                  className="object-contain object-center"
                />
              ) : (
                <div className="absolute inset-0 bg-white/[0.03]" />
              )}
            </div>
          )}

          <span
            aria-hidden
            className="pointer-events-none absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-black/60 text-purple-light opacity-0 transition-opacity duration-hover ease-editorial group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <Maximize2 className="h-3.5 w-3.5 stroke-[1.8]" />
          </span>
        </button>

        {caption && (
          <figcaption className="mt-3 w-full">
            <p className="font-display text-xs uppercase tracking-[0.16em] text-white/70 md:text-sm">
              {caption}
            </p>
          </figcaption>
        )}
      </motion.figure>

      {portalReady &&
        isExpanded &&
        createPortal(
          <ExpandedOverlay
            image={image}
            alt={alt}
            aspect={aspect}
            onClose={onCollapse}
          />,
          document.body,
        )}
    </>
  );
}
