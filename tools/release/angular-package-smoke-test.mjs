import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { APF_PACKAGES, parseTargets } from './package-catalog.mjs';
import {
  assertNoWorkspaceProtocols,
  collectPackageVersions,
  readJson,
  rewriteWorkspaceProtocols,
  writeJson,
} from './package-manifest-utils.mjs';

const PACKAGE_NAMES = APF_PACKAGES.map((definition) => definition.target);
const selected = new Set(parseTargets(process.argv[2] ?? PACKAGE_NAMES.join(',')));
const missingTargets = PACKAGE_NAMES.filter((target) => !selected.has(target));

if (missingTargets.length > 0) {
  console.log(
    `angular-package-smoke-test: skipped because the coordinated APF package set is not selected (missing: ${missingTargets.join(', ')})`,
  );
  process.exit(0);
}

const workspaceRoot = process.cwd();
const rootPackage = readJson(path.join(workspaceRoot, 'package.json'));
const sourcePackages = [
  rootPackage,
  ...APF_PACKAGES.map((definition) =>
    readJson(path.join(workspaceRoot, definition.sourcePackageJson)),
  ),
];
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'tailng-angular-package-smoke-'));
const stagedRoot = path.join(tempRoot, 'packages');
const tarballsRoot = path.join(tempRoot, 'tarballs');
const consumerRoot = path.join(tempRoot, 'consumer');
const npmCacheRoot =
  process.env.TAILNG_SMOKE_NPM_CACHE ??
  path.join(os.tmpdir(), 'tailng-angular-package-smoke-npm-cache');
const keepTemp = process.env.KEEP_SMOKE_TEMP === '1';
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const distDirs = Object.fromEntries(
  APF_PACKAGES.map((definition) => [
    definition.target,
    path.join(workspaceRoot, definition.distDir),
  ]),
);
const stagedDirs = Object.fromEntries(
  PACKAGE_NAMES.map((name) => [name, path.join(stagedRoot, name)]),
);

function fail(message) {
  throw new Error(`angular-package-smoke-test: ${message}`);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? workspaceRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      npm_config_cache: npmCacheRoot,
    },
    maxBuffer: 20 * 1024 * 1024,
    stdio: options.inherit ? 'inherit' : 'pipe',
  });

  if (!options.silent) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }

  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (options.silent) {
      if (result.stdout) process.stdout.write(result.stdout);
      if (result.stderr) process.stderr.write(result.stderr);
    }
    fail(`command failed (${result.status ?? 'unknown'}): ${command} ${args.join(' ')}`);
  }

  return `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
}

function dependencyVersion(name) {
  for (const pkg of sourcePackages) {
    const version =
      pkg.dependencies?.[name] ?? pkg.devDependencies?.[name] ?? pkg.peerDependencies?.[name];
    if (typeof version === 'string' && !version.startsWith('workspace:')) return version;
  }
  fail(`workspace package manifests do not declare '${name}'`);
}

function writeText(relativePath, value) {
  fs.writeFileSync(path.join(consumerRoot, relativePath), value, 'utf8');
}

function stagePackages() {
  fs.mkdirSync(stagedRoot, { recursive: true });
  fs.mkdirSync(tarballsRoot, { recursive: true });

  for (const name of PACKAGE_NAMES) {
    const source = distDirs[name];
    if (!fs.existsSync(source)) {
      fail(`missing dist package: ${path.relative(workspaceRoot, source)}`);
    }
    fs.cpSync(source, stagedDirs[name], { recursive: true });
  }

  const packageVersions = collectPackageVersions(stagedDirs, []);
  for (const name of PACKAGE_NAMES) {
    const packagePath = path.join(stagedDirs[name], 'package.json');
    const pkg = readJson(packagePath);
    rewriteWorkspaceProtocols(pkg, packagePath, packageVersions);
    assertNoWorkspaceProtocols(readJson(packagePath), stagedDirs[name]);
  }
}

function packPackages() {
  const tarballs = new Map();

  for (const name of PACKAGE_NAMES) {
    const output = run(npmCommand, ['pack', '--json', '--pack-destination', tarballsRoot], {
      cwd: stagedDirs[name],
      silent: true,
    });
    const jsonStart = output.indexOf('[');
    const jsonEnd = output.lastIndexOf(']');
    if (jsonStart === -1 || jsonEnd < jsonStart) fail(`npm pack did not return JSON for ${name}`);

    let packResult;
    try {
      packResult = JSON.parse(output.slice(jsonStart, jsonEnd + 1));
    } catch {
      fail(`could not parse npm pack output for ${name}`);
    }

    const filename = packResult[0]?.filename;
    if (typeof filename !== 'string') fail(`npm pack did not produce a tarball for ${name}`);

    const packageName = readJson(path.join(stagedDirs[name], 'package.json')).name;
    tarballs.set(packageName, path.join(tarballsRoot, filename));
    console.log(`angular-package-smoke-test: packed ${packageName} as ${filename}`);
  }

  return tarballs;
}

function writeConsumer(tarballs) {
  fs.mkdirSync(path.join(consumerRoot, 'src'), { recursive: true });

  const packageDependencies = Object.fromEntries(
    [...tarballs].map(([name, tarball]) => [name, `file:${tarball}`]),
  );

  writeJson(path.join(consumerRoot, 'package.json'), {
    name: 'tailng-angular-package-smoke',
    version: '0.0.0',
    private: true,
    type: 'module',
    scripts: {
      build: 'ng build --configuration production',
      test: 'vitest run',
      typecheck: 'tsc -p tsconfig.nodenext.json',
    },
    dependencies: {
      '@dagrejs/dagre': dependencyVersion('@dagrejs/dagre'),
      '@angular/common': dependencyVersion('@angular/common'),
      '@angular/compiler': dependencyVersion('@angular/compiler'),
      '@angular/core': dependencyVersion('@angular/core'),
      '@angular/forms': dependencyVersion('@angular/forms'),
      '@angular/platform-browser': dependencyVersion('@angular/platform-browser'),
      '@angular/router': dependencyVersion('@angular/router'),
      '@foblex/2d': dependencyVersion('@foblex/2d'),
      '@foblex/flow': dependencyVersion('@foblex/flow'),
      '@foblex/mediator': dependencyVersion('@foblex/mediator'),
      '@foblex/platform': dependencyVersion('@foblex/platform'),
      '@foblex/utils': dependencyVersion('@foblex/utils'),
      echarts: dependencyVersion('echarts'),
      rxjs: dependencyVersion('rxjs'),
      tslib: dependencyVersion('tslib'),
      'zone.js': dependencyVersion('zone.js'),
      ...packageDependencies,
    },
    devDependencies: {
      '@angular/build': dependencyVersion('@angular/build'),
      '@angular/cli': dependencyVersion('@angular/cli'),
      '@angular/compiler-cli': dependencyVersion('@angular/compiler-cli'),
      typescript: dependencyVersion('typescript'),
      vitest: dependencyVersion('vitest'),
    },
  });

  writeJson(path.join(consumerRoot, 'angular.json'), {
    $schema: './node_modules/@angular/cli/lib/config/schema.json',
    version: 1,
    newProjectRoot: 'projects',
    projects: {
      smoke: {
        projectType: 'application',
        root: '',
        sourceRoot: 'src',
        prefix: 'app',
        architect: {
          build: {
            builder: '@angular/build:application',
            options: {
              browser: 'src/main.ts',
              index: 'src/index.html',
              outputPath: 'dist/smoke',
              styles: ['src/styles.css'],
              tsConfig: 'tsconfig.app.json',
            },
            configurations: {
              production: {
                optimization: true,
                outputHashing: 'none',
                sourceMap: false,
              },
            },
            defaultConfiguration: 'production',
          },
        },
      },
    },
  });

  writeJson(path.join(consumerRoot, 'tsconfig.json'), {
    compileOnSave: false,
    compilerOptions: {
      baseUrl: './',
      experimentalDecorators: true,
      importHelpers: true,
      lib: ['ES2022', 'DOM'],
      module: 'preserve',
      moduleResolution: 'bundler',
      skipLibCheck: false,
      strict: true,
      target: 'ES2022',
      useDefineForClassFields: false,
    },
    angularCompilerOptions: {
      strictInjectionParameters: true,
      strictTemplates: true,
    },
  });

  writeJson(path.join(consumerRoot, 'tsconfig.app.json'), {
    extends: './tsconfig.json',
    compilerOptions: {
      outDir: './out-tsc/app',
      types: [],
    },
    files: ['src/main.ts'],
  });

  writeJson(path.join(consumerRoot, 'tsconfig.nodenext.json'), {
    compilerOptions: {
      lib: ['ES2022', 'DOM'],
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      noEmit: true,
      skipLibCheck: false,
      strict: true,
      target: 'ES2022',
    },
    files: ['src/package-imports.ts'],
  });

  writeText(
    'src/index.html',
    '<!doctype html><html><head><meta charset="utf-8"><title>TailNG smoke test</title><base href="/"></head><body><app-root></app-root></body></html>\n',
  );
  writeText(
    'src/styles.css',
    "@import '@tailng-ui/theme/index.css';\n@import '@tailng-ui/theme/component-contracts/index.css';\n@import '@tailng-ui/flow/styles.css';\n",
  );
  writeText(
    'src/package-imports.ts',
    `import * as cdk from '@tailng-ui/cdk';
import * as cdkA11y from '@tailng-ui/cdk/a11y';
import * as cdkAdapters from '@tailng-ui/cdk/adapters';
import * as cdkCollections from '@tailng-ui/cdk/collections';
import * as cdkCore from '@tailng-ui/cdk/core';
import * as cdkOverlay from '@tailng-ui/cdk/overlay';
import * as cdkRuntime from '@tailng-ui/cdk/runtime';
import * as charts from '@tailng-ui/charts';
import * as components from '@tailng-ui/components';
import * as flow from '@tailng-ui/flow';
import * as flowLayoutDagre from '@tailng-ui/flow/layout-dagre';
import * as icons from '@tailng-ui/icons';
import * as iconCore from '@tailng-ui/icons/core';
import * as primitives from '@tailng-ui/primitives';
import * as theme from '@tailng-ui/theme';

export const publicApis = {
  cdk,
  cdkA11y,
  cdkAdapters,
  cdkCollections,
  cdkCore,
  cdkOverlay,
  cdkRuntime,
  charts,
  components,
  flow,
  flowLayoutDagre,
  icons,
  iconCore,
  primitives,
  theme,
};
`,
  );
  writeText(
    'src/main.ts',
    `import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { publicApis } from './package-imports';

@Component({
  selector: 'app-root',
  standalone: true,
  template: '<p>TailNG packed package smoke test</p>',
})
class AppComponent {
  readonly exportedApiCount = Object.values(publicApis).reduce(
    (count, api) => count + Object.keys(api).length,
    0,
  );
}

bootstrapApplication(AppComponent).catch((error: unknown) => console.error(error));
`,
  );
  writeText('src/setup.ts', "import '@angular/compiler';\n");
  writeText(
    'src/packages.spec.ts',
    `import { expect, test } from 'vitest';
import * as cdk from '@tailng-ui/cdk';
import * as cdkCollections from '@tailng-ui/cdk/collections';
import { TngIcon as RootTngIcon } from '@tailng-ui/icons';
import { TngIcon as CoreTngIcon } from '@tailng-ui/icons/core';
import { publicApis } from './package-imports';

test('externalized APF packages load through their public exports', () => {
  expect(Object.values(publicApis).every((api) => Object.keys(api).length > 0)).toBe(true);
  expect(cdk.createSelectionModel).toBe(cdkCollections.createSelectionModel);
  expect(RootTngIcon).toBe(CoreTngIcon);
});
`,
  );
  writeText(
    'vitest.config.mjs',
    `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['./src/setup.ts'],
  },
});
`,
  );
  writeText(
    'src/node-import.mjs',
    `await import('@angular/compiler');

const packageNames = [
  '@tailng-ui/cdk',
  '@tailng-ui/cdk/a11y',
  '@tailng-ui/cdk/adapters',
  '@tailng-ui/cdk/collections',
  '@tailng-ui/cdk/core',
  '@tailng-ui/cdk/overlay',
  '@tailng-ui/cdk/runtime',
  '@tailng-ui/charts',
  '@tailng-ui/components',
  '@tailng-ui/flow',
  '@tailng-ui/flow/layout-dagre',
  '@tailng-ui/icons',
  '@tailng-ui/icons/core',
  '@tailng-ui/primitives',
  '@tailng-ui/theme',
];
const modules = await Promise.all(packageNames.map((name) => import(name)));
if (modules.some((api) => Object.keys(api).length === 0)) {
  throw new Error('A public TailNG entry point loaded with no exports');
}

const [cdk, , , collections, , , , , , , , icons, iconCore] = modules;
if (cdk.createSelectionModel !== collections.createSelectionModel) {
  throw new Error('CDK root and secondary entry points have different symbol identities');
}
if (icons.TngIcon !== iconCore.TngIcon) {
  throw new Error('Icon root and core entry points have different TngIcon identities');
}
`,
  );
}

try {
  stagePackages();
  const tarballs = packPackages();
  writeConsumer(tarballs);

  run(npmCommand, ['install', '--no-audit', '--no-fund', '--package-lock=false'], {
    cwd: consumerRoot,
    inherit: true,
  });

  run(process.execPath, ['src/node-import.mjs'], { cwd: consumerRoot });

  const typeScriptPath = path.join(consumerRoot, 'node_modules/typescript/bin/tsc');
  run(process.execPath, [typeScriptPath, '-p', 'tsconfig.nodenext.json'], {
    cwd: consumerRoot,
  });

  const vitestPath = path.join(consumerRoot, 'node_modules/vitest/vitest.mjs');
  run(process.execPath, [vitestPath, 'run'], { cwd: consumerRoot });

  const cliPath = path.join(consumerRoot, 'node_modules/@angular/cli/bin/ng.js');
  const buildOutput = run(
    process.execPath,
    [cliPath, 'build', '--configuration', 'production', '--no-progress'],
    { cwd: consumerRoot },
  );

  if (/CommonJS or AMD dependencies can cause optimization bailouts/i.test(buildOutput)) {
    fail('production Angular build reported a CommonJS optimization bailout');
  }

  console.log(
    'angular-package-smoke-test: Node ESM, NodeNext, Vitest, and Angular production consumers passed',
  );
} finally {
  if (keepTemp) {
    console.log(`angular-package-smoke-test: retained temporary workspace at ${tempRoot}`);
  } else {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
