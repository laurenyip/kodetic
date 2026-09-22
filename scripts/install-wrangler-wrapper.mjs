import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const marker = "kodetic-opennext-wrangler-wrapper";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const wranglerBin = path.join(root, "node_modules/wrangler/bin/wrangler.js");
const originalBin = path.join(
  root,
  "node_modules/wrangler/bin/wrangler.original.js",
);

if (!fs.existsSync(wranglerBin)) {
  console.warn("wrangler is not installed; skipping OpenNext deploy wrapper");
  process.exit(0);
}

const current = fs.readFileSync(wranglerBin, "utf8");
if (!current.includes(marker) && !fs.existsSync(originalBin)) {
  fs.copyFileSync(wranglerBin, originalBin);
}

let relativeWrapper = path
  .relative(path.dirname(wranglerBin), path.join(root, "scripts/wrangler-with-opennext.cjs"))
  .replaceAll("\\", "/");
if (!relativeWrapper.startsWith(".")) {
  relativeWrapper = `./${relativeWrapper}`;
}

fs.writeFileSync(
  wranglerBin,
  `#!/usr/bin/env node\n/* ${marker} */\nrequire("${relativeWrapper}");\n`,
);
