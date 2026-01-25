import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import serveHandler from 'serve-handler';
import puppeteer from 'puppeteer';

const DIST_DIR = 'dist/apps/docs';
const ROUTES_FILE = 'apps/docs/prerender-routes.txt';
const PORT = 4173;

const indexHtmlPath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  throw new Error(`index.html not found at ${indexHtmlPath}. Run "nx build docs" first.`);
}
const indexHtml = fs.readFileSync(indexHtmlPath);

const routes = fs
  .readFileSync(ROUTES_FILE, 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))
  .map((r) => (r.startsWith('/') ? r : `/${r}`));

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
  const url = req.url ?? '/';

  // Serve built assets from dist
  if (isAssetRequest(url)) {
    return serveHandler(req, res, { public: DIST_DIR });
  }

  // SPA fallback: always serve index.html for routes
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(indexHtml);
});

await new Promise((resolve) => server.listen(PORT, resolve));

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();

for (const route of routes) {
  const url = `http://localhost:${PORT}${route}`;
  await page.goto(url, { waitUntil: 'networkidle0' });

  const html = await page.content();

  const dir = path.join(DIST_DIR, route === '/' ? '' : route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);

  console.log(`prerendered ${route}`);
}

await browser.close();
server.close();

console.log('prerender complete');
