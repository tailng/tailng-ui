/// <reference types="vitest" />
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    tsconfigPaths({ root: resolve(projectRoot, '../../..'), projects: ['tsconfig.base.json'] }),
  ],
  root: projectRoot,
  test: {
    name: 'flow-layout-dagre',
    include: ['src/**/*.spec.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../../coverage/libs/tailng-ui/flow-layout-dagre',
      reporter: ['text', 'lcov'],
    },
  },
  resolve: {
    alias: {
      '@tailng-ui/flow': resolve(projectRoot, '../flow/src/index.ts'),
    },
  },
});
