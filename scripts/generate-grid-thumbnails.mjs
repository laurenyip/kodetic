import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(".");
const CATEGORIES = [
  "landing",
  "commercial",
  "creative",
  "miscellaneous",
  "mixed-media",
];
const GALLERY_TS = path.join(ROOT, "src/data/gallery.ts");

const GRID_MAX = 720;
const QUALITY = 72;

function walkWebp(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkWebp(fullPath);
    if (entry.name.endsWith(".webp")) return [fullPath];
    return [];
  });
}

async function main() {
  const replacements = [];

  for (const category of CATEGORIES) {
    const sourceDir = path.join(ROOT, "public/images", category);
    const gridDir = path.join(ROOT, "public/images/grid", category);
    fs.mkdirSync(gridDir, { recursive: true });

    for (const sourcePath of walkWebp(sourceDir)) {
      const fileName = path.basename(sourcePath);
      const outputPath = path.join(gridDir, fileName);

      await sharp(sourcePath)
        .rotate()
        .resize(GRID_MAX, GRID_MAX, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(outputPath);

      const fullSrc = `/images/${category}/${fileName}`;
      const gridSrc = `/images/grid/${category}/${fileName}`;
      replacements.push([fullSrc, gridSrc]);
    }
  }

  let gallerySource = fs.readFileSync(GALLERY_TS, "utf8");

  for (const [fullSrc, gridSrc] of replacements) {
    const escaped = fullSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`"src":\\s*"${escaped}"`, "g");
    gallerySource = gallerySource.replace(
      pattern,
      `"src": "${gridSrc}",\n    "fullSrc": "${fullSrc}"`,
    );
  }

  if (!gallerySource.includes('"fullSrc"')) {
    gallerySource = gallerySource.replace(
      'export type GalleryImage = {\n  id: string;\n  src: string;',
      'export type GalleryImage = {\n  id: string;\n  src: string;\n  fullSrc?: string;',
    );
  }

  fs.writeFileSync(GALLERY_TS, gallerySource);

  const gridBytes = walkWebp(path.join(ROOT, "public/images/grid")).reduce(
    (sum, file) => sum + fs.statSync(file).size,
    0,
  );

  console.log(
    `Generated ${replacements.length} grid thumbnails (~${Math.round(gridBytes / 1024 / 1024)}MB total)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
