"use client";

import type { GalleryImage } from "@/data/gallery";
import type { PhotoRiverCategory } from "@/data/images";
import { useCallback, useEffect, useRef } from "react";

export type ActiveImageContext = {
  name: string;
  description: string;
  category: PhotoRiverCategory;
};

export type GalleryHighlight = "primary" | "recede";

function normalizeName(name: string) {
  return name.trim().toUpperCase().replace(/\s+/g, " ");
}

export function getGalleryHighlight(
  image: GalleryImage,
  active: ActiveImageContext | null,
): GalleryHighlight {
  if (!active) return "primary";

  if (normalizeName(image.name) === normalizeName(active.name)) {
    return "primary";
  }

  return "recede";
}

export const GALLERY_HIGHLIGHT_STYLES = {
  primary: {
    opacity: 1,
    filter: "brightness(1) saturate(1)",
    scale: 1,
  },
  recede: {
    opacity: 0.06,
    filter: "brightness(0.35) saturate(0.08)",
    scale: 0.99,
  },
} as const;

export function useScrollToGalleryMatch(
  activeImage: ActiveImageContext | null,
  images: GalleryImage[],
) {
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const lastTargetRef = useRef<string | null>(null);

  useEffect(() => {
    if (!activeImage) {
      lastTargetRef.current = null;
      return;
    }

    const targetKey = normalizeName(activeImage.name);
    if (lastTargetRef.current === targetKey) return;

    const firstMatch = images.find(
      (image) => getGalleryHighlight(image, activeImage) === "primary",
    );

    if (!firstMatch) return;

    const element = itemRefs.current.get(firstMatch.id);
    if (!element) return;

    lastTargetRef.current = targetKey;

    const timeout = window.setTimeout(() => {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);

    return () => window.clearTimeout(timeout);
  }, [activeImage, images]);

  const setItemRef = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      itemRefs.current.set(id, element);
    } else {
      itemRefs.current.delete(id);
    }
  }, []);

  return setItemRef;
}
