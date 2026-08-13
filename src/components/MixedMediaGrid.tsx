"use client";

import GalleryExpandBackdrop from "@/components/GalleryExpandBackdrop";
import GalleryExpandableCell from "@/components/GalleryExpandableCell";
import type { GalleryImage } from "@/data/gallery";
import { useGalleryExpand } from "@/lib/use-gallery-expand";

type MixedMediaGridProps = {
  images: GalleryImage[];
};

type LayoutRow = {
  columns: number;
  images: GalleryImage[];
  full?: boolean;
};

function columnsClass(columns: number) {
  if (columns <= 1) return "grid-cols-1";
  if (columns === 2) return "grid-cols-1 sm:grid-cols-2";
  if (columns === 3) return "grid-cols-1 sm:grid-cols-3";
  if (columns === 4) return "grid-cols-2 md:grid-cols-4";
  return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
}

function toRows(images: GalleryImage[]): LayoutRow[] {
  const rows: LayoutRow[] = [];

  for (const image of images) {
    if (image.row === "full") {
      rows.push({ columns: 1, images: [image], full: true });
      continue;
    }

    const columns = typeof image.row === "number" ? image.row : 5;
    const last = rows[rows.length - 1];
    if (
      last &&
      !last.full &&
      last.columns === columns &&
      !image.rowStart
    ) {
      last.images.push(image);
    } else {
      rows.push({ columns, images: [image] });
    }
  }

  return rows;
}

export default function MixedMediaGrid({ images }: MixedMediaGridProps) {
  const {
    hoveredId,
    setHoveredId,
    expandedId,
    expand,
    collapse,
    isExpanded,
  } = useGalleryExpand();

  const rows = toRows(images);
  let indexOffset = 0;

  return (
    <section className="relative w-full">
      <GalleryExpandBackdrop open={isExpanded} onClose={collapse} />

      <div className="mx-auto w-full max-w-[1500px] px-5 md:px-8">
        <div className="flex flex-col gap-6 pt-6 pb-16 sm:gap-8 md:gap-10 md:pt-8 md:pb-24">
          {rows.map((row, rowIndex) => {
            const startIndex = indexOffset;
            indexOffset += row.images.length;
            return (
              <div
                key={`row-${rowIndex}`}
                className={`grid w-full items-start justify-items-stretch gap-x-4 gap-y-6 sm:gap-x-5 ${columnsClass(row.columns)}`}
              >
                {row.images.map((image, index) => (
                  <GalleryExpandableCell
                    key={image.id}
                    image={image}
                    index={startIndex + index}
                    isHovered={hoveredId === image.id}
                    isExpanded={expandedId === image.id}
                    hasExpandedSibling={
                      expandedId !== null && expandedId !== image.id
                    }
                    fillGrid
                    fullRow={row.full}
                    onMouseEnter={() => setHoveredId(image.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onExpand={() => expand(image.id)}
                    onCollapse={collapse}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
