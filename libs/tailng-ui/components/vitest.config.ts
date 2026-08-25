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
        find: '@tailng-ui/cdk/core',
        replacement: resolve(projectRoot, '../cdk/src/core/index.ts'),
      },
      {
        find: '@tailng-ui/cdk/overlay',
        replacement: resolve(projectRoot, '../cdk/src/overlay/index.ts'),
      },
      { find: '@tailng-ui/cdk', replacement: resolve(projectRoot, '../cdk/src/index.ts') },
      {
        find: '@tailng-ui/primitives',
        replacement: resolve(projectRoot, '../primitives/src/index.ts'),
      },
    ],
  },
  test: {
    name: 'components',
    include: ['src/**/*.spec.ts'],
    environment: 'jsdom',
    setupFiles: [resolve(projectRoot, './src/test-setup.ts')],
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../../coverage/libs/tailng-ui/components',
      reporter: ['text', 'lcov'],
    },
  },
});
