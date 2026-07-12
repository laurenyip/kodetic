import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(".");
const GALLERY_TS = path.join(ROOT, "src/data/gallery.ts");
const IMAGES_TS = path.join(ROOT, "src/data/images.ts");
const SOURCES_FILE = path.join(ROOT, "scripts/river-sources.json");

function extractArray(source, exportName) {
  const match = source.match(
    new RegExp(`export const ${exportName}[^=]*=\\s*(\\[[\\s\\S]*?\\]);`),
  );
  if (!match) {
    throw new Error(`Could not parse ${exportName} from gallery.ts`);
  }
  return JSON.parse(match[1]);
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
  const gallerySource = fs.readFileSync(GALLERY_TS, "utf8");
  const galleryImages = extractArray(gallerySource, "galleryImages");
  const mixedMediaImages = extractArray(gallerySource, "mixedMediaImages");

  const riverPicks = pickOnePerGroup([...galleryImages, ...mixedMediaImages]);

  const riverItems = riverPicks.map((item, index) => ({
    id: String(index + 1).padStart(2, "0"),
    src: item.src,
    fullSrc: item.src,
    name: item.name,
    description: item.description,
    category:
      item.category === "mixed-media" ? "mixed-media" : item.category,
  }));

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

  fs.writeFileSync(IMAGES_TS, riverTs);
  fs.writeFileSync(
    SOURCES_FILE,
    JSON.stringify(
      riverItems.map(({ id, fullSrc }) => ({ id, src: fullSrc })),
      null,
      2,
    ),
  );

  console.log(`River: ${riverItems.length} groups (one image each)`);

  const thumbResult = spawnSync(
    process.execPath,
    ["scripts/generate-river-thumbnails.mjs"],
    { stdio: "inherit", cwd: ROOT },
  );

  if (thumbResult.status !== 0) {
    process.exit(thumbResult.status ?? 1);
  }
}

main();
