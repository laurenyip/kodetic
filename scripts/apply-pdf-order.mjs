/**
 * Reorder src/data/gallery.ts arrays to match scripts/pdf-image-order.json.
 * Maps original kit filenames → existing webp gallery entries by slug.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(".");
const ORDER = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts/pdf-image-order.json"), "utf8"),
);
const GALLERY_TS = path.join(ROOT, "src/data/gallery.ts");

function sanitizeBaseName(filename) {
  const ext = path.extname(filename).toLowerCase();
  const base = path.basename(filename, path.extname(filename));
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
  return `${slug || "image"}${ext === ".jpeg" ? ".jpg" : ext}`;
}

function slugStem(filename) {
  return sanitizeBaseName(filename).replace(/\.[^.]+$/, "");
}

function nameFor(file, key) {
  if (key === "commercial") {
    if (/mec/i.test(file)) return "MEC";
    if (/thrifty/i.test(file)) return "GET THRIFTY FASHION SHOW 2026";
    return "CLIENT WORK";
  }
  if (key === "cosplay") return "COSPLAY";
  if (key === "creative") return "CREATIVE WORK";
  if (key === "miscellaneous") return "MISCELLANEOUS";
  if (key === "mixed-media") return "MIXED MEDIA";
  if (key === "landing") return "LANDING";
  return "WORK";
}

function descriptionFor(key) {
  const map = {
    landing: "Home selection",
    "mixed-media": "Mixed media",
    commercial: "Client work",
    creative: "Creative work",
    cosplay: "Cosplay",
    miscellaneous: "Miscellaneous",
  };
  return map[key] || "";
}

function categoryFor(key) {
  if (key === "landing") return "home";
  if (key === "cosplay") return "creative";
  return key;
}

function destKeyFor(key) {
  if (key === "landing") return "landing";
  if (key === "commercial") return "commercial";
  if (key === "cosplay" || key === "creative") return "creative";
  if (key === "miscellaneous") return "miscellaneous";
  if (key === "mixed-media") return "mixed-media";
  return key;
}

function buildEntries(key, items) {
  const category = categoryFor(key);
  const dest = destKeyFor(key);
  const entries = [];
  const seen = new Set();

  for (const item of items) {
    if (!item.file || !item.src) continue;
    const stem = slugStem(item.file);
    if (seen.has(stem)) continue;
    seen.add(stem);

    const webp = `${stem}.webp`;
    entries.push({
      id: `${category}-${stem}`,
      src: `/images/grid/${dest}/${webp}`,
      fullSrc: `/images/${dest}/${webp}`,
      name: nameFor(item.file, key),
      description: descriptionFor(key),
      category,
    });
  }
  return entries;
}

function main() {
  const landing = buildEntries("landing", ORDER.landing || []);
  const mixedMedia = buildEntries("mixed-media", ORDER["mixed-media"] || []);
  const commercial = buildEntries("commercial", ORDER.commercial || []);
  const creativeWork = buildEntries("creative", ORDER.creative || []);
  const cosplay = buildEntries("cosplay", ORDER.cosplay || []);
  const miscellaneous = buildEntries(
    "miscellaneous",
    ORDER.miscellaneous || [],
  );

  // Creative category: creative work first (PDF pp.7–8), then cosplay (p.6)
  const gallery = [...commercial, ...creativeWork, ...cosplay, ...miscellaneous];

  const galleryTs = `export type GalleryCategory =
  | "home"
  | "commercial"
  | "creative"
  | "miscellaneous"
  | "mixed-media";

export type GalleryImage = {
  id: string;
  src: string;
  fullSrc?: string;
  name: string;
  description: string;
  /** Longer hover/expand note — filled later by Ezra; blank for now */
  note?: string;
  category: GalleryCategory;
};

export const landingImages: GalleryImage[] = ${JSON.stringify(landing, null, 2)};

export const galleryImages: GalleryImage[] = ${JSON.stringify(gallery, null, 2)};

export const mixedMediaImages: GalleryImage[] = ${JSON.stringify(mixedMedia, null, 2)};
`;

  fs.writeFileSync(GALLERY_TS, galleryTs);
  console.log("Updated", GALLERY_TS);
  console.log({
    landing: landing.length,
    mixedMedia: mixedMedia.length,
    commercial: commercial.length,
    creativeWork: creativeWork.length,
    cosplay: cosplay.length,
    miscellaneous: miscellaneous.length,
    galleryTotal: gallery.length,
  });

  // Quick verify files exist
  let missing = 0;
  for (const img of [...landing, ...gallery, ...mixedMedia]) {
    const full = path.join(ROOT, "public", img.fullSrc.replace(/^\//, ""));
    const grid = path.join(ROOT, "public", img.src.replace(/^\//, ""));
    if (!fs.existsSync(full)) {
      console.warn("missing full", img.fullSrc);
      missing++;
    }
    if (!fs.existsSync(grid)) {
      console.warn("missing grid", img.src);
      missing++;
    }
  }
  console.log(missing === 0 ? "All image paths exist." : `${missing} missing paths`);
}

main();
