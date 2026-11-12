import angular from '@analogjs/vite-plugin-angular';
import { playwright } from '@vitest/browser-playwright';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

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
  test: {
    name: 'icons-browser',
    include: ['src/**/*.browser.spec.ts'],
    setupFiles: [resolve(projectRoot, './src/browser-test-setup.ts')],
    browser: {
      enabled: true,
      headless: true,
      provider: browserProvider,
      instances: [{ browser: 'chromium' }],
    },
  },
});
