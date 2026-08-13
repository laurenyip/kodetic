/**
 * Re-encode Mixed Media from the kit at higher resolution so full-width
 * boards and retina grids stay sharp. Prefers the larger source when both
 * a JPG and PNG exist.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(".");
const SOURCE_DIR = path.resolve(
  "c:/Users/Lauren Yip/Downloads/TransferNow-Updated Media Kit/MEDIA KIT (UPDATED)/Mixed Media",
);
const DEST_DIR = path.join(ROOT, "public/images/mixed-media");
const GRID_DIR = path.join(ROOT, "public/images/grid/mixed-media");
const GALLERY_TS = path.join(ROOT, "src/data/gallery.ts");

const MAX_EDGE = 2800;
const GRID_MAX = 1600;
const QUALITY = 82;

function slugStem(filename) {
  const base = path.basename(filename, path.extname(filename));
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function pickSources(dir) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  const byStem = new Map();

  for (const file of files) {
    const stem = slugStem(file);
    const full = path.join(dir, file);
    const prev = byStem.get(stem);
    if (!prev) {
      byStem.set(stem, full);
      continue;
    }
    // Keep the higher-resolution (or larger) file
    const a = fs.statSync(prev).size;
    const b = fs.statSync(full).size;
    if (b > a) byStem.set(stem, full);
  }

  return Array.from(byStem.entries()).sort(([a], [b]) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
}

async function encode(inputPath, outputPath, maxEdge, quality) {
  await sharp(inputPath)
    .rotate()
    .resize(maxEdge, maxEdge, { fit: "inside", withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toFile(outputPath);
}

async function main() {
  fs.mkdirSync(DEST_DIR, { recursive: true });
  fs.mkdirSync(GRID_DIR, { recursive: true });

  const sources = pickSources(SOURCE_DIR);
  console.log(`Re-encoding ${sources.length} mixed-media files…`);

  for (const [stem, src] of sources) {
    const dest = path.join(DEST_DIR, `${stem}.webp`);
    const grid = path.join(GRID_DIR, `${stem}.webp`);
    const meta = await sharp(src).metadata();
    await encode(src, dest, MAX_EDGE, QUALITY);
    await encode(src, grid, GRID_MAX, QUALITY);
    const out = await sharp(dest).metadata();
    console.log(
      `${path.basename(src)} ${meta.width}x${meta.height} → ${out.width}x${out.height} (${Math.round(fs.statSync(dest).size / 1024)}KB)`,
    );
  }

  // Mixed media gallery cells should use the full asset, not the tiny thumb.
  let gallery = fs.readFileSync(GALLERY_TS, "utf8");
  gallery = gallery.replaceAll(
    '"src": "/images/grid/mixed-media/',
    '"src": "/images/mixed-media/',
  );
  fs.writeFileSync(GALLERY_TS, gallery);
  console.log("Pointed mixed-media gallery src at full images.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
