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
        find: '@tailng-ui/cdk/core',
        replacement: resolve(projectRoot, '../../../libs/tailng-ui/cdk/src/core/index.ts'),
      },
      {
        find: '@tailng-ui/cdk/overlay',
        replacement: resolve(projectRoot, '../../../libs/tailng-ui/cdk/src/overlay/index.ts'),
      },
      {
        find: '@tailng-ui/cdk',
        replacement: resolve(projectRoot, '../../../libs/tailng-ui/cdk/src/index.ts'),
      },
      {
        find: '@tailng-ui/components',
        replacement: resolve(projectRoot, '../../../libs/tailng-ui/components/src/index.ts'),
      },
      {
        find: '@tailng-ui/flow',
        replacement: resolve(projectRoot, '../../../libs/tailng-ui/flow/src/index.ts'),
      },
      {
        find: '@tailng-ui/primitives',
        replacement: resolve(projectRoot, '../../../libs/tailng-ui/primitives/src/index.ts'),
      },
      {
        find: '@tailng-ui/registry',
        replacement: resolve(projectRoot, '../../../libs/tailng-ui/registry/src/index.ts'),
      },
    ],
  },
  test: {
    name: 'docs',
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
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
      reportsDirectory: '../../../coverage/apps/tailng-ui/docs',
      reporter: ['text', 'lcov'],
    },
  },
});
