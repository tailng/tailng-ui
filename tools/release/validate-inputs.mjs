import { VALID_RELEASE_TYPES, VALID_TARGETS } from './package-catalog.mjs';

const targets = (process.argv[2] ?? '').trim();
const releaseType = (process.argv[3] ?? '').trim();
const validTargets = new Set(VALID_TARGETS);

if (!targets) {
  console.error('ERROR: targets is empty');
  process.exit(1);
}

// Check for spaces in the targets string (after trimming)
if (targets.includes(' ')) {
  console.error(`ERROR: targets must not contain spaces. Example: ${VALID_TARGETS.join(',')}`);
  console.error(`Received: "${targets}"`);
  process.exit(1);
}

const list = targets.split(',').filter(Boolean);
if (list.length === 0) {
  console.error('ERROR: targets is empty after parsing');
  process.exit(1);
}

const dedup = new Set(list);
if (dedup.size !== list.length) {
  console.error(`ERROR: targets contains duplicates: ${targets}`);
  process.exit(1);
}

for (const t of list) {
  if (!validTargets.has(t)) {
    console.error(`ERROR: Invalid target '${t}'. Valid: ${VALID_TARGETS.join(', ')}`);
    process.exit(1);
  }
}

if (!VALID_RELEASE_TYPES.includes(releaseType)) {
  console.error(
    `ERROR: Invalid release_type '${releaseType}'. Use ${VALID_RELEASE_TYPES.join('|')}`,
  );
  process.exit(1);
}

console.log(`OK: targets=${targets}`);
console.log(`OK: release_type=${releaseType}`);
