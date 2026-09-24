import fs from 'node:fs';
import { parseTargets } from './package-catalog.mjs';

const selected = new Set(parseTargets(process.argv[2] ?? ''));

// Keep the largest suites on separate runners and combine the smaller suites
// to reduce repeated checkout and dependency-install overhead.
const groups = [
  { name: 'primitives', targets: ['primitives'] },
  { name: 'components-flow', targets: ['components', 'flow'] },
  { name: 'cdk-icons-charts-theme', targets: ['cdk', 'icons', 'charts', 'theme'] },
];

const include = groups
  .map((group) => ({
    name: group.name,
    targets: group.targets.filter((target) => selected.has(target)).join(','),
  }))
  .filter((group) => group.targets.length > 0);

const matrix = JSON.stringify({ include });
const hasTests = include.length > 0;
const outputFile = process.env.GITHUB_OUTPUT;

if (outputFile) {
  fs.appendFileSync(outputFile, `matrix=${matrix}\nhas_tests=${hasTests}\n`);
} else {
  console.log(matrix);
}
