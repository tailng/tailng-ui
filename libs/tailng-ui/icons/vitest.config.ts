/// <reference types="vitest" />
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    angular({
      tsconfig: resolve(projectRoot, '../../../tsconfig.base.json'),
    }),
    tsconfigPaths({ root: resolve(projectRoot, '../../..'), projects: ['tsconfig.base.json'] }),
  ],
  root: projectRoot,
  test: {
    name: 'icons',
    include: ['src/**/*.spec.ts'],
    environment: 'jsdom',
    setupFiles: [resolve(projectRoot, './src/test-setup.ts')],
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../../coverage/libs/tailng-ui/icons',
      reporter: ['text', 'lcov'],
    },
  },
});
