"use client";

import type { GalleryImage } from "@/data/gallery";
import {
  GALLERY_HIGHLIGHT_STYLES,
  type GalleryHighlight,
} from "@/lib/gallery-highlight";
import { hoverTransition, panelTransition } from "@/lib/motion";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

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

function getExpandedDimensions(
  collapsed: { w: number; h: number },
  natural: { w: number; h: number } | null,
) {
  const { w, h } = collapsed;
  if (!w || !h) return null;

  const nw = natural?.w ?? 4;
  const nh = natural?.h ?? 3;
  const imgAspect = nw / nh;

  if (w >= h) {
    const expandedWidth = Math.round(h * imgAspect);
    if (expandedWidth >= w) {
      return { lockWidth: false, width: expandedWidth, height: h };
    }

    return { lockWidth: true, width: w, height: Math.round(w / imgAspect) };
  }

  const expandedHeight = Math.round(w / imgAspect);
  if (expandedHeight >= h) {
    return { lockWidth: true, width: w, height: expandedHeight };
  }

  return { lockWidth: false, width: Math.round(h * imgAspect), height: h };
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
  const [collapsedSize, setCollapsedSize] = useState({ w: 0, h: 0 });
  const [naturalSize, setNaturalSize] = useState<{
    w: number;
    h: number;
  } | null>(null);

  const expandedDimensions = useMemo(
    () =>
      isExpanded ? getExpandedDimensions(collapsedSize, naturalSize) : null,
    [isExpanded, collapsedSize, naturalSize],
  );

  useEffect(() => {
    if (!isExpanded || !figureRef.current) return;
    figureRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [isExpanded, expandedDimensions]);

  const riverStyles = hasRiverFocus
    ? GALLERY_HIGHLIGHT_STYLES[highlight]
    : GALLERY_HIGHLIGHT_STYLES.primary;

  const fadeWhileSiblingExpanded =
    hasExpandedSibling && !isExpanded
      ? { opacity: 0.05, filter: "brightness(0.3) saturate(0.1)", scale: 0.99 }
      : null;

  const subtleHover =
    isHovered && !isExpanded && !hasExpandedSibling
      ? { ...riverStyles, scale: 1.01 }
      : null;

  const handleClick = () => {
    if (isExpanded) return;

    if (figureRef.current) {
      setCollapsedSize({
        w: figureRef.current.offsetWidth,
        h: figureRef.current.offsetHeight,
      });
    }
    onExpand();
  };

  const handleCloseClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onCollapse();
  };

  const motionState =
    fadeWhileSiblingExpanded ?? subtleHover ?? riverStyles;

  return (
    <motion.figure
      layout
      ref={(element) => {
        figureRef.current = element;
        setItemRef(image.id, element);
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={motionState}
      transition={{
        layout: panelTransition,
        opacity: panelTransition,
        filter: panelTransition,
        scale: isHovered && !isExpanded ? hoverTransition : panelTransition,
        delay: hasRiverFocus || hasExpandedSibling ? 0 : Math.min(index * 0.02, 0.3),
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      style={
        isExpanded && expandedDimensions
          ? {
              width: expandedDimensions.width,
              height: expandedDimensions.height,
            }
          : undefined
      }
      className={`group relative scroll-mt-28 cursor-crosshair overflow-hidden bg-black ${
        isExpanded
          ? expandedDimensions?.lockWidth
            ? "z-50 w-fit max-w-full justify-self-start"
            : "z-50 col-span-full w-fit max-w-full justify-self-start"
          : "col-span-1 aspect-[4/3]"
      } ${
        isHovered && !isExpanded ? "z-[5]" : ""
      } ${
        highlight === "primary" && hasRiverFocus && !isExpanded ? "z-10" : ""
      }`}
    >
      <Image
        src={image.src}
        alt={image.name}
        fill
        sizes={
          isExpanded && expandedDimensions
            ? `${expandedDimensions.width}px`
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        }
        onLoadingComplete={(img) => {
          setNaturalSize({
            w: img.naturalWidth,
            h: img.naturalHeight,
          });
        }}
        className={`transition-transform duration-hover ease-editorial ${
          isExpanded
            ? "object-contain"
            : "object-cover"
        }`}
      />

      {isExpanded && (
        <button
          type="button"
          data-interactive="true"
          aria-label="Close image"
          onClick={handleCloseClick}
          className="tap-target absolute right-2 top-2 z-40 flex h-9 w-9 items-center justify-center bg-black/70 text-[11px] uppercase tracking-[0.22em] text-white/75 transition-colors duration-hover ease-editorial hover:text-red md:right-3 md:top-3"
        >
          X
        </button>
      )}

      <figcaption
        className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 py-5 transition-opacity duration-hover ease-editorial ${
          isExpanded
            ? "opacity-100"
            : isHovered
              ? "opacity-70"
              : highlight === "recede"
                ? "opacity-0"
                : "opacity-0"
        }`}
      >
        <p className="text-[11px] uppercase tracking-[0.18em] text-white md:text-[12px]">
          {image.name}
        </p>
        <p className="mt-1 text-[11px] tracking-[0.06em] text-white/60 md:text-[12px]">
          {image.description}
        </p>
      </figcaption>
    </motion.figure>
  );
}
