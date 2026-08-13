"use client";

import GalleryExpandBackdrop from "@/components/GalleryExpandBackdrop";
import GalleryExpandableCell from "@/components/GalleryExpandableCell";
import type { GalleryImage } from "@/data/gallery";
import type { PhotoRiverCategory } from "@/data/images";
import { useGalleryExpand } from "@/lib/use-gallery-expand";
import { useMemo } from "react";

type GalleryGridProps = {
  images: GalleryImage[];
  category: PhotoRiverCategory;
};

const SECTION_ORDER: Partial<Record<PhotoRiverCategory, string[]>> = {
  commercial: ["MEC", "GET THRIFTY FASHION SHOW 2026"],
  creative: ["CREATIVE WORK", "COSPLAY"],
};

/** PDF page layouts: most boards are 5 across; MEC is 3-up; Creative Work is 6-up. */
const SECTION_COLUMNS: Record<string, number> = {
  MEC: 3,
  "GET THRIFTY FASHION SHOW 2026": 4,
  "CREATIVE WORK": 6,
};

function groupByName(images: GalleryImage[], order?: string[]) {
  const groups = new Map<string, GalleryImage[]>();
  for (const image of images) {
    const key = image.name.trim() || "Untitled";
    const list = groups.get(key) ?? [];
    list.push(image);
    groups.set(key, list);
  }

  const entries = Array.from(groups.entries()).map(([title, items]) => ({
    title,
    items,
  }));

  if (!order?.length) return entries;

  return entries.sort((a, b) => {
    const ai = order.indexOf(a.title);
    const bi = order.indexOf(b.title);
    const av = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
    const bv = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
    return av - bv;
  });
}

function columnsClass(columns: number) {
  if (columns === 1) return "grid-cols-1";
  if (columns === 2) return "grid-cols-1 sm:grid-cols-2";
  if (columns === 3) return "grid-cols-1 sm:grid-cols-3";
  if (columns === 4) return "grid-cols-2 md:grid-cols-4";
  if (columns === 6) return "grid-cols-2 sm:grid-cols-3 md:grid-cols-6";
  return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
}

function PhotoGrid({
  images,
  columns = 5,
  matchHeight = false,
  hoveredId,
  setHoveredId,
  expandedId,
  expand,
  collapse,
  startIndex = 0,
}: {
  images: GalleryImage[];
  columns?: number;
  matchHeight?: boolean;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  expandedId: string | null;
  expand: (id: string) => void;
  collapse: () => void;
  startIndex?: number;
}) {
  return (
    <div
      className={
        matchHeight
          ? "mx-auto flex w-full max-w-[1500px] flex-col items-stretch gap-y-6 px-4 py-6 sm:flex-row sm:flex-nowrap sm:items-start sm:gap-x-4 sm:gap-y-0 md:gap-x-5 md:px-6 lg:px-8"
          : `mx-auto grid w-full max-w-[1500px] items-start justify-items-center gap-x-3 gap-y-6 px-4 py-6 sm:gap-x-4 sm:gap-y-8 md:gap-x-5 md:gap-y-10 md:px-6 lg:px-8 ${columnsClass(columns)}`
      }
    >
      {images.map((image, index) => (
        <GalleryExpandableCell
          key={image.id}
          image={image}
          index={startIndex + index}
          isHovered={hoveredId === image.id}
          isExpanded={expandedId === image.id}
          hasExpandedSibling={expandedId !== null && expandedId !== image.id}
          fillGrid
          matchRowHeight={matchHeight}
          onMouseEnter={() => setHoveredId(image.id)}
          onMouseLeave={() => setHoveredId(null)}
          onExpand={() => expand(image.id)}
          onCollapse={collapse}
        />
      ))}
    </div>
  );
}

export default function GalleryGrid({ images, category }: GalleryGridProps) {
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

  const homeLayout = useMemo(() => {
    if (category !== "home") return null;
    const spread = visibleImages.find((image) =>
      /margiela-spread/i.test(image.id),
    );
    const portraits = visibleImages.filter(
      (image) => !/margiela-spread/i.test(image.id),
    );
    return { portraits, spread: spread ?? null };
  }, [category, visibleImages]);

  const sections = useMemo(() => {
    if (category === "commercial" || category === "creative") {
      return groupByName(visibleImages, SECTION_ORDER[category]);
    }
    return null;
  }, [category, visibleImages]);

  return (
    <section className="relative w-full">
      <GalleryExpandBackdrop open={isExpanded} onClose={collapse} />

      <div key={category} className="pt-6 pb-16 md:pt-8 md:pb-24">
        {homeLayout ? (
          <div className="flex flex-col gap-8 md:gap-10">
            <PhotoGrid
              images={homeLayout.portraits}
              columns={5}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              expandedId={expandedId}
              expand={expand}
              collapse={collapse}
            />
            {homeLayout.spread && (
              <div className="mx-auto w-full max-w-[1500px] px-4 md:px-6 lg:px-8">
                <GalleryExpandableCell
                  image={homeLayout.spread}
                  index={homeLayout.portraits.length}
                  isHovered={hoveredId === homeLayout.spread.id}
                  isExpanded={expandedId === homeLayout.spread.id}
                  hasExpandedSibling={
                    expandedId !== null && expandedId !== homeLayout.spread.id
                  }
                  fillGrid
                  fullRow
                  onMouseEnter={() => setHoveredId(homeLayout.spread!.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onExpand={() => expand(homeLayout.spread!.id)}
                  onCollapse={collapse}
                />
              </div>
            )}
          </div>
        ) : sections ? (
          <div className="flex flex-col gap-16 md:gap-24">
            {sections.map((section, sectionIndex) => (
              <section key={section.title} className="scroll-mt-36">
                <div className="mx-auto max-w-[1500px] border-b border-white/10 px-5 pb-4 text-center md:px-8">
                  <h3 className="font-display text-base uppercase tracking-[0.12em] text-white md:text-lg">
                    {section.title}
                  </h3>
                </div>
                <PhotoGrid
                  images={section.items}
                  columns={SECTION_COLUMNS[section.title] ?? 5}
                  matchHeight={section.title === "MEC"}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  expandedId={expandedId}
                  expand={expand}
                  collapse={collapse}
                  startIndex={sectionIndex * 12}
                />
              </section>
            ))}
          </div>
        ) : (
          <PhotoGrid
            images={visibleImages}
            columns={5}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            expandedId={expandedId}
            expand={expand}
            collapse={collapse}
          />
        )}
      </div>
    </section>
  );
}
