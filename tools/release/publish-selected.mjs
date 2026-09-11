import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  assertNoWorkspaceProtocols,
  collectPackageVersions as collectPackageVersionsFromFiles,
  fail,
  readJson,
  rewriteWorkspaceProtocols,
} from './package-manifest-utils.mjs';
import { PUBLISHABLE_PACKAGES, parseTargets } from './package-catalog.mjs';

const targetValue = (process.env.TARGETS?.replace(/^,|,$/g, '') ?? process.argv[2] ?? '').trim();
const selected = new Set(parseTargets(targetValue));

const npmTag = (process.argv[3] ?? 'latest').trim();

if (!targetValue) {
  console.error('publish-selected: targets is empty');
  process.exit(1);
}

if (/(\s)/.test(targetValue)) {
  console.error(
    `publish-selected: targets must be comma-separated without spaces. Received: "${targetValue}"`,
  );
  process.exit(1);
}

const run = (cmd, cwd) =>
  execSync(cmd, {
    stdio: 'inherit',
    cwd,
    env: { ...process.env },
  });

const runNpm = (args, cwd) => {
  const result = spawnSync('npm', args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env },
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
};

function resolvePackageVersions() {
  return collectPackageVersionsFromFiles(
    Object.fromEntries(
      PUBLISHABLE_PACKAGES.map((definition) => [definition.target, definition.distDir]),
    ),
    PUBLISHABLE_PACKAGES.map((definition) => definition.sourcePackageJson),
  );
}

function isAlreadyPublished(name, version) {
  const result = spawnSync('npm', ['view', `${name}@${version}`, 'version'], {
    stdio: 'pipe',
    encoding: 'utf8',
    timeout: 30_000,
  });
  return result.status === 0 && result.stdout.trim() === version;
}

function readDistTags(name) {
  const result = spawnSync('npm', ['view', name, 'dist-tags', '--json'], {
    stdio: 'pipe',
    encoding: 'utf8',
    timeout: 30_000,
  });

  if (result.status !== 0) {
    fail(`Unable to read npm dist-tags for ${name}`);
  }

  try {
    return JSON.parse(result.stdout || '{}');
  } catch {
    fail(`Unable to parse npm dist-tags for ${name}: ${result.stdout}`);
  }
}

function compareSemver(a, b) {
  const left = String(a)
    .split('.')
    .map((part) => Number.parseInt(part, 10));
  const right = String(b)
    .split('.')
    .map((part) => Number.parseInt(part, 10));

  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const leftValue = Number.isNaN(left[index]) ? 0 : (left[index] ?? 0);
    const rightValue = Number.isNaN(right[index]) ? 0 : (right[index] ?? 0);
    if (leftValue !== rightValue) return leftValue > rightValue ? 1 : -1;
  }

  return 0;
}

function ensureDistTag(name, version) {
  const tags = readDistTags(name);
  const currentVersion = tags[npmTag];

  if (currentVersion === version) {
    console.log(`OK: ${name}@${version} already has dist-tag ${npmTag}`);
    return;
  }

  if (npmTag === 'latest' && currentVersion && compareSemver(currentVersion, version) > 0) {
    fail(
      `${name}: refusing to move latest from ${currentVersion} back to ${version}. ` +
        'Publish a newer version instead.',
    );
  }

  const command = `npm dist-tag add ${name}@${version} ${npmTag}`;
  if (process.env.DRY_RUN === 'true') {
    console.log(`DRY_RUN=true, skipping: ${command}`);
    return;
  }

  console.log(`Adding dist-tag ${npmTag} to ${name}@${version}`);
  runNpm(['dist-tag', 'add', `${name}@${version}`, npmTag]);
}

const publish = (dir) => {
  if (!fs.existsSync(dir)) {
    fail(`Publish directory not found: ${dir}`);
  }

  const pkgPath = path.join(dir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    fail(`Missing package.json in publish directory: ${dir}`);
  }

  const pkg = readJson(pkgPath);
  rewriteWorkspaceProtocols(pkg, pkgPath, packageVersions);
  const publishPkg = readJson(pkgPath);
  const name = publishPkg.name ?? dir;
  const version = publishPkg.version ?? '';

  assertNoWorkspaceProtocols(publishPkg, dir);

  if (isAlreadyPublished(name, version)) {
    console.log(`${name}@${version} already published; ensuring dist-tag ${npmTag}`);
    ensureDistTag(name, version);
    return;
  }

  console.log(`Publishing ${name}@${version} with tag ${npmTag}`);

  const cmdParts = ['npm publish', '--access public', `--tag ${npmTag}`];

  // If CI=true, request npm provenance (Trusted Publishing / OIDC compatible).
  if (process.env.CI === 'true') {
    cmdParts.push('--provenance');
  }

  const cmd = cmdParts.join(' ');

  if (process.env.DRY_RUN === 'true') {
    console.log(`DRY_RUN=true, skipping: ${cmd} (cwd: ${dir})`);
    return;
  }

  run(cmd, dir);
};

const packageVersions = resolvePackageVersions();

// The catalog is intentionally dependency ordered (CDK → primitives →
// components and Flow → Dagre), which keeps a coordinated release installable.
for (const definition of PUBLISHABLE_PACKAGES) {
  if (!selected.has(definition.target)) continue;
  publish(definition.distDir);
}

console.log('publish-selected: done');
