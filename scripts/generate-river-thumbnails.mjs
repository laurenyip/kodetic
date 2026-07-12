import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(".");
const RIVER_DIR = path.join(ROOT, "public/images/river");
const SOURCES_FILE = path.join(ROOT, "scripts/river-sources.json");
const IMAGES_TS = path.join(ROOT, "src/data/images.ts");

const WIDTH = 160;
const QUALITY = 48;

function getRiverSources() {
  if (!fs.existsSync(SOURCES_FILE)) {
    throw new Error("Missing scripts/river-sources.json — run sync-river-groups first");
  }
  return JSON.parse(fs.readFileSync(SOURCES_FILE, "utf8"));
}

function updateImagesTs(thumbById) {
  let nextSource = fs.readFileSync(IMAGES_TS, "utf8");

  for (const [id, thumbSrc] of Object.entries(thumbById)) {
    const block = new RegExp(
      `("id":\\s*"${id}"[\\s\\S]*?"src":\\s*")([^"]+)(")`,
      "m",
    );
    nextSource = nextSource.replace(block, `$1${thumbSrc}$3`);
  }

  fs.writeFileSync(IMAGES_TS, nextSource);
}

async function generateThumbnails() {
  fs.mkdirSync(RIVER_DIR, { recursive: true });

  const items = getRiverSources();
  const thumbById = {};
  const stats = [];

  for (const item of items) {
    const inputPath = path.join(ROOT, "public", item.src.replace(/^\//, ""));
    const outputName = `${item.id}.webp`;
    const outputPath = path.join(RIVER_DIR, outputName);
    const thumbSrc = `/images/river/${outputName}`;

    if (!fs.existsSync(inputPath)) {
      console.warn(`Missing source for river ${item.id}: ${inputPath}`);
      continue;
    }

    await sharp(inputPath)
      .rotate()
      .resize(WIDTH, Math.round((WIDTH * 3) / 4), {
        fit: "cover",
        position: "centre",
      })
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(outputPath);

    const { size } = fs.statSync(outputPath);
    thumbById[item.id] = thumbSrc;
    stats.push({ id: item.id, kb: Math.round(size / 1024) });
  }

  if (Object.keys(thumbById).length > 0) {
    updateImagesTs(thumbById);
  }

  const totalKb = stats.reduce((sum, item) => sum + item.kb, 0);
  console.log(`Generated ${stats.length} river thumbnails (~${totalKb} KB total)`);
}

generateThumbnails().catch((error) => {
  console.error(error);
  process.exit(1);
});
