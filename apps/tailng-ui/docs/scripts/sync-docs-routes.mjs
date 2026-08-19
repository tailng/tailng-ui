import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(scriptDir, '..');
const pagesDir = path.join(docsRoot, 'src/app/pages');
const prerenderPath = path.join(docsRoot, 'prerender-routes.txt');
const searchPath = path.join(docsRoot, 'public/search/index.json');
const checkMode = process.argv.includes('--check');

const DOC_SECTIONS = ['overview', 'api', 'styling', 'examples', 'ownable-install'];
const CHART_SECTIONS = ['overview', 'api', 'styling', 'examples'];
const ICON_SECTIONS = ['overview', 'api', 'styling', 'examples'];
const SECTION_ROOT_ROUTES = ['/components', '/charts', '/headless', '/theme', '/ownable', '/icons'];
const THEME_ROUTES = [
  '/theme/guides/getting-started',
  '/theme/guides/creating-a-new-theme',
  '/theme/tools/download-example-theme',
  '/theme/tools/theme-builder',
  '/theme/reference/api',
  '/theme/reference/styling',
  '/theme/reference/examples',
];

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function addRoute(routes, route) {
  routes.add(route.replace(/\/{2,}/g, '/'));
}

function parseDocsGroupSlugs(dataFilePath) {
  const source = readFile(dataFilePath);
  const groups = [];

  for (const match of source.matchAll(
    /export const (\w+_GROUP): [\s\S]*?id:\s*'([^']+)'[\s\S]*?items:\s*\[([\s\S]*?)\n  \],/g,
  )) {
    const groupId = match[2];
    const slugs = [...match[3].matchAll(/slug:\s*'([^']+)'/g)].map((slugMatch) => slugMatch[1]);
    groups.push({ groupId, slugs });
  }

  return groups;
}

function parseGettingStartedSlugs(dataFilePath, groupExportName) {
  const source = readFile(dataFilePath);
  const marker = `export const ${groupExportName}`;
  const start = source.indexOf(marker);
  if (start === -1) {
    return [];
  }

  const itemsStart = source.indexOf('items: [', start);
  const itemsEnd = source.indexOf('\n  ],', itemsStart);
  if (itemsStart === -1 || itemsEnd === -1) {
    return [];
  }

  const itemsBlock = source.slice(itemsStart, itemsEnd);
  return [...itemsBlock.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
}

function collectLandingOnlyDocsRoutes(section, routes) {
  const dataFileName =
    section === 'components' ? 'component-docs.data.ts' : 'headless-docs.data.ts';
  const dataFilePath = path.join(pagesDir, section, dataFileName);

  for (const group of parseDocsGroupSlugs(dataFilePath)) {
    if (group.groupId === 'getting-started') {
      continue;
    }

    for (const slug of group.slugs) {
      const baseRoute = `/${section}/${group.groupId}/${slug}`;
      const itemRoutesFile = path.join(pagesDir, section, group.groupId, slug, 'routes.ts');

      if (!fs.existsSync(itemRoutesFile)) {
        addRoute(routes, baseRoute);
      }
    }
  }
}

function readLiteralRoutePaths(routesFile) {
  if (!fs.existsSync(routesFile)) {
    return [];
  }

  const content = readFile(routesFile);
  const paths = new Set();

  for (const match of content.matchAll(/path:\s*['"]([^'"]+)['"]/g)) {
    const segment = match[1];
    if (segment !== '' && segment !== '**' && !segment.includes(':')) {
      paths.add(segment);
    }
  }

  return [...paths];
}

function readDocSections(routesFile) {
  if (!fs.existsSync(routesFile)) {
    return [];
  }

  const content = readFile(routesFile);
  return DOC_SECTIONS.filter((section) => new RegExp(`path:\\s*['"]${section}['"]`).test(content));
}

function collectNestedDocsRoutes(section, routes) {
  const sectionDir = path.join(pagesDir, section);

  for (const categoryEntry of fs.readdirSync(sectionDir, { withFileTypes: true })) {
    if (!categoryEntry.isDirectory()) {
      continue;
    }

    const category = categoryEntry.name;
    if (category === 'landing' || category === 'series' || category === 'shared') {
      continue;
    }

    const categoryDir = path.join(sectionDir, category);

    if (category === 'getting-started') {
      const dataFileName =
        section === 'components' ? 'component-docs.data.ts' : 'headless-docs.data.ts';
      const groupExportName =
        section === 'components'
          ? 'COMPONENTS_GETTING_STARTED_GROUP'
          : 'HEADLESS_GETTING_STARTED_GROUP';
      const dataFilePath = path.join(pagesDir, section, dataFileName);

      for (const slug of parseGettingStartedSlugs(dataFilePath, groupExportName)) {
        addRoute(routes, `/${section}/${category}/${slug}`);
      }
      continue;
    }

    if (category === 'composition' && section === 'charts') {
      addRoute(routes, `/${section}/${category}/semi-headless`);
      continue;
    }

    for (const itemEntry of fs.readdirSync(categoryDir, { withFileTypes: true })) {
      if (!itemEntry.isDirectory()) {
        continue;
      }

      const item = itemEntry.name;
      if (item === 'landing' || item === 'shared') {
        continue;
      }

      const itemRoutesFile = path.join(categoryDir, item, 'routes.ts');
      const baseRoute = `/${section}/${category}/${item}`;

      if (!fs.existsSync(itemRoutesFile)) {
        continue;
      }

      const sections = readDocSections(itemRoutesFile);
      if (sections.length > 0) {
        addRoute(routes, baseRoute);
        for (const docSection of sections) {
          addRoute(routes, `${baseRoute}/${docSection}`);
        }
      } else if (/loadComponent:/.test(readFile(itemRoutesFile))) {
        addRoute(routes, baseRoute);
      }
    }
  }
}

function parseChartSeriesConfigs() {
  const source = readFile(path.join(pagesDir, 'charts/series/chart-series-docs.data.ts'));
  const marker = 'export const CHART_SERIES_DOC_CONFIGS';
  const start = source.indexOf(marker);
  if (start === -1) {
    throw new Error('Missing CHART_SERIES_DOC_CONFIGS');
  }

  const configs = [];
  const blocks = source.slice(start).match(/\{\s*\n\s*categoryId:[\s\S]*?\n  \},/g) ?? [];

  for (const block of blocks) {
    const categoryId = block.match(/categoryId:\s*'([^']+)'/)?.[1];
    const slug = block.match(/slug:\s*'([^']+)'/)?.[1];
    if (categoryId && slug) {
      configs.push({ categoryId, slug });
    }
  }

  return configs;
}

function collectChartRoutes(routes) {
  addRoute(routes, '/charts/getting-started/overview');
  addRoute(routes, '/charts/getting-started/installation');
  addRoute(routes, '/charts/composition/semi-headless');

  for (const config of parseChartSeriesConfigs()) {
    for (const section of CHART_SECTIONS) {
      addRoute(routes, `/charts/${config.categoryId}/${config.slug}/${section}`);
    }
  }
}

function parseOwnableRoutes() {
  const routesFile = path.join(pagesDir, 'ownable/routes.ts');
  return readLiteralRoutePaths(routesFile).map((routePath) => `/ownable/${routePath}`);
}

function collectAllRoutes() {
  const routes = new Set(['/']);

  for (const sectionRoot of SECTION_ROOT_ROUTES) {
    addRoute(routes, sectionRoot);
  }

  addRoute(routes, '/cdk');

  for (const iconSection of ICON_SECTIONS) {
    addRoute(routes, `/icons/${iconSection}`);
  }

  for (const themeRoute of THEME_ROUTES) {
    addRoute(routes, themeRoute);
  }

  for (const ownableRoute of parseOwnableRoutes()) {
    addRoute(routes, ownableRoute);
  }

  collectNestedDocsRoutes('components', routes);
  collectLandingOnlyDocsRoutes('components', routes);
  collectNestedDocsRoutes('headless', routes);
  collectLandingOnlyDocsRoutes('headless', routes);
  collectChartRoutes(routes);

  return [...routes].sort((left, right) => left.localeCompare(right));
}

function titleCaseSegment(segment) {
  return segment
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildFallbackSearchEntry(url) {
  const parts = url.split('/').filter(Boolean);
  const sectionParts = parts.slice(0, -1);
  const leaf = parts.at(-1) ?? '';

  const sectionLabels = {
    components: 'Components',
    headless: 'Headless',
    charts: 'Charts',
    ownable: 'Ownable',
    theme: 'Theme',
    icons: 'Icons',
    cdk: 'CDK',
  };

  const formattedSection =
    sectionParts.length > 0
      ? `${sectionLabels[sectionParts[0]] ?? titleCaseSegment(sectionParts[0])}${sectionParts.length > 1 ? ` / ${sectionParts.slice(1).map(titleCaseSegment).join(' / ')}` : ''}`
      : 'Docs';

  const title =
    ['overview', 'api', 'styling', 'examples', 'ownable-install'].includes(leaf) && parts.length > 1
      ? `${titleCaseSegment(parts.at(-2) ?? leaf)} ${titleCaseSegment(leaf)}`
      : titleCaseSegment(leaf);

  return {
    title,
    description: `${title} documentation.`,
    section: formattedSection,
    url,
    tags: [...new Set(parts.map((part) => part.toLowerCase()))],
  };
}

function buildSearchIndex(routes) {
  const existingSource = readFile(searchPath);
  const existing = JSON.parse(existingSource);
  const byUrl = new Map(existing.map((entry) => [entry.url, entry]));
  const routeSet = new Set(routes);

  const staleUrls = [...byUrl.keys()].filter((url) => !routeSet.has(url));
  for (const staleUrl of staleUrls) {
    byUrl.delete(staleUrl);
  }

  for (const url of routes) {
    if (!byUrl.has(url)) {
      byUrl.set(url, buildFallbackSearchEntry(url));
    }
  }

  const merged = [...byUrl.values()].sort((left, right) => left.url.localeCompare(right.url));
  const source = `${JSON.stringify(merged, null, 2)}\n`;

  return {
    changed: source !== existingSource,
    source,
    total: merged.length,
    added: routes.filter((url) => !existing.some((entry) => entry.url === url)).length,
    removed: staleUrls.length,
    staleUrls,
  };
}

function main() {
  const routes = collectAllRoutes();
  const routesSource = `${routes.join('\n')}\n`;
  const routesChanged = routesSource !== readFile(prerenderPath);
  const searchStats = buildSearchIndex(routes);

  if (checkMode) {
    const staleArtifacts = [
      ...(routesChanged ? [prerenderPath] : []),
      ...(searchStats.changed ? [searchPath] : []),
    ];

    if (staleArtifacts.length > 0) {
      console.error('Docs route artifacts are stale. Run "pnpm nx run docs:sync-docs-routes".');
      for (const artifact of staleArtifacts) {
        console.error(`  ${artifact}`);
      }
      process.exitCode = 1;
      return;
    }

    console.log(`Docs route artifacts are current (${routes.length} routes).`);
    return;
  }

  fs.writeFileSync(prerenderPath, routesSource, 'utf8');
  fs.writeFileSync(searchPath, searchStats.source, 'utf8');

  console.log(`Wrote ${routes.length} routes to ${prerenderPath}`);
  console.log(
    `Updated ${searchPath}: ${searchStats.total} entries (${searchStats.added} added, ${searchStats.removed} removed).`,
  );

  if (searchStats.removed > 0) {
    console.log('Removed stale search URLs:');
    for (const url of searchStats.staleUrls.slice(0, 20)) {
      console.log(`  ${url}`);
    }
    if (searchStats.staleUrls.length > 20) {
      console.log(`  ... and ${searchStats.staleUrls.length - 20} more`);
    }
  }
}

main();
