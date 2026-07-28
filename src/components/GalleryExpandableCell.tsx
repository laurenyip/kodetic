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
import { useEffect, useRef, useState } from "react";

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
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);

  const shouldLoadImage = inView || isExpanded || isHovered;
  const imageSrc = isExpanded && image.fullSrc ? image.fullSrc : image.src;
  const aspect = natural ? natural.w / natural.h : 4 / 5;

  useEffect(() => {
    if (!isExpanded || !figureRef.current) return;
    figureRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [isExpanded]);

  const riverStyles = hasRiverFocus
    ? GALLERY_HIGHLIGHT_STYLES[highlight]
    : GALLERY_HIGHLIGHT_STYLES.primary;

  const fadeWhileSiblingExpanded =
    hasExpandedSibling && !isExpanded
      ? { opacity: 0.08, filter: "brightness(0.35) saturate(0.15)", scale: 0.98 }
      : null;

  const subtleHover =
    isHovered && !isExpanded && !hasExpandedSibling
      ? { ...riverStyles, y: -4, scale: 1.01 }
      : null;

  const handleClick = () => {
    if (isExpanded) return;
    onExpand();
  };

  const handleCloseClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onCollapse();
  };

  const motionState =
    fadeWhileSiblingExpanded ?? subtleHover ?? riverStyles;

  const animateEntrance = index < 18 && !hasRiverFocus && !hasExpandedSibling;
  const note = image.note?.trim() ?? "";

  return (
    <motion.figure
      ref={(element) => {
        figureRef.current = element;
        setItemRef(image.id, element);
      }}
      initial={animateEntrance ? { opacity: 0, y: 16 } : false}
      animate={motionState}
      transition={{
        opacity: panelTransition,
        filter: panelTransition,
        scale: isHovered && !isExpanded ? hoverTransition : panelTransition,
        y: hoverTransition,
        delay: animateEntrance ? Math.min(index * 0.02, 0.2) : 0,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      style={{
        aspectRatio: `${aspect}`,
        width: isExpanded
          ? `min(92vw, ${Math.round(Math.min(920, natural?.w ?? 920))}px)`
          : undefined,
      }}
      className={`group relative scroll-mt-32 cursor-crosshair bg-transparent ${
        isExpanded
          ? "z-50 max-h-[85vh] w-full max-w-[min(92vw,56rem)] justify-self-center"
          : "z-0 w-[min(100%,22rem)] sm:w-[min(100%,18rem)] md:w-[min(100%,20rem)] lg:w-[min(100%,22rem)]"
      } ${isHovered && !isExpanded ? "z-[5]" : ""} ${
        highlight === "primary" && hasRiverFocus && !isExpanded ? "z-10" : ""
      }`}
    >
      <div className="relative h-full w-full overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.55),0_0_40px_rgba(40,24,60,0.18)]">
        {shouldLoadImage ? (
          <Image
            src={withBasePath(imageSrc)}
            alt={image.name}
            fill
            loading="lazy"
            sizes={
              isExpanded
                ? "min(92vw, 900px)"
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

        {isExpanded && (
          <button
            type="button"
            data-interactive="true"
            aria-label="Close image"
            onClick={handleCloseClick}
            className="tap-target absolute right-2 top-2 z-40 flex h-10 w-10 items-center justify-center bg-black/75 font-display text-sm tracking-[0.18em] text-white/80 transition-colors duration-hover ease-editorial hover:text-red md:right-3 md:top-3 md:text-base"
          >
            X
          </button>
        )}
      </div>

      <figcaption
        className={`mt-3 max-w-[22rem] transition-opacity duration-hover ease-editorial ${
          isExpanded || isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="min-h-[1.25rem] font-sans text-sm font-light leading-relaxed tracking-[0.02em] text-white/55 md:text-[15px]">
          {note || "\u00A0"}
        </p>
      </figcaption>
    </motion.figure>
  );
}
