/// <reference types="vitest" />
import angular from '@analogjs/vite-plugin-angular';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
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
  resolve: {
    alias: [{ find: /^@tailng-ui\/ai$/, replacement: resolve(projectRoot, 'src/index.ts') }],
  },
  test: {
    name: 'ai',
    include: ['src/**/*.spec.ts'],
    exclude: ['src/**/*.browser.spec.ts'],
    environment: 'jsdom',
    setupFiles: [resolve(projectRoot, './src/test-setup.ts')],
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../../coverage/libs/tailng-ui/ai',
      reporter: ['text', 'lcov'],
    },
  },
});
