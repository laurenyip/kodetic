import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const ROOT = path.resolve(".");
const IMAGE_ROOT = path.join(ROOT, "public/images");
const CATEGORIES = ["commercial", "editorial", "cosplay", "mixed-media"];
const DATA_FILES = [
  path.join(ROOT, "src/data/gallery.ts"),
  path.join(ROOT, "src/data/images.ts"),
  path.join(ROOT, "scripts/river-sources.json"),
];

const MAX_EDGE = 1800;
const WEBP_QUALITY = 76;

function walkImages(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkImages(fullPath);
    if (/\.(jpe?g|png)$/i.test(entry.name)) return [fullPath];
    return [];
  });
}

function toWebPath(filePath) {
  return `/${path.relative(path.join(ROOT, "public"), filePath).replace(/\\/g, "/")}`;
}

function replacePathsInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;

  let source = fs.readFileSync(filePath, "utf8");
  for (const [from, to] of replacements) {
    source = source.split(from).join(to);
  }
  fs.writeFileSync(filePath, source);
}

async function compressImage(inputPath) {
  const outputPath = inputPath.replace(/\.(jpe?g|png)$/i, ".webp");
  const before = fs.statSync(inputPath).size;

  await sharp(inputPath)
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(outputPath);

  fs.unlinkSync(inputPath);

  const after = fs.statSync(outputPath).size;
  return { outputPath, before, after };
}

async function main() {
  const files = CATEGORIES.flatMap((category) =>
    walkImages(path.join(IMAGE_ROOT, category)),
  );

  if (files.length === 0) {
    console.log("No gallery images to compress.");
    return;
  }

  const replacements = [];
  let beforeTotal = 0;
  let afterTotal = 0;

  for (const file of files) {
    const webPath = toWebPath(file);
    const { outputPath, before, after } = await compressImage(file);
    const nextWebPath = toWebPath(outputPath);

    replacements.push([webPath, nextWebPath]);
    beforeTotal += before;
    afterTotal += after;

    console.log(
      `${path.basename(file)} -> ${path.basename(outputPath)} (${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB)`,
    );
  }

  for (const dataFile of DATA_FILES) {
    replacePathsInFile(dataFile, replacements);
  }

  console.log(
    `\nCompressed ${files.length} images: ${Math.round(beforeTotal / 1024 / 1024)}MB -> ${Math.round(afterTotal / 1024 / 1024)}MB`,
  );

  const thumbResult = spawnSync(
    process.execPath,
    ["scripts/generate-river-thumbnails.mjs"],
    { stdio: "inherit", cwd: ROOT },
  );

  if (thumbResult.status !== 0) {
    process.exit(thumbResult.status ?? 1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
