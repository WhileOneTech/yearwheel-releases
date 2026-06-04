#!/usr/bin/env node
// Generate a Tauri v2 updater manifest (`latest.json`) from a directory of build artifacts.
//
// The Tauri updater expects, per platform, the URL of an update bundle and the contents of its
// detached signature (the `.sig` file produced at build time). This script scans a directory for
// `.sig` files, infers the target platform from the sibling artifact's filename, and emits a
// manifest whose download URLs point at this repo's GitHub Release for the given tag.
//
// Usage:
//   node scripts/generate-latest-json.mjs --dir dist --tag v1.2.3 [--out dist/latest.json]
//                                          [--repo owner/name] [--notes "free text"]
//                                          [--date 2026-06-04T00:00:00Z]
//
// Notes:
//   * Run this where the `.sig` files live (i.e. alongside the freshly built/downloaded artifacts).
//   * Signatures are NOT generated here — they come from `tauri build` with the updater key.
//   * Output shape: https://v2.tauri.app/plugin/updater/#static-json-file

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const key = argv[i];
    if (key.startsWith("--")) args[key.slice(2)] = argv[i + 1];
  }
  return args;
}

const args = parseArgs(process.argv);
const dir = args.dir ?? "dist";
const tag = args.tag ?? process.env.RELEASE_TAG;
const repo = args.repo ?? process.env.GITHUB_REPOSITORY ?? "WhileOneTech/yearwheel-releases";
const outPath = args.out ?? join(dir, "latest.json");

if (!tag) {
  console.error("error: --tag <vX.Y.Z> is required (or set RELEASE_TAG).");
  process.exit(1);
}

const version = tag.replace(/^v/, "");
const pubDate = args.date ?? new Date().toISOString();
const downloadBase = `https://github.com/${repo}/releases/download/${encodeURIComponent(tag)}`;

// Map an artifact filename to one or more Tauri updater platform keys.
// Returns [] for files that are not updater bundles (e.g. plain .dmg, .msi, .deb).
function platformsFor(name) {
  const n = name.toLowerCase();
  const isArm = /(aarch64|arm64)/.test(n);
  const isIntel = /(x64|x86_64|amd64|intel)/.test(n);

  // macOS updater bundle: <App>.app.tar.gz
  if (n.endsWith(".app.tar.gz")) {
    if (isArm) return ["darwin-aarch64"];
    if (isIntel) return ["darwin-x86_64"];
    // Universal build — advertise it for both architectures.
    return ["darwin-aarch64", "darwin-x86_64"];
  }

  // Linux updater bundle: <App>_<ver>_amd64.AppImage (optionally .tar.gz wrapped)
  if (n.endsWith(".appimage") || n.endsWith(".appimage.tar.gz")) {
    return [isArm ? "linux-aarch64" : "linux-x86_64"];
  }

  // Windows updater bundle: NSIS <App>_<ver>_x64-setup.exe or MSI <App>_<ver>_x64_*.msi
  if (n.endsWith("-setup.exe") || n.endsWith(".msi")) {
    return [isArm ? "windows-aarch64" : "windows-x86_64"];
  }

  return [];
}

let sigFiles;
try {
  sigFiles = readdirSync(dir).filter((f) => f.endsWith(".sig"));
} catch (err) {
  console.error(`error: cannot read directory "${dir}": ${err.message}`);
  process.exit(1);
}

const platforms = {};
for (const sig of sigFiles) {
  const artifact = sig.replace(/\.sig$/, "");
  const keys = platformsFor(artifact);
  if (keys.length === 0) {
    console.warn(`skip: "${sig}" — could not map "${artifact}" to a platform.`);
    continue;
  }
  const signature = readFileSync(join(dir, sig), "utf8").trim();
  const url = `${downloadBase}/${encodeURIComponent(basename(artifact))}`;
  for (const key of keys) {
    if (platforms[key]) {
      console.warn(`warn: duplicate platform "${key}" — keeping "${platforms[key].url.split("/").pop()}", ignoring "${artifact}".`);
      continue;
    }
    platforms[key] = { signature, url };
  }
}

if (Object.keys(platforms).length === 0) {
  console.error(`error: no updater bundles found in "${dir}". Expected signed .app.tar.gz / .AppImage / -setup.exe / .msi artifacts with matching .sig files.`);
  process.exit(1);
}

const manifest = {
  version,
  notes: args.notes ?? `YearWheel ${tag}. See the release notes: https://github.com/${repo}/releases/tag/${tag}`,
  pub_date: pubDate,
  platforms,
};

writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote ${outPath} for ${tag}:`);
console.log("  platforms: " + Object.keys(platforms).sort().join(", "));
