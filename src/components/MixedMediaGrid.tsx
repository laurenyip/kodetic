"use client";

import GalleryExpandBackdrop from "@/components/GalleryExpandBackdrop";
import GalleryExpandableCell from "@/components/GalleryExpandableCell";
import type { GalleryImage } from "@/data/gallery";
import {
  getGalleryHighlight,
  useScrollToGalleryMatch,
  type ActiveImageContext,
} from "@/lib/gallery-highlight";
import { useGalleryExpand } from "@/lib/use-gallery-expand";
import { motion } from "framer-motion";

type MixedMediaGridProps = {
  images: GalleryImage[];
  activeImage?: ActiveImageContext | null;
};

export default function MixedMediaGrid({
  images,
  activeImage = null,
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
  const setItemRef = useScrollToGalleryMatch(activeImage, images);

  return (
    <section className="w-full bg-black">
      <GalleryExpandBackdrop open={isExpanded} onClose={collapse} />
      <div className="px-4 py-5 md:px-6 md:py-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/45 md:text-[12px]">
          Mixed Media
        </p>
        <h2 className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-white md:text-base">
          COLLAGE & DIGITAL
        </h2>
        <p className="mt-1 text-[11px] tracking-[0.06em] text-white/50 md:text-[12px]">
          {images.length} works
          {hasRiverFocus && activeImage
            ? ` · ${activeImage.name.toLowerCase()}`
            : ""}
        </p>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 bg-black sm:grid-cols-2 lg:grid-cols-3"
      >
        {images.map((image, index) => {
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
    </section>
  );
}
