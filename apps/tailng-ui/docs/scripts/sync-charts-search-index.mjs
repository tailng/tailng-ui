import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(scriptDir, '..');
const indexPath = path.join(docsRoot, 'public/search/index.json');
const seriesDataPath = path.join(docsRoot, 'src/app/pages/charts/series/chart-series-docs.data.ts');

const CHART_DOC_SECTIONS = [
  { slug: 'overview', label: 'Overview' },
  { slug: 'api', label: 'API' },
  { slug: 'styling', label: 'Styling' },
  { slug: 'examples', label: 'Examples' },
];

const GETTING_STARTED_ENTRIES = [
  {
    id: 'overview',
    slug: 'overview',
    title: 'Overview',
    description:
      'TailNG-owned chart wrappers, theme-aware rendering, and an isolated Apache ECharts runtime.',
  },
  {
    id: 'installation',
    slug: 'installation',
    title: 'Installation',
    description: 'Install @tailng-ui/charts with the ECharts peer dependency.',
  },
];

const COMPOSITION_ENTRIES = [
  {
    id: 'semi-headless',
    slug: 'semi-headless',
    title: 'Semi-headless',
    description:
      'Compose chart root, surface, and legend while reusing TailNG chart state and renderer isolation.',
  },
];

function buildChartTags(...parts) {
  return [...new Set(parts.map((part) => part.trim().toLowerCase()).filter(Boolean))];
}

function readField(block, field) {
  const inline = block.match(new RegExp(`${field}: '([^']*)'`));
  if (inline) {
    return inline[1];
  }

  const multiline = block.match(new RegExp(`${field}:\\s*\\n\\s*'([^']*)'`));
  return multiline?.[1] ?? '';
}

function parseChartSeriesDocConfigs(source) {
  const marker = 'export const CHART_SERIES_DOC_CONFIGS';
  const start = source.indexOf(marker);
  if (start === -1) {
    throw new Error(`Missing ${marker} in chart-series-docs.data.ts`);
  }

  const slice = source.slice(start);
  const blocks = slice.match(/\{\s*\n\s*categoryId:[\s\S]*?\n  \},/g) ?? [];

  return blocks.map((block) => ({
    categoryId: readField(block, 'categoryId'),
    categoryTitle: readField(block, 'categoryTitle'),
    slug: readField(block, 'slug'),
    title: readField(block, 'title'),
    description: readField(block, 'description'),
    seriesType: readField(block, 'seriesType'),
    legacyKind: readField(block, 'legacyKind'),
  }));
}

function buildGettingStartedSearchEntries() {
  return GETTING_STARTED_ENTRIES.map((item) => ({
    title: `Charts ${item.title}`,
    description: item.description,
    section: 'Charts / Getting Started',
    url: `/charts/getting-started/${item.slug}`,
    tags: buildChartTags('charts', 'getting-started', item.slug, item.id),
  }));
}

function buildCompositionSearchEntries() {
  return COMPOSITION_ENTRIES.map((item) => ({
    title: `${item.title} Charts`,
    description: item.description,
    section: 'Charts / Composition',
    url: `/charts/composition/${item.slug}`,
    tags: buildChartTags('charts', 'composition', item.slug, item.id, 'headless'),
  }));
}

function buildSeriesCatalogSearchEntries(configs) {
  const entries = [];

  for (const config of configs) {
    const sectionLabel = `Charts / ${config.categoryTitle}`;

    for (const section of CHART_DOC_SECTIONS) {
      entries.push({
        title: `${config.title} ${section.label}`,
        description: config.description,
        section: sectionLabel,
        url: `/charts/${config.categoryId}/${config.slug}/${section.slug}`,
        tags: buildChartTags(
          'charts',
          config.categoryId,
          config.slug,
          config.seriesType,
          section.slug,
          config.legacyKind,
        ),
      });
    }
  }

  return entries;
}

function buildChartsSearchIndexEntries() {
  const seriesSource = readFileSync(seriesDataPath, 'utf8');
  const configs = parseChartSeriesDocConfigs(seriesSource);

  return [
    ...buildGettingStartedSearchEntries(),
    ...buildSeriesCatalogSearchEntries(configs),
    ...buildCompositionSearchEntries(),
  ];
}

function isChartSearchEntry(entry) {
  return entry.url.startsWith('/charts/');
}

function main() {
  const chartEntries = buildChartsSearchIndexEntries();
  const raw = readFileSync(indexPath, 'utf8');
  const existing = JSON.parse(raw);
  const nonChartEntries = existing.filter((entry) => !isChartSearchEntry(entry));
  const merged = [...nonChartEntries, ...chartEntries].sort((left, right) =>
    left.url.localeCompare(right.url),
  );

  writeFileSync(indexPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');

  console.log(
    `Updated ${indexPath}: removed ${existing.length - nonChartEntries.length} chart entries, wrote ${chartEntries.length} chart entries (${merged.length} total).`,
  );
}

main();
