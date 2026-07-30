"use client";

import GalleryExpandBackdrop from "@/components/GalleryExpandBackdrop";
import GalleryExpandableCell from "@/components/GalleryExpandableCell";
import type { GalleryImage } from "@/data/gallery";
import {
  findGalleryMatch,
  getGalleryHighlight,
  useScrollToGalleryMatch,
  type ActiveImageContext,
} from "@/lib/gallery-highlight";
import { useGalleryExpand } from "@/lib/use-gallery-expand";
import { useEffect, useMemo } from "react";

type MixedMediaGridProps = {
  images: GalleryImage[];
  activeImage?: ActiveImageContext | null;
  focusNonce?: number;
};

export default function MixedMediaGrid({
  images,
  activeImage = null,
  focusNonce = 0,
}: MixedMediaGridProps) {
  const {
    hoveredId,
    setHoveredId,
    expandedId,
    expand,
    collapse,
    isExpanded,
  } = useGalleryExpand();
  const hasRiverFocus = activeImage !== null;
  const riverTargetId = useMemo(
    () =>
      activeImage
        ? (findGalleryMatch(images, activeImage)?.id ?? null)
        : null,
    [activeImage, images],
  );
  const setItemRef = useScrollToGalleryMatch(activeImage, images, focusNonce);

  useEffect(() => {
    if (!riverTargetId || focusNonce === 0) return;
    const timeout = window.setTimeout(() => expand(riverTargetId), 100);
    return () => window.clearTimeout(timeout);
  }, [riverTargetId, focusNonce, expand]);

  return (
    <section className="relative w-full">
      <GalleryExpandBackdrop open={isExpanded} onClose={collapse} />

      <div className="px-5 py-6 md:px-8 md:py-8 lg:px-12">
        <p className="font-display text-[10px] uppercase tracking-[0.24em] text-white/40 md:text-[11px]">
          Gallery
        </p>
        <h2 className="mt-2 font-display text-lg uppercase tracking-[0.12em] text-white md:text-xl md:tracking-[0.14em]">
          MIXED MEDIA
        </h2>
        <p className="mt-1.5 font-sans text-xs font-light tracking-[0.04em] text-white/45 md:text-sm">
          {images.length} work{images.length === 1 ? "" : "s"}
          {hasRiverFocus && activeImage
            ? ` · ${activeImage.name.toLowerCase()}`
            : ""}
        </p>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-12 px-4 pb-16 sm:gap-x-10 sm:gap-y-14 md:gap-x-14 md:gap-y-16 md:px-8 md:pb-24 lg:justify-start lg:px-12">
        {images.map((image, index) => {
          const highlight =
            hasRiverFocus && riverTargetId
              ? image.id === riverTargetId
                ? "primary"
                : "recede"
              : hasRiverFocus
                ? getGalleryHighlight(image, activeImage)
                : "primary";

          return (
            <GalleryExpandableCell
              key={image.id}
              image={image}
              index={index}
              isHovered={hoveredId === image.id}
              isExpanded={expandedId === image.id}
              hasExpandedSibling={
                expandedId !== null && expandedId !== image.id
              }
              hasRiverFocus={hasRiverFocus}
              highlight={highlight}
              setItemRef={setItemRef}
              onMouseEnter={() => setHoveredId(image.id)}
              onMouseLeave={() => setHoveredId(null)}
              onExpand={() => expand(image.id)}
              onCollapse={collapse}
            />
          );
        })}
      </div>
    </section>
  );
}
