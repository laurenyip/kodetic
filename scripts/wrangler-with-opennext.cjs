"use strict";

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const args = process.argv.slice(2);
const cwd = process.cwd();
const compiledConfig = path.join(
  cwd,
  ".open-next",
  ".build",
  "open-next.config.edge.mjs",
);
const isOpenNext = fs.existsSync(path.join(cwd, "open-next.config.ts"));
const command = args[0];
const needsBuild =
  isOpenNext &&
  process.env.OPEN_NEXT_DEPLOY !== "true" &&
  !fs.existsSync(compiledConfig) &&
  (command === "deploy" ||
    command === "preview" ||
    (command === "versions" && args[1] === "upload"));

if (needsBuild) {
  console.log("OpenNext output missing; running opennextjs-cloudflare build...");
  const cli = require.resolve("@opennextjs/cloudflare/dist/cli/index.js");
  const env = { ...process.env };
  if (!env.NODE_OPTIONS) {
    env.NODE_OPTIONS = "--max-old-space-size=4096";
  }
  const build = spawnSync(process.execPath, [cli, "build"], {
    stdio: "inherit",
    cwd,
    env,
  });
  if (build.status) {
    process.exit(build.status);
  }
}

require(path.join(
  __dirname,
  "../node_modules/wrangler/bin/wrangler.original.js",
));
