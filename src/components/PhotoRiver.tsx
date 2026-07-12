"use client";

import {
  photoRiverImages,
  type PhotoRiverImage,
} from "@/data/images";
import { withBasePath } from "@/lib/base-path";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export type PhotoRiverImageInfo = Pick<
  PhotoRiverImage,
  "name" | "description" | "category"
>;

type PhotoRiverProps = {
  onImageHover?: (info: PhotoRiverImageInfo | null) => void;
  onImageSelect?: (info: PhotoRiverImageInfo) => void;
};

const SCROLL_VELOCITY = 18;

function RiverFrame({
  image,
  index,
  isHovered,
  isSelected,
  onHoverStart,
  onHoverEnd,
  onSelect,
}: {
  image: PhotoRiverImage;
  index: number;
  isHovered: boolean;
  isSelected: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onSelect: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      data-interactive="true"
      className={`relative aspect-[4/3] h-full w-auto shrink-0 origin-center overflow-hidden border-0 bg-black p-0 transition-transform duration-hover ease-editorial ${
        isHovered ? "z-10 scale-[1.06] brightness-110" : "scale-100"
      }`}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onClick={onSelect}
      onPointerDown={(event) => event.stopPropagation()}
      aria-label={image.name}
      aria-pressed={isSelected}
    >
      {!loaded && (
        <span className="absolute inset-0 bg-white/[0.04]">
          <span className="river-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </span>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBasePath(image.src)}
        alt={image.name}
        width={160}
        height={120}
        decoding="async"
        fetchPriority={index < 8 ? "high" : "low"}
        loading={index < 8 ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className={`block h-full w-full object-cover transition-opacity duration-300 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        draggable={false}
      />
    </button>
  );
}

export default function PhotoRiver({
  onImageHover,
  onImageSelect,
}: PhotoRiverProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const dragX = useMotionValue(0);
  const combinedX = useTransform(
    [x, dragX],
    ([scroll, drag]) => (scroll as number) + (drag as number),
  );

  const [loopWidth, setLoopWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const duplicatedImages = [...photoRiverImages, ...photoRiverImages];

  const measureLoop = useCallback(() => {
    if (!trackRef.current) return;
    setLoopWidth(trackRef.current.scrollWidth / 2);
  }, []);

  useEffect(() => {
    measureLoop();
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(measureLoop);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measureLoop]);

  useAnimationFrame((_, delta) => {
    if (isPaused || isDragging || loopWidth <= 0) return;

    let next = x.get() - (SCROLL_VELOCITY * delta) / 1000;
    if (next <= -loopWidth) {
      next += loopWidth;
    }
    x.set(next);
  });

  const toInfo = (image: PhotoRiverImage): PhotoRiverImageInfo => ({
    name: image.name,
    description: image.description,
    category: image.category,
  });

  const handleHoverStart = (image: PhotoRiverImage, key: string) => {
    setHoveredKey(key);
    setIsPaused(true);
    onImageHover?.(toInfo(image));
  };

  const handleHoverEnd = () => {
    setHoveredKey(null);
    setIsPaused(false);
    onImageHover?.(null);
  };

  const handleSelect = (image: PhotoRiverImage) => {
    setSelectedId(image.id);
    onImageSelect?.(toInfo(image));
  };

  return (
    <section className="w-full overflow-x-clip overflow-y-visible bg-black">
      <div className="h-[1cm] w-full touch-pan-x overflow-x-clip overflow-y-visible">
        <motion.div
          ref={trackRef}
          className="flex h-full w-max items-stretch bg-black"
          style={{ x: combinedX }}
          drag="x"
          dragElastic={0.05}
          dragMomentum={false}
          onDragStart={() => {
            setIsDragging(true);
            setIsPaused(true);
          }}
          onDragEnd={() => {
            const dragOffset = dragX.get();
            x.set(x.get() + dragOffset);
            dragX.set(0);
            setIsDragging(false);
            if (!hoveredKey) {
              setIsPaused(false);
            }
          }}
        >
          {duplicatedImages.map((image, index) => {
            const key = `${image.id}-${index}`;
            return (
              <RiverFrame
                key={key}
                image={image}
                index={index}
                isHovered={hoveredKey === key}
                isSelected={selectedId === image.id}
                onHoverStart={() => handleHoverStart(image, key)}
                onHoverEnd={handleHoverEnd}
                onSelect={() => handleSelect(image)}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
