/// <reference types="vitest" />
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { createTailngUiCdkSecondaryAliases } from '../../../tools/vite/tailng-ui-source-aliases';

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    tsconfigPaths({ root: resolve(projectRoot, '../../..'), projects: ['tsconfig.base.json'] }),
  ],
  root: projectRoot,
  resolve: {
    alias: createTailngUiCdkSecondaryAliases(resolve(projectRoot, '../../..')),
  },
  test: {
    name: 'cdk',
    include: ['src/**/*.spec.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../../coverage/libs/tailng-ui/cdk',
      reporter: ['text', 'lcov'],
    },
  },
});
