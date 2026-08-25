/// <reference types="vitest" />
import angular from '@analogjs/vite-plugin-angular';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { createTailngUiCdkSecondaryAliases } from '../../../tools/vite/tailng-ui-source-aliases';

const projectRoot = dirname(fileURLToPath(import.meta.url));

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
    name: 'flow',
    include: ['src/**/*.spec.ts'],
    exclude: ['src/**/*.browser.spec.ts'],
    environment: 'jsdom',
    setupFiles: [resolve(projectRoot, './src/test-setup.ts')],
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
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../../coverage/libs/tailng-ui/flow',
      reporter: ['text', 'lcov'],
    },
  },
});
