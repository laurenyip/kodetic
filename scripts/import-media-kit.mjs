import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const SOURCE_ROOT = path.resolve(
  "c:/Users/Lauren Yip/Downloads/TransferNow-Media Kit/Media Kit",
);
const DEST_ROOT = path.resolve("public/images");
const DATA_DIR = path.resolve("src/data");

const FOLDER_MAP = {
  Commerical: "commercial",
  Cosplay: "cosplay",
  "Mixed Media": "mixed-media",
  "Portrait, Fashion, Editorial, Art": "editorial",
};

const ART_FILENAME_PATTERN =
  /funky|mirrorball|evenscore|bandana|liminal|crt|untitled|chiffon|pink\s*#/i;

function sanitizeBaseName(filename) {
  const ext = path.extname(filename).toLowerCase();
  const base = path.basename(filename, path.extname(filename));
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${slug || "image"}${ext}`;
}

function parseMetadata(filename, category) {
  const base = path.basename(filename, path.extname(filename));

  if (category === "mixed-media") {
    if (/nana/i.test(base)) {
      return { name: "NANA / MIXED MEDIA", description: "Collage series" };
    }
    if (/stussy|stiussy/i.test(base)) {
      return { name: "STUSSY STUDIES", description: "Mixed media edit" };
    }
    if (/cam'?s grid/i.test(base)) {
      return { name: "CAM'S GRID", description: "Grid composition" };
    }
    if (/jarrel/i.test(base)) {
      return { name: "JARREL & MICHAELA", description: "Mixed media portrait" };
    }
    if (/rea/i.test(base)) {
      return { name: "REA / LIMINAL", description: "CRT & digital collage" };
    }
    return { name: "MIXED MEDIA", description: base };
  }

  if (category === "commercial") {
    return { name: "MEC / COMMERCIAL", description: "Commercial campaign" };
  }

  if (category === "cosplay") {
    if (/alien/i.test(base)) return { name: "ALIEN EU SERIES", description: "Cosplay editorial" };
    if (/harper/i.test(base)) return { name: "HARPER", description: "Cosplay portrait" };
    if (/moon and friends/i.test(base)) return { name: "MOON & FRIENDS", description: "Group cosplay" };
    if (/moon and kei/i.test(base)) return { name: "MOON & KEI", description: "Cosplay duo" };
    return { name: "COSPLAY", description: base };
  }

  if (/gt fashion show/i.test(base)) {
    return { name: "GT FASHION SHOW 2026", description: "Runway editorial" };
  }
  if (/ava portraits/i.test(base)) {
    return { name: "AVA / PORTRAITS", description: "Portrait series" };
  }
  if (/jasmy/i.test(base)) {
    return { name: "JASMY", description: "Editorial portrait" };
  }
  if (/sophia|sohpia/i.test(base)) {
    return { name: "SOPHIA / LOOKBOOK", description: "Fashion lookbook" };
  }
  if (/family manag/i.test(base)) {
    return { name: base.split("-")[0].trim().toUpperCase(), description: "Talent portrait" };
  }
  if (/kodetic\s*-\s*/i.test(base)) {
    const subject = base.replace(/kodetic\s*-\s*/i, "").replace(/\s*\(.*$/, "").trim();
    return { name: subject.toUpperCase(), description: "Editorial" };
  }
  if (/jing/i.test(base)) return { name: "JING", description: "Portrait" };
  if (/kelly/i.test(base)) return { name: "KELLY", description: "Portrait" };
  if (/ezragillera/i.test(base)) return { name: "EZRA GILLERA", description: "Fashion editorial" };

  return {
    name: base.split("(")[0].trim().toUpperCase() || "EDITORIAL",
    description: "Portrait & editorial",
  };
}

function inferGalleryCategory(folderCategory, filename) {
  if (folderCategory === "editorial" && ART_FILENAME_PATTERN.test(filename)) {
    return "art";
  }
  if (folderCategory === "mixed-media") return "mixed-media";
  return folderCategory;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyCategory(folderName, categoryKey) {
  const sourceDir = path.join(SOURCE_ROOT, folderName);
  const destDir = path.join(DEST_ROOT, categoryKey);
  ensureDir(destDir);

  const usedNames = new Set();
  const items = [];

  const files = fs
    .readdirSync(sourceDir)
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
    .sort((a, b) => a.localeCompare(b));

  for (const file of files) {
    let destName = sanitizeBaseName(file);
    let counter = 1;
    while (usedNames.has(destName)) {
      const ext = path.extname(destName);
      const stem = path.basename(destName, ext);
      destName = `${stem}-${counter}${ext}`;
      counter += 1;
    }
    usedNames.add(destName);

    fs.copyFileSync(path.join(sourceDir, file), path.join(destDir, destName));

    const galleryCategory = inferGalleryCategory(categoryKey, file);
    const meta = parseMetadata(file, galleryCategory);

    items.push({
      id: `${galleryCategory}-${destName.replace(/\.[^.]+$/, "")}`,
      src: `/images/${categoryKey}/${destName}`,
      file: destName,
      name: meta.name,
      description: meta.description,
      category: galleryCategory,
      collection: folderName,
    });
  }

  return items;
}

function pickOnePerGroup(items) {
  const seen = new Set();
  const picks = [];

  for (const item of items) {
    const key = item.name.trim().toUpperCase();
    if (seen.has(key)) continue;
    seen.add(key);
    picks.push(item);
  }

  return picks;
}

function main() {
  if (!fs.existsSync(SOURCE_ROOT)) {
    console.error("Media kit source not found:", SOURCE_ROOT);
    process.exit(1);
  }

  ensureDir(DEST_ROOT);
  ensureDir(DATA_DIR);

  const allItems = [];
  for (const [folderName, categoryKey] of Object.entries(FOLDER_MAP)) {
    allItems.push(...copyCategory(folderName, categoryKey));
  }

  const photography = allItems.filter((item) => item.category !== "mixed-media");
  const mixedMedia = allItems.filter((item) => item.category === "mixed-media");

  const riverPicks = pickOnePerGroup([...photography, ...mixedMedia]);

  const riverItems = riverPicks.map((item, index) => ({
    id: String(index + 1).padStart(2, "0"),
    src: item.src,
    fullSrc: item.src,
    name: item.name,
    description: item.description,
    category:
      item.category === "mixed-media" ? "mixed-media" : item.category,
  }));

  const galleryTs = `import type { PhotoRiverCategory } from "./images";

export type GalleryCategory = PhotoRiverCategory;

export type GalleryImage = {
  id: string;
  src: string;
  name: string;
  description: string;
  category: GalleryCategory;
};

export const galleryImages: GalleryImage[] = ${JSON.stringify(
    photography.map(({ id, src, name, description, category }) => ({
      id,
      src,
      name,
      description,
      category,
    })),
    null,
    2,
  )};

export const mixedMediaImages: GalleryImage[] = ${JSON.stringify(
    mixedMedia.map(({ id, src, name, description, category }) => ({
      id,
      src,
      name,
      description,
      category,
    })),
    null,
    2,
  )};
`;

  const riverTs = `export type PhotoRiverCategory =
  | "commercial"
  | "editorial"
  | "art"
  | "cosplay"
  | "mixed-media";

export type PhotoRiverImage = {
  id: string;
  src: string;
  fullSrc: string;
  name: string;
  description: string;
  category: PhotoRiverCategory;
};

export const photoRiverImages: PhotoRiverImage[] = ${JSON.stringify(riverItems, null, 2)};
`;

  fs.writeFileSync(path.join(DATA_DIR, "gallery.ts"), galleryTs);
  fs.writeFileSync(path.join(DATA_DIR, "images.ts"), riverTs);
  fs.writeFileSync(
    path.join(path.resolve("."), "scripts/river-sources.json"),
    JSON.stringify(
      riverItems.map((item) => ({ id: item.id, src: item.fullSrc })),
      null,
      2,
    ),
  );

  console.log(`Imported ${allItems.length} images`);
  console.log(`  Photography: ${photography.length}`);
  console.log(`  Mixed media: ${mixedMedia.length}`);
  console.log(`  Photo river: ${riverItems.length}`);

  const thumbResult = spawnSync(
    process.execPath,
    ["scripts/generate-river-thumbnails.mjs"],
    { stdio: "inherit", cwd: path.resolve(".") },
  );

  if (thumbResult.status !== 0) {
    process.exit(thumbResult.status ?? 1);
  }
}

main();
