import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const SOURCE_ROOT = path.resolve(
  "c:/Users/Lauren Yip/Downloads/TransferNow-Updated Media Kit/MEDIA KIT (UPDATED)",
);
const DEST_ROOT = path.resolve("public/images");
const DATA_DIR = path.resolve("src/data");

/** Folder → output dir key. Cosplay maps into creative gallery category. */
const FOLDER_SPECS = [
  {
    folder: "Landing Page - Home Page",
    destKey: "landing",
    category: "home",
    name: "LANDING",
    description: "Home selection",
  },
  {
    folder: "Mixed Media",
    destKey: "mixed-media",
    category: "mixed-media",
    name: "MIXED MEDIA",
    description: "Mixed media",
  },
  {
    folder: "CLIENT WORK",
    destKey: "commercial",
    category: "commercial",
    nameFromFile: clientWorkName,
    description: "Client work",
  },
  {
    folder: "Creative Work",
    destKey: "creative",
    category: "creative",
    name: "CREATIVE WORK",
    description: "Creative work",
  },
  {
    folder: "COSPLAY",
    destKey: "creative",
    category: "creative",
    name: "COSPLAY",
    description: "Cosplay",
  },
  {
    folder: "MISCELLANEOUS",
    destKey: "miscellaneous",
    category: "miscellaneous",
    name: "MISCELLANEOUS",
    description: "Miscellaneous",
  },
];

function clientWorkName(filename) {
  if (/mec/i.test(filename)) return "MEC";
  if (/get thrifty|thrifty/i.test(filename)) return "GET THRIFTY FASHION SHOW 2026";
  return "CLIENT WORK";
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function naturalKey(filename) {
  const putTogether = /\(put together\)/i.test(filename) ? 0 : 1;
  const nums = [...filename.matchAll(/(\d+)/g)].map((m) => parseInt(m[1], 10));
  return [putTogether, ...nums, filename.toLowerCase()];
}

function compareNatural(a, b) {
  const ka = naturalKey(a);
  const kb = naturalKey(b);
  const len = Math.max(ka.length, kb.length);
  for (let i = 0; i < len; i++) {
    const av = ka[i] ?? 0;
    const bv = kb[i] ?? 0;
    if (av < bv) return -1;
    if (av > bv) return 1;
  }
  return 0;
}

function sanitizeBaseName(filename) {
  const ext = path.extname(filename).toLowerCase();
  const base = path.basename(filename, path.extname(filename));
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
  return `${slug || "image"}${ext}`;
}

function isJpeg(ext) {
  return ext === ".jpg" || ext === ".jpeg";
}

function listImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir)
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file));

  // Prefer JPG over PNG when the stem matches.
  const byStem = new Map();
  for (const file of files) {
    const stem = path.basename(file, path.extname(file)).toLowerCase();
    const ext = path.extname(file).toLowerCase();
    const prev = byStem.get(stem);
    if (!prev) {
      byStem.set(stem, file);
      continue;
    }
    const prevExt = path.extname(prev).toLowerCase();
    if (isJpeg(ext) && prevExt === ".png") {
      byStem.set(stem, file);
    } else if (isJpeg(prevExt) && ext === ".png") {
      // keep jpeg
    } else {
      const a = fs.statSync(path.join(dir, prev)).size;
      const b = fs.statSync(path.join(dir, file)).size;
      if (b > a) byStem.set(stem, file);
    }
  }

  return Array.from(byStem.values()).sort(compareNatural);
}

function wipeDestCategories() {
  const keys = [
    "landing",
    "mixed-media",
    "commercial",
    "creative",
    "miscellaneous",
    "editorial",
    "cosplay",
    "grid",
    "river",
  ];
  for (const key of keys) {
    const dir = path.join(DEST_ROOT, key);
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
}

function copyFolder(spec) {
  const sourceDir = path.join(SOURCE_ROOT, spec.folder);
  const destDir = path.join(DEST_ROOT, spec.destKey);
  ensureDir(destDir);

  const usedNames = new Set(
    fs.existsSync(destDir)
      ? fs.readdirSync(destDir).map((f) => f.toLowerCase())
      : [],
  );
  const items = [];
  const files = listImageFiles(sourceDir);

  for (const file of files) {
    let destName = sanitizeBaseName(file);
    let counter = 1;
    while (usedNames.has(destName.toLowerCase())) {
      const ext = path.extname(destName);
      const stem = path.basename(destName, ext);
      destName = `${stem}-${counter}${ext}`;
      counter += 1;
    }
    usedNames.add(destName.toLowerCase());

    fs.copyFileSync(path.join(sourceDir, file), path.join(destDir, destName));

    const name = spec.nameFromFile
      ? spec.nameFromFile(file)
      : spec.name;
    const idStem = destName.replace(/\.[^.]+$/, "");

    items.push({
      id: `${spec.category}-${idStem}`,
      src: `/images/${spec.destKey}/${destName}`,
      file: destName,
      name,
      description: spec.description,
      category: spec.category,
      section: spec.folder,
    });
  }

  console.log(`  ${spec.folder}: ${items.length} images → ${spec.destKey}/`);
  return items;
}

function serializeGallery(items) {
  return JSON.stringify(
    items.map(({ id, src, name, description, category }) => ({
      id,
      src,
      name,
      description,
      category,
    })),
    null,
    2,
  );
}

function main() {
  if (!fs.existsSync(SOURCE_ROOT)) {
    console.error("Updated media kit not found:", SOURCE_ROOT);
    process.exit(1);
  }

  ensureDir(DEST_ROOT);
  ensureDir(DATA_DIR);
  wipeDestCategories();

  console.log("Importing updated media kit…");
  const all = [];
  for (const spec of FOLDER_SPECS) {
    all.push(...copyFolder(spec));
  }

  const landing = all.filter((i) => i.category === "home");
  const mixedMedia = all.filter((i) => i.category === "mixed-media");
  const gallery = all.filter(
    (i) => i.category !== "home" && i.category !== "mixed-media",
  );

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

export const landingImages: GalleryImage[] = ${serializeGallery(landing)};

export const galleryImages: GalleryImage[] = ${serializeGallery(gallery)};

export const mixedMediaImages: GalleryImage[] = ${serializeGallery(mixedMedia)};
`;

  const imagesTs = `/** Shared content category keys used by nav + gallery. */
export type PhotoRiverCategory =
  | "home"
  | "commercial"
  | "creative"
  | "miscellaneous"
  | "mixed-media";

/** @deprecated River removed — kept for type import compatibility during transition. */
export type PhotoRiverImage = {
  id: string;
  src: string;
  fullSrc: string;
  name: string;
  description: string;
  category: PhotoRiverCategory;
};

export const photoRiverImages: PhotoRiverImage[] = [];
`;

  fs.writeFileSync(path.join(DATA_DIR, "gallery.ts"), galleryTs);
  fs.writeFileSync(path.join(DATA_DIR, "images.ts"), imagesTs);

  console.log(`Imported ${all.length} images`);
  console.log(`  Landing: ${landing.length}`);
  console.log(`  Gallery: ${gallery.length}`);
  console.log(`  Mixed media: ${mixedMedia.length}`);

  const compress = spawnSync(process.execPath, ["scripts/compress-images.mjs"], {
    stdio: "inherit",
    cwd: path.resolve("."),
  });
  if (compress.status !== 0) process.exit(compress.status ?? 1);

  const grid = spawnSync(process.execPath, ["scripts/generate-grid-thumbnails.mjs"], {
    stdio: "inherit",
    cwd: path.resolve("."),
  });
  if (grid.status !== 0) process.exit(grid.status ?? 1);
}

main();
