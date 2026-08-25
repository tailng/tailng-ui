import angular from '@analogjs/vite-plugin-angular';
import { playwright } from '@vitest/browser-playwright';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { createTailngUiCdkSecondaryAliases } from '../../../tools/vite/tailng-ui-source-aliases';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const chromeExecutable = puppeteer.executablePath();
const browserProvider = existsSync(chromeExecutable)
  ? playwright({ launchOptions: { executablePath: chromeExecutable } })
  : playwright();

export default defineConfig({
  plugins: [
    angular({
      tsconfig: resolve(projectRoot, '../../../tsconfig.base.json'),
    }),
    tsconfigPaths({ root: resolve(projectRoot, '../../..'), projects: ['tsconfig.base.json'] }),
  ],
  root: projectRoot,
  resolve: {
    alias: [
      ...createTailngUiCdkSecondaryAliases(resolve(projectRoot, '../../..')),
      {
        find: '@foblex/2d',
        replacement: resolve(projectRoot, '../../../node_modules/@foblex/2d/fesm2015/foblex-2d.js'),
      },
      {
        find: '@foblex/mediator',
        replacement: resolve(
          projectRoot,
          '../../../node_modules/@foblex/mediator/fesm2015/foblex-mediator.js',
        ),
      },
      {
        find: '@foblex/utils',
        replacement: resolve(
          projectRoot,
          '../../../node_modules/@foblex/utils/fesm2015/foblex-utils.js',
        ),
      },
      {
        find: '@tailng-ui/components',
        replacement: resolve(projectRoot, '../components/src/index.ts'),
      },
      { find: '@tailng-ui/icons/core', replacement: resolve(projectRoot, '../icons/src/core.ts') },
      { find: /^@tailng-ui\/icons$/, replacement: resolve(projectRoot, '../icons/src/index.ts') },
      { find: '@tailng-ui/cdk', replacement: resolve(projectRoot, '../cdk/src/index.ts') },
      {
        find: '@tailng-ui/primitives',
        replacement: resolve(projectRoot, '../primitives/src/index.ts'),
      },
    ],
  },
  test: {
    name: 'flow-browser',
    include: ['src/**/*.browser.spec.ts'],
    setupFiles: [resolve(projectRoot, './src/browser-test-setup.ts')],
    browser: {
      enabled: true,
      headless: true,
      provider: browserProvider,
      instances: [{ browser: 'chromium' }],
      viewport: { width: 1280, height: 800 },
    },
    server: {
      deps: {
        inline: [
          '@foblex/2d',
          '@foblex/flow',
          '@foblex/mediator',
          '@foblex/platform',
          '@foblex/utils',
        ],
      },
    },
  },
});
