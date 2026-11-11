/// <reference types="vitest" />
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: projectRoot,
  resolve: {
    alias: [{ find: /^@tailng-ui\/ai$/, replacement: resolve(projectRoot, 'src/index.ts') }],
  },
  test: {
    name: 'ai',
    include: ['src/**/*.spec.ts'],
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reportsDirectory: '../../../coverage/libs/tailng-ui/ai',
      reporter: ['text', 'lcov'],
    },
  },
});
