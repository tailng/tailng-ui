import fs from 'node:fs';
import { PACKAGE_BY_TARGET, VALID_RELEASE_TYPES, parseTargets } from './package-catalog.mjs';

const targets = parseTargets((process.argv[2] ?? '').trim());
const releaseType = (process.argv[3] ?? '').trim().toLowerCase();
const skipRoot = process.argv.slice(4).includes('--skip-root');

// Validate releaseType
if (!VALID_RELEASE_TYPES.includes(releaseType)) {
  console.error(
    `ERROR: Invalid release_type '${releaseType}'. Use ${VALID_RELEASE_TYPES.join('|')}`,
  );
  process.exit(1);
}

console.log(`Bumping versions with release_type: ${releaseType}`);

const bumpSemver = (v) => {
  const [majS, minS, patS] = v.split('.');
  let major = Number(majS);
  let minor = Number(minS);
  let patch = Number((patS ?? '0').replace(/[^0-9].*$/, ''));

  if (releaseType === 'patch') {
    patch += 1;
  } else if (releaseType === 'minor') {
    minor += 1;
    patch = 0;
  } else if (releaseType === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  } else {
    throw new Error(`Invalid releaseType: ${releaseType}`);
  }
  return `${major}.${minor}.${patch}`;
};

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const writeJson = (p, j) => fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');

// 1) bump root package.json version unless this is an independent package release
if (!skipRoot) {
  const p = 'package.json';
  const j = readJson(p);
  const next = bumpSemver(j.version);
  j.version = next;
  writeJson(p, j);
  console.log(`[root] ${next}`);
} else {
  console.log('[root] skipped');
}

// 2) bump selected libs versions
for (const target of targets) {
  const definition = PACKAGE_BY_TARGET.get(target);
  if (!definition) continue;
  const j = readJson(definition.sourcePackageJson);
  const next = bumpSemver(j.version);
  j.version = next;
  writeJson(definition.sourcePackageJson, j);
  console.log(`[pkg] ${definition.packageName} -> ${next}`);
}

// workspace:^ peer deps (e.g. primitives → cdk, components → cdk + primitives)
// are resolved to concrete semver ranges at publish time by rewriteWorkspaceProtocols
// in publish-selected.mjs. No rewriting needed here — keeping workspace:^ in the
// source preserves pnpm lockfile consistency.
