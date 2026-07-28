"use client";

import type { GalleryImage } from "@/data/gallery";
import type { PhotoRiverCategory } from "@/data/images";
import { useCallback, useEffect, useRef } from "react";

export type ActiveImageContext = {
  name: string;
  description: string;
  category: PhotoRiverCategory;
  /** Exact gallery asset path — preferred match target from the river */
  fullSrc?: string;
};

export type GalleryHighlight = "primary" | "recede";

function normalizeName(name: string) {
  return name.trim().toUpperCase().replace(/\s+/g, " ");
}

export function isGalleryMatch(
  image: GalleryImage,
  active: ActiveImageContext | null,
): boolean {
  if (!active) return false;

  if (active.fullSrc) {
    return image.fullSrc === active.fullSrc || image.src === active.fullSrc;
  }

  return normalizeName(image.name) === normalizeName(active.name);
}

export function getGalleryHighlight(
  image: GalleryImage,
  active: ActiveImageContext | null,
): GalleryHighlight {
  if (!active) return "primary";
  return isGalleryMatch(image, active) ? "primary" : "recede";
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

function findMatch(
  images: GalleryImage[],
  active: ActiveImageContext,
): GalleryImage | undefined {
  if (active.fullSrc) {
    const exact = images.find(
      (image) =>
        image.fullSrc === active.fullSrc || image.src === active.fullSrc,
    );
    if (exact) return exact;
  }

  const target = normalizeName(active.name);
  return images.find((image) => normalizeName(image.name) === target);
}

function targetKeyFor(active: ActiveImageContext, nonce: number) {
  return `${active.fullSrc ?? normalizeName(active.name)}::${nonce}`;
}

export function useScrollToGalleryMatch(
  activeImage: ActiveImageContext | null,
  images: GalleryImage[],
  /** Bumps on every river click so the same frame can re-trigger scroll */
  focusNonce = 0,
) {
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const pendingIdRef = useRef<string | null>(null);
  const lastTargetRef = useRef<string | null>(null);

  const scrollToElement = useCallback((element: HTMLElement) => {
    window.requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  useEffect(() => {
    if (!activeImage) {
      pendingIdRef.current = null;
      lastTargetRef.current = null;
      return;
    }

    const key = targetKeyFor(activeImage, focusNonce);
    if (lastTargetRef.current === key) return;

    const match = findMatch(images, activeImage);
    if (!match) {
      pendingIdRef.current = null;
      return;
    }

    pendingIdRef.current = match.id;

    const element = itemRefs.current.get(match.id);
    if (!element) {
      // Grid may still be mounting after a view/filter switch — wait for setItemRef
      return;
    }

    lastTargetRef.current = key;
    pendingIdRef.current = null;
    const timeout = window.setTimeout(() => scrollToElement(element), 60);
    return () => window.clearTimeout(timeout);
  }, [activeImage, images, focusNonce, scrollToElement]);

  const setItemRef = useCallback(
    (id: string, element: HTMLElement | null) => {
      if (element) {
        itemRefs.current.set(id, element);

        if (pendingIdRef.current === id && activeImage) {
          const key = targetKeyFor(activeImage, focusNonce);
          lastTargetRef.current = key;
          pendingIdRef.current = null;
          scrollToElement(element);
        }
      } else {
        itemRefs.current.delete(id);
      }
    },
    [activeImage, focusNonce, scrollToElement],
  );

  return setItemRef;
}
