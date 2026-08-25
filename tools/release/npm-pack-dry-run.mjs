import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PACKAGE_BY_TARGET, parseTargets } from './package-catalog.mjs';

const selected = parseTargets(process.argv[2] ?? '');
const npmCacheRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'tailng-npm-pack-cache-'));

try {
  for (const t of selected) {
    const definition = PACKAGE_BY_TARGET.get(t);
    if (!definition) continue;
    const dir = path.resolve(definition.distDir);

    if (!fs.existsSync(dir)) {
      console.error(`npm-pack-dry-run: missing dist folder ${dir}`);
      process.exit(1);
    }

    console.log(`\n--- npm pack --dry-run: ${t} ---`);
    execSync('npm pack --dry-run', {
      cwd: dir,
      stdio: 'inherit',
      env: { ...process.env, npm_config_cache: npmCacheRoot },
    });
  }

  console.log('npm-pack-dry-run: completed for selected packages.');
} finally {
  fs.rmSync(npmCacheRoot, { recursive: true, force: true });
}
