import type { GalleryImage } from "@/data/gallery";

/**
 * Dev-only worst-case data for stress-testing the galleries (?data=worst|empty|one|huge).
 * Never active in a production build. Keep it: it's the regression test for these grids.
 */
export function devImages(images: GalleryImage[], mode: string): GalleryImage[] {
  if (process.env.NODE_ENV !== "development") return images;
  if (mode === "empty") return [];
  if (mode === "one") return images.slice(0, 1);
  if (mode === "huge") {
    return Array.from({ length: 300 }, (_, i) => ({
      ...images[i % images.length],
      id: `huge-${i}`,
    }));
  }
  if (mode !== "worst") return images;

  return images.map((image, i) => {
    if (i === 0) {
      // A photo that 404s.
      return {
        ...image,
        src: "/images/does-not-exist.webp",
        fullSrc: "/images/does-not-exist.webp",
        alt: undefined,
      };
    }
    if (i === 1) {
      // A long credit in the caption slot.
      return {
        ...image,
        note: "Styled by Aleksandra Wiśniewska-Kowalczyk for the Get Thrifty Fashion Show 2026, photographed at the Museum of Anthropology, Vancouver",
      };
    }
    if (i === 2) {
      // A 4:1 panorama dropped into a portrait grid slot.
      return {
        ...image,
        src: "/images/grid/landing/landing-margiela-spread.webp",
        fullSrc: "/images/landing/landing-margiela-spread.webp",
        aspect: 4,
      };
    }
    if (i === 3) {
      // No name and no alt text.
      return { ...image, name: "", alt: undefined };
    }
    return image;
  });
}
