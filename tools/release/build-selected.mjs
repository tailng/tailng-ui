import { spawnSync } from 'node:child_process';
import { PACKAGE_BY_TARGET, parseTargets } from './package-catalog.mjs';

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

const projects = [...selected]
  .map((target) => PACKAGE_BY_TARGET.get(target)?.project)
  .filter(Boolean);

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
