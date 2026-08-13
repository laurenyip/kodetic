/**
 * Match PDF-extracted order crops to media-kit source files via average/dHash,
 * then write scripts/pdf-image-order.json for gallery reordering.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(".");
const PDF_EXTRACT = path.join(ROOT, ".tmp-pdf-extract");
const MEDIA_ROOT = path.resolve(
  "c:/Users/Lauren Yip/Downloads/TransferNow-Updated Media Kit/MEDIA KIT (UPDATED)",
);
const OUT_ORDER = path.join(ROOT, "scripts/pdf-image-order.json");

const SPECS = [
  {
    pages: [1],
    key: "landing",
    folder: "Landing Page - Home Page",
  },
  {
    pages: [2, 3, 4],
    key: "mixed-media",
    folder: "Mixed Media",
  },
  {
    pages: [5],
    key: "commercial",
    folder: "CLIENT WORK",
  },
  {
    pages: [7, 8],
    key: "creative",
    folder: "Creative Work",
  },
  {
    pages: [6],
    key: "cosplay",
    folder: "COSPLAY",
  },
  {
    pages: [9],
    key: "miscellaneous",
    folder: "MISCELLANEOUS",
  },
];

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .map((f) => path.join(dir, f));
}

async function aHash(filePath, size = 16) {
  const { data } = await sharp(filePath)
    .rotate()
    .resize(size, size, { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i];
  const avg = sum / data.length;
  let bits = "";
  for (let i = 0; i < data.length; i++) bits += data[i] >= avg ? "1" : "0";
  return bits;
}

async function dHash(filePath, size = 16) {
  const w = size + 1;
  const { data } = await sharp(filePath)
    .rotate()
    .resize(w, size, { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let bits = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      bits += data[y * w + x] < data[y * w + x + 1] ? "1" : "0";
    }
  }
  return bits;
}

function hamming(a, b) {
  let d = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) d++;
  return d + Math.abs(a.length - b.length);
}

async function fingerprint(filePath) {
  const [a, d] = await Promise.all([aHash(filePath), dHash(filePath)]);
  return { a, d };
}

function score(a, b) {
  return hamming(a.a, b.a) + hamming(a.d, b.d);
}

function uniqueSources(folder) {
  const sources = listImages(path.join(MEDIA_ROOT, folder));
  const byStem = new Map();
  for (const src of sources) {
    const stem = path.basename(src, path.extname(src)).toLowerCase();
    const ext = path.extname(src).toLowerCase();
    const prev = byStem.get(stem);
    if (!prev) {
      byStem.set(stem, src);
      continue;
    }
    const prevExt = path.extname(prev).toLowerCase();
    if ((ext === ".jpg" || ext === ".jpeg") && prevExt === ".png") {
      byStem.set(stem, src);
    }
  }
  return Array.from(byStem.values());
}

async function main() {
  const final = {};

  for (const spec of SPECS) {
    const sources = uniqueSources(spec.folder);
    const sourceFp = [];
    for (const src of sources) {
      sourceFp.push({ src, fp: await fingerprint(src) });
    }

    const used = new Set();
    const ordered = [];

    for (const page of spec.pages) {
      const pageDir = path.join(
        PDF_EXTRACT,
        `page-${String(page).padStart(2, "0")}`,
      );
      const crops = listImages(pageDir).sort((a, b) =>
        path.basename(a).localeCompare(path.basename(b), undefined, {
          numeric: true,
        }),
      );
      console.log(
        `\nPage ${page} (${spec.key}): ${crops.length} crops, ${sources.length - used.size} sources left`,
      );

      for (const crop of crops) {
        const cfp = await fingerprint(crop);
        let best = null;
        let bestScore = Infinity;
        for (const item of sourceFp) {
          if (used.has(item.src)) continue;
          const s = score(cfp, item.fp);
          if (s < bestScore) {
            bestScore = s;
            best = item;
          }
        }
        if (!best) {
          console.log(`  ${path.basename(crop)} → NO SOURCES LEFT`);
          continue;
        }
        // Skip very weak matches so later crops can claim the right file
        if (bestScore > 100) {
          ordered.push({
            page,
            crop: path.basename(crop),
            file: null,
            score: bestScore,
            src: null,
            note: `skipped weak best=${path.basename(best.src)}`,
          });
          console.log(
            `  ${path.basename(crop)} → SKIPPED (best ${path.basename(best.src)} score ${bestScore})`,
          );
          continue;
        }
        used.add(best.src);
        ordered.push({
          page,
          crop: path.basename(crop),
          file: path.basename(best.src),
          score: bestScore,
          src: best.src,
          weak: bestScore > 90,
        });
        console.log(
          `  ${path.basename(crop)} → ${path.basename(best.src)} (score ${bestScore}${bestScore > 90 ? " WEAK" : ""})`,
        );
      }
    }

    // Append unused kit files (not shown on PDF) after PDF order
    for (const item of sourceFp) {
      if (!used.has(item.src)) {
        ordered.push({
          page: null,
          crop: null,
          file: path.basename(item.src),
          score: null,
          src: item.src,
          note: "not on pdf — appended",
        });
        console.log(`  + appended ${path.basename(item.src)}`);
      }
    }

    final[spec.key] = ordered;
  }

  fs.writeFileSync(OUT_ORDER, JSON.stringify(final, null, 2));
  console.log("\nWrote", OUT_ORDER);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
