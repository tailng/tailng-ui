import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import serveHandler from 'serve-handler';
import puppeteer from 'puppeteer';

const DIST_DIR = process.env.DOCS_DIST ?? 'dist/apps/tailng-ui/docs/browser';
const ROUTES_FILE =
  process.env.DOCS_PRERENDER_ROUTES_FILE ?? 'apps/tailng-ui/docs/prerender-routes.txt';
const REQUESTED_PORT = Number(process.env.PUPPETEER_PRERENDER_PORT ?? 0);
const HOST = '127.0.0.1';
const NAVIGATION_TIMEOUT_MS = Number(process.env.PUPPETEER_PRERENDER_NAV_TIMEOUT_MS ?? 120000);
const LAUNCH_TIMEOUT_MS = Number(process.env.PUPPETEER_PRERENDER_LAUNCH_TIMEOUT_MS ?? 120000);
const READY_TIMEOUT_MS = Number(process.env.PUPPETEER_PRERENDER_READY_TIMEOUT_MS ?? 120000);
const POST_GOTO_WAIT_MS = Number(process.env.PUPPETEER_PRERENDER_POST_GOTO_WAIT_MS ?? 0);
const PRERENDER_CONCURRENCY = Number(process.env.PUPPETEER_PRERENDER_CONCURRENCY ?? 1);
const ROUTE_RETRIES = Number(process.env.PUPPETEER_PRERENDER_ROUTE_RETRIES ?? 1);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const assertNonNegativeNumber = (name, value) => {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a non-negative number. Received: ${value}`);
  }
};

const assertPositiveInteger = (name, value) => {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer. Received: ${value}`);
  }
};

const assertNonNegativeInteger = (name, value) => {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer. Received: ${value}`);
  }
};

if (!Number.isInteger(REQUESTED_PORT) || REQUESTED_PORT < 0 || REQUESTED_PORT > 65535) {
  throw new Error(
    `PUPPETEER_PRERENDER_PORT must be an integer between 0 and 65535. Received: ${REQUESTED_PORT}`,
  );
}
assertPositiveInteger('PUPPETEER_PRERENDER_NAV_TIMEOUT_MS', NAVIGATION_TIMEOUT_MS);
assertPositiveInteger('PUPPETEER_PRERENDER_LAUNCH_TIMEOUT_MS', LAUNCH_TIMEOUT_MS);
assertPositiveInteger('PUPPETEER_PRERENDER_READY_TIMEOUT_MS', READY_TIMEOUT_MS);
assertNonNegativeNumber('PUPPETEER_PRERENDER_POST_GOTO_WAIT_MS', POST_GOTO_WAIT_MS);
assertPositiveInteger('PUPPETEER_PRERENDER_CONCURRENCY', PRERENDER_CONCURRENCY);
assertNonNegativeInteger('PUPPETEER_PRERENDER_ROUTE_RETRIES', ROUTE_RETRIES);

const resolveChromeExecutablePath = () => {
  const explicitPath = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (explicitPath && fs.existsSync(explicitPath)) {
    return explicitPath;
  }

  const cacheDir =
    process.env.PUPPETEER_CACHE_DIR ?? path.join(os.homedir(), '.cache', 'puppeteer');
  const sortEntriesByVersion = (entries) =>
    [...entries].sort((a, b) => {
      const versionOf = (name) => {
        const match = name.match(/(\d+)\.(\d+)\.(\d+)\.(\d+)/);
        if (!match) return [0, 0, 0, 0];
        return match.slice(1).map((value) => Number.parseInt(value, 10));
      };
      const av = versionOf(a.name);
      const bv = versionOf(b.name);
      for (let index = 0; index < 4; index += 1) {
        if (av[index] !== bv[index]) {
          return bv[index] - av[index];
        }
      }
      return b.name.localeCompare(a.name);
    });

  const chromeRoot = path.join(cacheDir, 'chrome');
  if (fs.existsSync(chromeRoot)) {
    const entries = sortEntriesByVersion(
      fs.readdirSync(chromeRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()),
    );
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const versionDir = path.join(chromeRoot, entry.name);
      const candidate = path.join(
        versionDir,
        'chrome-mac-arm64',
        'Google Chrome for Testing.app',
        'Contents',
        'MacOS',
        'Google Chrome for Testing',
      );
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  // Fallback to headless-shell if full Chrome app is unavailable.
  const shellRoot = path.join(cacheDir, 'chrome-headless-shell');
  if (fs.existsSync(shellRoot)) {
    const entries = sortEntriesByVersion(
      fs.readdirSync(shellRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()),
    );
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const versionDir = path.join(shellRoot, entry.name);
      const candidate = path.join(
        versionDir,
        'chrome-headless-shell-mac-arm64',
        'chrome-headless-shell',
      );
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  return null;
};

const indexHtmlPath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  throw new Error(`index.html not found at ${indexHtmlPath}. Run "pnpm run build:docs" first.`);
}
const indexHtml = fs.readFileSync(indexHtmlPath);

const routes = fs
  .readFileSync(ROUTES_FILE, 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))
  .map((r) => (r.startsWith('/') ? r : `/${r}`));

if (routes.length === 0) {
  throw new Error(`No prerender routes found in ${ROUTES_FILE}.`);
}

const isAssetRequest = (url) =>
  url === '/favicon.ico' ||
  url.startsWith('/assets/') ||
  url.endsWith('.js') ||
  url.endsWith('.css') ||
  url.endsWith('.map') ||
  url.endsWith('.png') ||
  url.endsWith('.jpg') ||
  url.endsWith('.jpeg') ||
  url.endsWith('.svg') ||
  url.endsWith('.webp') ||
  url.endsWith('.woff') ||
  url.endsWith('.woff2') ||
  url.endsWith('.ttf') ||
  url.endsWith('.json') ||
  url.endsWith('.txt') ||
  url.endsWith('.xml');

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${HOST}`).pathname;

  // Serve built assets from dist
  if (isAssetRequest(url)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    // serve-handler@6.1.6 leaks its pre-opened file stream on ETag-driven 304 responses.
    return serveHandler(req, res, { etag: false, public: DIST_DIR });
  }

  // SPA fallback
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(indexHtml);
});

await new Promise((resolve, reject) => {
  const handleError = (error) => reject(error);
  server.once('error', handleError);
  server.listen(REQUESTED_PORT, HOST, () => {
    server.off('error', handleError);
    resolve();
  });
});

const serverAddress = server.address();
if (serverAddress === null || typeof serverAddress === 'string') {
  throw new Error('Unable to resolve the prerender server address.');
}
const serverPort = serverAddress.port;
console.log(`prerender: server = http://${HOST}:${serverPort}`);

const chromeExecutablePath = resolveChromeExecutablePath() ?? undefined;
console.log(
  `prerender: browser executable = ${chromeExecutablePath ?? 'puppeteer-managed default'}`,
);

/* ---------------------------------------------
 * PATCH: absolutize known build assets
 * ------------------------------------------- */
const absolutizeAssets = (html) =>
  html
    // stylesheet
    .replace(/href=["'](styles\.css(?:\?[^"']*)?)["']/g, 'href="/$1"')

    // main entry
    .replace(/src=["'](main\.js(?:\?[^"']*)?)["']/g, 'src="/$1"')

    // Vite / Rollup chunks (modulepreload + script)
    .replace(/href=["'](chunk-[^"']+\.js(?:\?[^"']*)?)["']/g, 'href="/$1"')
    .replace(/src=["'](chunk-[^"']+\.js(?:\?[^"']*)?)["']/g, 'src="/$1"')

    // other root-level build assets (fonts, maps, images, etc.)
    .replace(
      /href=["']([^"']+\.(?:css|js|map|woff2?|ttf|svg|png|jpe?g|webp)(?:\?[^"']*)?)["']/g,
      (m, v) =>
        v.startsWith('/') || v.startsWith('http') || v.startsWith('//') ? m : `href="/${v}"`,
    );

const configurePage = async (page) => {
  page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT_MS);
  page.setDefaultTimeout(READY_TIMEOUT_MS);
  await page.setCacheEnabled(true);
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.evaluateOnNewDocument(() => {
    globalThis.__TAILNG_DOCS_PRERENDER__ = true;
  });
};

const createPage = async (browser) => {
  const page = await browser.newPage();
  await configurePage(page);
  return page;
};

const waitForRenderReady = async (page) => {
  await page.waitForFunction(
    () => {
      const routeReady = document.documentElement.dataset['docsRouteReady'];
      const appRoot = document.querySelector('app-root[ng-version]');
      const routeLoading = document.querySelector('[aria-busy="true"]');
      const codeHighlighting = document.querySelector('[data-highlighting="pending"]');

      return (
        routeReady === globalThis.location.pathname &&
        appRoot !== null &&
        routeLoading === null &&
        codeHighlighting === null
      );
    },
    { polling: 'raf', timeout: READY_TIMEOUT_MS },
  );

  if (POST_GOTO_WAIT_MS > 0) {
    await sleep(POST_GOTO_WAIT_MS);
  }
};

const renderRoute = async (page, route) => {
  const url = `http://${HOST}:${serverPort}${route}`;
  const response = await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: NAVIGATION_TIMEOUT_MS,
  });

  if (response === null || !response.ok()) {
    throw new Error(`Navigation returned ${response?.status() ?? 'no response'} for ${route}.`);
  }

  await waitForRenderReady(page);

  const html = absolutizeAssets(await page.content());
  const dir = path.join(DIST_DIR, route === '/' ? '' : route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
};

const closeServer = async () => {
  if (!server.listening) {
    return;
  }

  await new Promise((resolve, reject) => {
    server.close((error) => (error === undefined ? resolve() : reject(error)));
  });
};

let browser;
try {
  browser = await puppeteer.launch({
    headless: 'new',
    timeout: LAUNCH_TIMEOUT_MS,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: chromeExecutablePath,
  });

  const workerCount = Math.min(PRERENDER_CONCURRENCY, routes.length);
  let nextRouteIndex = 0;
  let completedRouteCount = 0;
  let firstFailure = null;

  console.log(`prerender: routes = ${routes.length}, workers = ${workerCount}`);

  const runWorker = async (workerId) => {
    let page = await createPage(browser);

    try {
      while (firstFailure === null) {
        const routeIndex = nextRouteIndex;
        nextRouteIndex += 1;
        if (routeIndex >= routes.length) {
          return;
        }

        const route = routes[routeIndex];
        const startedAt = Date.now();
        const maxAttempts = ROUTE_RETRIES + 1;
        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
          try {
            await renderRoute(page, route);
            completedRouteCount += 1;
            console.log(
              `[${completedRouteCount}/${routes.length}] prerendered ${route} ` +
                `(${Date.now() - startedAt}ms, worker ${workerId})`,
            );
            break;
          } catch (error) {
            if (attempt === maxAttempts) {
              firstFailure ??= { error, route };
              break;
            }

            console.warn(
              `prerender: ${route} failed on attempt ${attempt}/${maxAttempts}: ` +
                `${error?.message ?? String(error)}; retrying with a fresh page`,
            );
            await page.close();
            page = await createPage(browser);
          }
        }
      }
    } finally {
      await page.close();
    }
  };

  await Promise.all(Array.from({ length: workerCount }, (_, index) => runWorker(index + 1)));

  if (firstFailure !== null) {
    throw new Error(
      `Failed to prerender ${firstFailure.route}: ${firstFailure.error?.message ?? String(firstFailure.error)}`,
      { cause: firstFailure.error },
    );
  }

  console.log(`prerender complete: ${completedRouteCount} routes`);
} finally {
  await browser?.close();
  await closeServer();
}
