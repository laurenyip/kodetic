"use client";

import GalleryExpandBackdrop from "@/components/GalleryExpandBackdrop";
import GalleryExpandableCell from "@/components/GalleryExpandableCell";
import type { GalleryImage } from "@/data/gallery";
import type { PhotoRiverCategory } from "@/data/images";
import {
  getGalleryHighlight,
  useScrollToGalleryMatch,
  type ActiveImageContext,
} from "@/lib/gallery-highlight";
import { useGalleryExpand } from "@/lib/use-gallery-expand";
import { panelTransition } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";

type GalleryGridProps = {
  images: GalleryImage[];
  filter?: PhotoRiverCategory | null;
  activeImage?: ActiveImageContext | null;
};

const FILTER_LABELS: Record<PhotoRiverCategory, string> = {
  commercial: "COMMERCIAL",
  editorial: "EDITORIAL",
  art: "ART",
  cosplay: "COSPLAY",
  "mixed-media": "MIXED MEDIA",
};

export default function GalleryGrid({
  images,
  filter = null,
  activeImage = null,
}: GalleryGridProps) {
  const {
    hoveredId,
    setHoveredId,
    expandedId,
    expand,
    collapse,
    isExpanded,
  } = useGalleryExpand();

  const visibleImages = filter
    ? images.filter((image) => image.category === filter)
    : images;

  const hasRiverFocus = activeImage !== null;
  const setItemRef = useScrollToGalleryMatch(activeImage, visibleImages);

  return (
    <section className="w-full bg-black">
      <GalleryExpandBackdrop open={isExpanded} onClose={collapse} />
      <div className="px-4 py-5 md:px-6 md:py-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/45 md:text-[12px]">
          Photography
        </p>
        <h2 className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-white md:text-base">
          {filter ? FILTER_LABELS[filter] : "ALL WORK"}
        </h2>
        <p className="mt-1 text-[11px] tracking-[0.06em] text-white/50 md:text-[12px]">
          {visibleImages.length} image{visibleImages.length === 1 ? "" : "s"}
          {hasRiverFocus && activeImage
            ? ` · ${activeImage.name.toLowerCase()}`
            : ""}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter ?? "all"}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={panelTransition}
          className="grid grid-cols-1 bg-black sm:grid-cols-2 lg:grid-cols-3"
        >
          {visibleImages.map((image, index) => {
            const highlight = hasRiverFocus
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
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
