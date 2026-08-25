import fs from 'node:fs';
import { PUBLISHABLE_PACKAGES, parseTargets } from './package-catalog.mjs';

const selected = new Set(parseTargets(process.argv[2] ?? ''));

for (const definition of PUBLISHABLE_PACKAGES) {
  if (!selected.has(definition.target)) continue;
  if (!fs.existsSync(definition.distDir)) {
    console.error(`ERROR: ${definition.distDir} does not exist`);
    process.exit(1);
  }
}

console.log('OK: dist directories exist');
