"use client";

import ClientsCarousel from "@/components/ClientsCarousel";
import GalleryExpandBackdrop from "@/components/GalleryExpandBackdrop";
import GalleryExpandableCell from "@/components/GalleryExpandableCell";
import type { GalleryImage } from "@/data/gallery";
import type { PhotoRiverCategory } from "@/data/images";
import {
  findGalleryMatch,
  getGalleryHighlight,
  useScrollToGalleryMatch,
  type ActiveImageContext,
} from "@/lib/gallery-highlight";
import { useGalleryExpand } from "@/lib/use-gallery-expand";
import { useEffect, useMemo } from "react";

type GalleryGridProps = {
  images: GalleryImage[];
  category: PhotoRiverCategory;
  activeImage?: ActiveImageContext | null;
  focusNonce?: number;
};

const CATEGORY_LABELS: Record<PhotoRiverCategory, string> = {
  commercial: "CLIENT WORK",
  editorial: "EDITORIAL",
  art: "ART",
  cosplay: "COSPLAY",
  "mixed-media": "MIXED MEDIA",
};

function groupByName(images: GalleryImage[]) {
  const groups = new Map<string, GalleryImage[]>();
  for (const image of images) {
    const key = image.name.trim() || "Untitled";
    const list = groups.get(key) ?? [];
    list.push(image);
    groups.set(key, list);
  }
  return Array.from(groups.entries()).map(([title, items]) => ({ title, items }));
}

function FloatingRow({
  images,
  activeImage,
  hasRiverFocus,
  hoveredId,
  setHoveredId,
  expandedId,
  expand,
  collapse,
  setItemRef,
  focusNonce,
  riverTargetId,
  startIndex = 0,
}: {
  images: GalleryImage[];
  activeImage: ActiveImageContext | null;
  hasRiverFocus: boolean;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  expandedId: string | null;
  expand: (id: string) => void;
  collapse: () => void;
  setItemRef: (id: string, element: HTMLElement | null) => void;
  focusNonce: number;
  riverTargetId: string | null;
  startIndex?: number;
}) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-12 px-4 py-6 sm:gap-x-10 sm:gap-y-14 md:gap-x-14 md:gap-y-16 md:px-8 lg:justify-start lg:px-12">
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
            index={startIndex + index}
            isHovered={hoveredId === image.id}
            isExpanded={expandedId === image.id}
            hasExpandedSibling={expandedId !== null && expandedId !== image.id}
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
  );
}

export default function GalleryGrid({
  images,
  category,
  activeImage = null,
  focusNonce = 0,
}: GalleryGridProps) {
  const {
    hoveredId,
    setHoveredId,
    expandedId,
    expand,
    collapse,
    isExpanded,
  } = useGalleryExpand();

  const visibleImages = useMemo(
    () => images.filter((image) => image.category === category),
    [images, category],
  );

  const clientSections = useMemo(
    () => (category === "commercial" ? groupByName(visibleImages) : null),
    [category, visibleImages],
  );

  const hasRiverFocus = activeImage !== null;
  const riverTargetId = useMemo(
    () =>
      activeImage
        ? (findGalleryMatch(visibleImages, activeImage)?.id ?? null)
        : null,
    [activeImage, visibleImages],
  );
  const setItemRef = useScrollToGalleryMatch(
    activeImage,
    visibleImages,
    focusNonce,
  );

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
          {CATEGORY_LABELS[category]}
        </h2>
        <p className="mt-1.5 font-sans text-xs font-light tracking-[0.04em] text-white/45 md:text-sm">
          {visibleImages.length} work{visibleImages.length === 1 ? "" : "s"}
          {hasRiverFocus && activeImage
            ? ` · ${activeImage.name.toLowerCase()}`
            : ""}
        </p>
      </div>

      {category === "commercial" && <ClientsCarousel />}

      <div key={category} className="pb-16 md:pb-24">
          {clientSections ? (
            <div className="flex flex-col gap-16 md:gap-24">
              {clientSections.map((section, sectionIndex) => (
                <section key={section.title} className="scroll-mt-36">
                  <div className="border-b border-white/10 px-5 pb-4 md:px-8 lg:px-12">
                    <p className="font-display text-[11px] uppercase tracking-[0.28em] text-white/35 md:text-xs">
                      Client
                    </p>
                    <h3 className="mt-1.5 font-display text-base uppercase tracking-[0.12em] text-white md:text-lg">
                      {section.title}
                    </h3>
                  </div>
                  <FloatingRow
                    images={section.items}
                    activeImage={activeImage}
                    hasRiverFocus={hasRiverFocus}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                    expandedId={expandedId}
                    expand={expand}
                    collapse={collapse}
                    setItemRef={setItemRef}
                    focusNonce={focusNonce}
                    riverTargetId={riverTargetId}
                    startIndex={sectionIndex * 12}
                  />
                </section>
              ))}
            </div>
          ) : (
            <FloatingRow
              images={visibleImages}
              activeImage={activeImage}
              hasRiverFocus={hasRiverFocus}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              expandedId={expandedId}
              expand={expand}
              collapse={collapse}
              setItemRef={setItemRef}
              focusNonce={focusNonce}
              riverTargetId={riverTargetId}
            />
          )}
      </div>
    </section>
  );
}
