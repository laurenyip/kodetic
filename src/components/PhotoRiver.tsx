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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

export type PhotoRiverImageInfo = Pick<
  PhotoRiverImage,
  "name" | "description" | "category" | "fullSrc"
>;

type PhotoRiverProps = {
  onImageHover?: (info: PhotoRiverImageInfo | null) => void;
  onImageSelect?: (info: PhotoRiverImageInfo) => void;
};

const SCROLL_VELOCITY = 18;

const RiverFrame = memo(function RiverFrame({
  image,
  isHovered,
  isSelected,
  onHoverStart,
  onHoverEnd,
  onSelect,
}: {
  image: PhotoRiverImage;
  isHovered: boolean;
  isSelected: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      data-interactive="true"
      className={`relative aspect-[4/3] h-full w-auto shrink-0 origin-center overflow-hidden border-0 bg-transparent p-0 transition-transform duration-hover ease-editorial ${
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBasePath(image.src)}
        alt=""
        width={112}
        height={84}
        decoding="async"
        loading="eager"
        draggable={false}
        className="pointer-events-none block h-full w-full object-cover"
      />
    </button>
  );
});

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

  // Two copies for a seamless loop — same URLs, browser cache serves the second set.
  const duplicatedImages = useMemo(
    () => [...photoRiverImages, ...photoRiverImages],
    [],
  );

  // Warm the tiny thumbs once so the rotating strip never "loads" mid-scroll.
  useEffect(() => {
    for (const image of photoRiverImages) {
      const preload = new window.Image();
      preload.src = withBasePath(image.src);
      preload.decode?.().catch(() => {});
    }
  }, []);

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

  const toInfo = useCallback(
    (image: PhotoRiverImage): PhotoRiverImageInfo => ({
      name: image.name,
      description: image.description,
      category: image.category,
      fullSrc: image.fullSrc,
    }),
    [],
  );

  const handleHoverStart = useCallback(
    (image: PhotoRiverImage, key: string) => {
      setHoveredKey(key);
      setIsPaused(true);
      onImageHover?.(toInfo(image));
    },
    [onImageHover, toInfo],
  );

  const handleHoverEnd = useCallback(() => {
    setHoveredKey(null);
    setIsPaused(false);
    onImageHover?.(null);
  }, [onImageHover]);

  const handleSelect = useCallback(
    (image: PhotoRiverImage) => {
      setSelectedId(image.id);
      onImageSelect?.(toInfo(image));
    },
    [onImageSelect, toInfo],
  );

  return (
    <section className="w-full overflow-x-clip overflow-y-visible bg-transparent">
      <div className="h-[1.05cm] w-full touch-pan-x overflow-x-clip overflow-y-visible md:h-[1.2cm]">
        <motion.div
          ref={trackRef}
          className="flex h-full w-max items-stretch bg-transparent"
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
