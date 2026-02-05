import fs from "node:fs";

const targets = (process.argv[2] ?? "").trim();
const releaseType = (process.argv[3] ?? "").trim().toLowerCase();

const has = (t) => ("," + targets + ",").includes("," + t + ",");

// Validate releaseType
if (!["minor", "major"].includes(releaseType)) {
  console.error(`ERROR: Invalid release_type '${releaseType}'. Use minor|major`);
  process.exit(1);
}

console.log(`Bumping versions with release_type: ${releaseType}`);

const bumpSemver = (v) => {
  const [majS, minS, patS] = v.split(".");
  let major = Number(majS);
  let minor = Number(minS);
  let patch = Number((patS ?? "0").replace(/[^0-9].*$/, ""));

  if (releaseType === "minor") {
    minor += 1;
    patch = 0;
  } else if (releaseType === "major") {
    major += 1;
    minor = 0;
    patch = 0;
  } else {
    throw new Error(`Invalid releaseType: ${releaseType}`);
  }
  return `${major}.${minor}.${patch}`;
};

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const writeJson = (p, j) => fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");

// 1) bump root package.json version
{
  const p = "package.json";
  const j = readJson(p);
  const next = bumpSemver(j.version);
  j.version = next;
  writeJson(p, j);
  console.log(`[root] ${next}`);
}

// 2) bump selected libs versions
const libs = [
  ["cdk", "libs/cdk/package.json", "@tailng-ui/cdk"],
  ["theme", "libs/theme/package.json", "@tailng-ui/theme"],
  ["icons", "libs/icons/package.json", "@tailng-ui/icons"],
  ["ui", "libs/ui/package.json", "@tailng-ui/ui"],
];

for (const [key, path, label] of libs) {
  if (!has(key)) continue;
  const j = readJson(path);
  const next = bumpSemver(j.version);
  j.version = next;
  writeJson(path, j);
  console.log(`[pkg] ${label} -> ${next}`);
}

// 3) align ui peerDeps (only if ui selected)
if (has("ui")) {
  const uiPath = "libs/ui/package.json";
  const ui = readJson(uiPath);

  const cdkV = readJson("libs/cdk/package.json").version;
  const iconsV = readJson("libs/icons/package.json").version;

  ui.peerDependencies ||= {};
  if (ui.peerDependencies["@tailng-ui/cdk"]) ui.peerDependencies["@tailng-ui/cdk"] = `^${cdkV}`;
  if (ui.peerDependencies["@tailng-ui/icons"]) ui.peerDependencies["@tailng-ui/icons"] = `^${iconsV}`;

  writeJson(uiPath, ui);
  console.log(`[peerDeps] ui: cdk=^${cdkV}, icons=^${iconsV}`);
}