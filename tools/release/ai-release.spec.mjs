import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

import { APF_PACKAGES, PACKAGE_BY_TARGET, VALID_TARGETS } from './package-catalog.mjs';

const read = (file) => fs.readFileSync(file, 'utf8');

test('AI-CICD-CAT-001 registers ai as a valid release target', () => {
  assert.equal(VALID_TARGETS.includes('ai'), true);
});

test('AI-CICD-CAT-002 maps ai to the publishable Angular package', () => {
  assert.deepEqual(PACKAGE_BY_TARGET.get('ai'), {
    target: 'ai',
    packageName: '@tailng-ui/ai',
    project: 'ai',
    sourcePackageJson: 'libs/tailng-ui/ai/package.json',
    distDir: 'dist/libs/tailng-ui/ai',
    apf: true,
    publishedSideEffects: false,
  });
  assert.equal(
    APF_PACKAGES.some(({ target }) => target === 'ai'),
    true,
  );
});

test('AI-CICD-MAT-001 resolves ai to its own test matrix entry', () => {
  const result = spawnSync(process.execPath, ['tools/release/resolve-test-matrix.mjs', 'ai'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    include: [{ name: 'ai', targets: 'ai' }],
  });
});

test('AI-CICD-MAT-003 includes ai in the production workflow and runs test:ai', () => {
  const workflow = read('.github/workflows/prod-build-deploy.yml');

  assert.match(workflow, /cdk,primitives,components,ai,theme,icons,charts,flow/);
  assert.match(workflow, /run-if\.mjs.*ai.*pnpm run test:ai/);
});

test('AI-CICD-BLD-003 requires the AG-UI secondary entry point', () => {
  const assertionScript = read('tools/release/assert-bundles.mjs');

  assert.match(assertionScript, /\['ai', \['\.\/ag-ui'\]\]/);
});

test('AI-CICD-CON-002 smoke-tests both public AI entry points', () => {
  const smokeTest = read('tools/release/angular-package-smoke-test.mjs');

  assert.match(smokeTest, /from '@tailng-ui\/ai'/);
  assert.match(smokeTest, /from '@tailng-ui\/ai\/ag-ui'/);
  assert.match(smokeTest, /dependencyVersion\('@ag-ui\/core'\)/);
});

test('AI-CICD-PUB-001 keeps version 0.1.0 while alpha remains a dist-tag', () => {
  const packageJson = JSON.parse(read('libs/tailng-ui/ai/package.json'));
  const plan = read('plan/ai/ci-cd-integration.md');

  assert.equal(packageJson.version, '0.1.0');
  assert.doesNotMatch(packageJson.version, /alpha/i);
  assert.match(plan, /`0\.1\.0` on the `alpha` dist-tag/);
});
