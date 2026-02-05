import fs from "node:fs";
import path from "node:path";

const targets = process.argv[2] ?? "";
const selected = new Set(
  targets
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);

const DIST = path.resolve("dist");
const libDist = (name) => path.join(DIST, "libs", name);

const exists = (p) => fs.existsSync(p);
const stat = (p) => fs.statSync(p);

const fail = (msg) => {
  console.error(`assert-bundles: ${msg}`);
  process.exit(1);
};

const warn = (msg) => console.warn(`⚠️  assert-bundles: ${msg}`);

function listFiles(dir, predicate) {
  if (!exists(dir)) return [];
  const out = [];
  const walk = (d) => {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (!predicate || predicate(full)) out.push(full);
    }
  };
  walk(dir);
  return out;
}

/**
 * Per-package sanity thresholds
 * - cdk entrypoints can be tiny but valid (e.g., 1–2 directives/utilities)
 * - ui bundles should never be tiny if they contain real implementations
 */
const THRESHOLDS = {
  cdk: { minMjs: 700, minDts: 150 },
  icons: { minMjs: 900, minDts: 150 },
  ui: { minMjs: 1500, minDts: 200, uiFormControlsMin: 20_000 },
  // theme is asset-only checks
};

function assertAngularPackage(name, opts) {
  const root = libDist(name);
  if (!exists(root)) fail(`Missing dist folder: ${root}`);

  const pkgJson = path.join(root, "package.json");
  if (!exists(pkgJson)) fail(`Missing ${name} package.json in dist: ${pkgJson}`);

  // Types
  const typesDir = path.join(root, "types");
  if (!exists(typesDir)) fail(`${name}: missing types folder: ${typesDir}`);

  const dtsFiles = listFiles(typesDir, (f) => f.endsWith(".d.ts"));
  if (dtsFiles.length === 0) fail(`${name}: no .d.ts files under ${typesDir}`);

  for (const f of dtsFiles) {
    const size = stat(f).size;
    if (size < opts.minDts) {
      warn(`${name}: small d.ts: ${path.relative(root, f)} (${size} bytes)`);
    }
  }

  // FESM
  const fesmDir = path.join(root, "fesm2022");
  if (!exists(fesmDir)) fail(`${name}: missing fesm2022 folder: ${fesmDir}`);

  const mjsFiles = listFiles(fesmDir, (f) => f.endsWith(".mjs"));
  if (mjsFiles.length === 0) fail(`${name}: no .mjs files under ${fesmDir}`);

  for (const f of mjsFiles) {
    const size = stat(f).size;
    if (size < opts.minMjs) {
      fail(
        `${name}: suspiciously small bundle: ${path.relative(root, f)} (${size} bytes)`
      );
    }
  }
}

function assertThemePackage() {
  const root = libDist("theme");
  if (!exists(root)) fail(`Missing dist folder: ${root}`);

  const pkgJson = path.join(root, "package.json");
  if (!exists(pkgJson)) fail(`theme: missing package.json in dist: ${pkgJson}`);

  const tokensIndex = path.join(root, "tokens", "index.css");
  if (!exists(tokensIndex)) fail(`theme: missing tokens/index.css in dist: ${tokensIndex}`);

  const tokensCss = listFiles(path.join(root, "tokens"), (f) => f.endsWith(".css"));
  if (tokensCss.length === 0) fail(`theme: tokens folder has no css files`);

  const tailwindPreset = path.join(root, "tailwind", "tailng.preset.cjs");
  if (!exists(tailwindPreset)) fail(`theme: missing tailwind/tailng.preset.cjs in dist: ${tailwindPreset}`);
}

function assertUiSpecific() {
  const root = libDist("ui");

  // strongest check for the historically problematic bundle
  const candidates = [
    path.join(root, "fesm2022", "tailng-ui-ui-form-controls.mjs"),
  ].filter(exists);

  // If naming differs in future, fall back to pattern search
  const fallback =
    candidates.length === 0
      ? listFiles(path.join(root, "fesm2022"), (f) => f.endsWith("ui-form-controls.mjs"))
      : [];

  const files = candidates.length ? candidates : fallback;

  if (files.length === 0) {
    warn(`ui: could not find form-controls bundle by name; skipping strict uiFormControlsMin check`);
    return;
  }

  const min = THRESHOLDS.ui.uiFormControlsMin;
  for (const f of files) {
    const size = stat(f).size;
    if (size < min) {
      fail(`ui: form-controls bundle too small (${size} bytes). Likely stub output: ${path.relative(root, f)}`);
    }
  }
}

function assertCdkPackage() {
  const root = libDist("cdk");
  if (!exists(root)) fail(`Missing dist folder: ${root}`);

  const pkgJson = path.join(root, "package.json");
  if (!exists(pkgJson)) fail(`cdk: missing package.json in dist`);

  const typesDir = path.join(root, "types");
  if (!exists(typesDir)) fail(`cdk: missing types folder`);

  const dtsFiles = listFiles(typesDir, (f) => f.endsWith(".d.ts"));
  if (dtsFiles.length === 0) fail(`cdk: no .d.ts files found`);

  const fesmDir = path.join(root, "fesm2022");
  if (!exists(fesmDir)) fail(`cdk: missing fesm2022 folder`);

  const mjsFiles = listFiles(fesmDir, (f) => f.endsWith(".mjs"));
  if (mjsFiles.length === 0) fail(`cdk: no .mjs files found`);

  // Require at least ONE non-trivial bundle (guards against total stub publish)
  const hasRealBundle = mjsFiles.some((f) => stat(f).size > 700);

  if (!hasRealBundle) {
    fail(
      `cdk: all bundles are tiny — this looks like a broken build (sizes: ${mjsFiles
        .map((f) => stat(f).size)
        .join(", ")})`
    );
  }
}

const wants = (t) => selected.has(t);

if (wants("cdk")) assertCdkPackage();
if (wants("icons")) assertAngularPackage("icons", THRESHOLDS.icons);
if (wants("ui")) {
  assertAngularPackage("ui", THRESHOLDS.ui);
  assertUiSpecific();
}
if (wants("theme")) assertThemePackage();

// docs is not an npm package check here

console.log("assert-bundles: all selected dist outputs look sane.");