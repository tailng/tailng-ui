import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { PACKAGE_BY_TARGET, parseTargets } from './package-catalog.mjs';
import { readJson, writeJson } from './package-manifest-utils.mjs';

const selected = new Set(parseTargets((process.argv[2] ?? '').trim()));
// Avoid Node's ESM loading race when Nx scans Vitest configs concurrently.
const nodeOptions = [process.env.NODE_OPTIONS, '--import=vite-tsconfig-paths']
  .filter(Boolean)
  .join(' ');

const run = (command, args) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: nodeOptions,
      NX_DAEMON: 'false',
      NX_ISOLATE_PLUGINS: 'false',
    },
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
};

run('pnpm', ['nx', 'reset']);

// The CLI imports the registry directly, so include that build even when only
// the CLI release target is selected. Nx handles the remaining project graph.
if (selected.has('cli')) selected.add('registry');

const definitions = [...selected].map((target) => PACKAGE_BY_TARGET.get(target)).filter(Boolean);
const projects = definitions.map((definition) => definition.project);

if (projects.length > 0) {
  run('pnpm', [
    'nx',
    'run-many',
    '-t',
    'build',
    '--projects',
    projects.join(','),
    '--skip-nx-cache',
  ]);
}

// Workspace manifests may include source-only side-effect markers for local
// path-mapped builds. Published manifests must describe only packaged files.
for (const definition of definitions) {
  if (definition.publishedSideEffects === undefined) continue;

  const packageJsonPath = path.join(definition.distDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`Missing built package manifest: ${packageJsonPath}`);
  }

  const packageJson = readJson(packageJsonPath);
  packageJson.sideEffects = definition.publishedSideEffects;
  writeJson(packageJsonPath, packageJson);
}
