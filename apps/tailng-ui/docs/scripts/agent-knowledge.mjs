import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(scriptDir, '..');
const workspaceRoot = path.resolve(docsRoot, '../../..');
const sourceRoot = path.join(docsRoot, 'agent-knowledge');
const publicRoot = path.join(docsRoot, 'public');
const outputRoot = path.join(publicRoot, 'ai');

const command = process.argv[2] ?? 'check';
const allowedCommands = new Set(['build', 'check']);
const requiredFields = ['id', 'title', 'description', 'category', 'status', 'tags'];
const allowedCategories = new Set([
  'overview',
  'installation',
  'configuration',
  'components',
  'theme',
  'icons',
  'troubleshooting',
]);
const packageManifestPaths = [
  'libs/tailng-ui/components/package.json',
  'libs/tailng-ui/primitives/package.json',
  'libs/tailng-ui/cdk/package.json',
  'libs/tailng-ui/theme/package.json',
  'libs/tailng-ui/icons/package.json',
  'libs/tailng-ui/registry/package.json',
  'libs/tailng/cli/package.json',
];

if (!allowedCommands.has(command)) {
  console.error(`Unknown command "${command}". Use "build" or "check".`);
  process.exit(1);
}

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listFiles(root, predicate) {
  const files = [];

  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(entryPath, predicate));
    } else if (predicate(entryPath)) {
      files.push(entryPath);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

function parseScalar(value, filePath, lineNumber) {
  const trimmed = value.trim();
  if (trimmed.startsWith('[')) {
    if (!trimmed.endsWith(']')) {
      throw new Error(`${filePath}:${lineNumber}: unterminated inline array.`);
    }

    const entries = trimmed.slice(1, -1).trim();
    if (entries === '') return [];
    return entries.split(',').map((entry) => parseScalar(entry, filePath, lineNumber));
  }

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;
  return trimmed;
}

function parseFrontMatter(content, filePath) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (match === null) {
    throw new Error(`${filePath}: missing YAML front matter.`);
  }

  const metadata = {};
  const lines = match[1].split(/\r?\n/);
  let activeArrayKey = null;
  for (const [index, line] of lines.entries()) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue;
    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem !== null) {
      if (activeArrayKey === null) {
        throw new Error(`${filePath}:${index + 2}: list item has no parent key.`);
      }
      metadata[activeArrayKey].push(parseScalar(listItem[1], filePath, index + 2));
      continue;
    }

    activeArrayKey = null;
    const separatorIndex = line.indexOf(':');
    if (separatorIndex <= 0) {
      throw new Error(`${filePath}:${index + 2}: expected "key: value".`);
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1);
    if (key in metadata) {
      throw new Error(`${filePath}:${index + 2}: duplicate front-matter key "${key}".`);
    }
    if (value.trim() === '') {
      metadata[key] = [];
      activeArrayKey = key;
    } else {
      metadata[key] = parseScalar(value, filePath, index + 2);
    }
  }

  return { body: content.slice(match[0].length).trim(), metadata };
}

function collectPackageVersions() {
  const packages = {};
  for (const relativePath of packageManifestPaths) {
    const manifestPath = path.join(workspaceRoot, relativePath);
    const manifest = readJson(manifestPath);
    packages[manifest.name] = {
      version: manifest.version,
      peerDependencies: manifest.peerDependencies ?? {},
    };
  }

  for (const packageInfo of Object.values(packages)) {
    packageInfo.peerDependencies = Object.fromEntries(
      Object.entries(packageInfo.peerDependencies).map(([name, range]) => {
        if (typeof range === 'string' && range.startsWith('workspace:') && packages[name]) {
          const operator = range.slice('workspace:'.length);
          const normalizedOperator = operator === '*' ? '' : operator;
          return [name, `${normalizedOperator}${packages[name].version}`];
        }
        return [name, range];
      }),
    );
  }

  return packages;
}

function collectDocuments(packageVersions) {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Agent knowledge source directory not found: ${sourceRoot}`);
  }

  const documents = [];
  const ids = new Set();
  const files = listFiles(sourceRoot, (filePath) => filePath.endsWith('.md'));

  for (const filePath of files) {
    const relativePath = toPosixPath(path.relative(sourceRoot, filePath));
    const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
    const { body, metadata } = parseFrontMatter(content, relativePath);

    for (const field of requiredFields) {
      if (metadata[field] === undefined || metadata[field] === '') {
        throw new Error(`${relativePath}: missing required front-matter field "${field}".`);
      }
    }

    const expectedId = relativePath.slice(0, -'.md'.length);
    if (metadata.id !== expectedId) {
      throw new Error(`${relativePath}: id must be "${expectedId}", received "${metadata.id}".`);
    }
    if (ids.has(metadata.id)) {
      throw new Error(`${relativePath}: duplicate document id "${metadata.id}".`);
    }
    ids.add(metadata.id);

    if (!allowedCategories.has(metadata.category)) {
      throw new Error(`${relativePath}: unsupported category "${metadata.category}".`);
    }
    if (!['draft', 'stable'].includes(metadata.status)) {
      throw new Error(`${relativePath}: status must be "draft" or "stable".`);
    }
    if (!Array.isArray(metadata.tags) || metadata.tags.length === 0) {
      throw new Error(`${relativePath}: tags must be a non-empty JSON-style array.`);
    }
    if (metadata.package !== undefined && packageVersions[metadata.package] === undefined) {
      throw new Error(`${relativePath}: unknown workspace package "${metadata.package}".`);
    }

    const sourcePaths = metadata.sourcePaths ?? [];
    if (!Array.isArray(sourcePaths)) {
      throw new Error(`${relativePath}: sourcePaths must be a JSON-style array.`);
    }
    for (const sourcePath of sourcePaths) {
      if (!fs.existsSync(path.join(workspaceRoot, sourcePath))) {
        throw new Error(`${relativePath}: source path does not exist: ${sourcePath}`);
      }
    }

    if (
      metadata.humanDocsUrl !== undefined &&
      !String(metadata.humanDocsUrl).startsWith('https://tailng.dev/')
    ) {
      throw new Error(`${relativePath}: humanDocsUrl must use https://tailng.dev/.`);
    }

    documents.push({
      body,
      content: content.endsWith('\n') ? content : `${content}\n`,
      metadata,
      relativePath,
      url: `https://tailng.dev/ai/${relativePath}`,
    });
  }

  const availableUrls = new Set([
    ...documents.map((document) => document.url),
    'https://tailng.dev/ai/index.json',
    'https://tailng.dev/ai/versions.json',
  ]);
  for (const document of documents) {
    const links = [
      ...document.content.matchAll(/\[[^\]]+\]\((https:\/\/tailng\.dev\/ai\/[^)]+)\)/g),
    ];
    for (const link of links) {
      if (!availableUrls.has(link[1])) {
        throw new Error(`${document.relativePath}: unresolved agent-doc link ${link[1]}`);
      }
    }
  }

  return documents;
}

function renderBundle(title, documents) {
  const sections = documents.map(
    (document) => `\n---\n\nSource: ${document.url}\n\n${document.content.trim()}\n`,
  );
  return `# ${title}\n${sections.join('')}\n`;
}

function buildArtifacts(documents, packageVersions) {
  const artifacts = new Map();
  for (const document of documents) {
    artifacts.set(path.join(outputRoot, document.relativePath), document.content);
  }

  const workspacePackage = readJson(path.join(workspaceRoot, 'package.json'));
  const packageVersionMap = Object.fromEntries(
    Object.entries(packageVersions).map(([name, value]) => [name, value.version]),
  );
  const index = {
    schemaVersion: 1,
    repositoryVersion: workspacePackage.version,
    baseUrl: 'https://tailng.dev/ai/',
    packageVersions: packageVersionMap,
    documents: documents.map((document) => ({
      id: document.metadata.id,
      title: document.metadata.title,
      description: document.metadata.description,
      category: document.metadata.category,
      status: document.metadata.status,
      tags: document.metadata.tags,
      package: document.metadata.package ?? null,
      packageVersion:
        document.metadata.package === undefined
          ? null
          : packageVersions[document.metadata.package].version,
      url: document.url,
      humanDocsUrl: document.metadata.humanDocsUrl ?? null,
    })),
  };
  artifacts.set(path.join(outputRoot, 'index.json'), `${JSON.stringify(index, null, 2)}\n`);

  const versions = {
    schemaVersion: 1,
    repositoryVersion: workspacePackage.version,
    packages: packageVersions,
  };
  artifacts.set(path.join(outputRoot, 'versions.json'), `${JSON.stringify(versions, null, 2)}\n`);

  const startPageOrder = [
    'index.md',
    'installation/index.md',
    'configuration/index.md',
    'components/index.md',
    'theme/index.md',
    'icons/index.md',
    'troubleshooting/index.md',
  ];
  const categoryIndexes = startPageOrder
    .map((relativePath) => documents.find((document) => document.relativePath === relativePath))
    .filter((document) => document !== undefined);
  const llmsLines = [
    '# TailNG',
    '',
    '> Agent-oriented documentation for installing, configuring, and using TailNG in Angular applications.',
    '',
    'Use the package versions and compatibility data from https://tailng.dev/ai/versions.json before changing an application.',
    '',
    '## Start here',
    '',
    ...categoryIndexes.map(
      (document) =>
        `- [${document.metadata.title}](${document.url}): ${document.metadata.description}`,
    ),
    '',
    '## Machine-readable discovery',
    '',
    '- [Document index](https://tailng.dev/ai/index.json)',
    '- [Package versions](https://tailng.dev/ai/versions.json)',
    '- [Full knowledge bundle](https://tailng.dev/llms-full.txt)',
    '',
  ];
  artifacts.set(path.join(publicRoot, 'llms.txt'), `${llmsLines.join('\n')}\n`);
  artifacts.set(
    path.join(publicRoot, 'llms-full.txt'),
    renderBundle('TailNG agent knowledge', documents),
  );

  for (const category of allowedCategories) {
    if (category === 'overview') continue;
    const categoryDocuments = documents.filter(
      (document) => document.metadata.category === category,
    );
    if (categoryDocuments.length === 0) continue;
    artifacts.set(
      path.join(outputRoot, 'bundles', `${category}.txt`),
      renderBundle(`TailNG ${category}`, categoryDocuments),
    );
  }

  return artifacts;
}

function writeArtifacts(artifacts) {
  fs.rmSync(outputRoot, { recursive: true, force: true });
  for (const [filePath, content] of artifacts) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
  }
}

function checkArtifacts(artifacts) {
  const errors = [];
  for (const [filePath, expected] of artifacts) {
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing generated file: ${path.relative(workspaceRoot, filePath)}`);
      continue;
    }
    const actual = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
    if (actual !== expected) {
      errors.push(`Stale generated file: ${path.relative(workspaceRoot, filePath)}`);
    }
  }

  const expectedOutputFiles = new Set(
    [...artifacts.keys()]
      .filter((filePath) => filePath.startsWith(`${outputRoot}${path.sep}`))
      .map((filePath) => path.resolve(filePath)),
  );
  if (fs.existsSync(outputRoot)) {
    for (const filePath of listFiles(outputRoot, () => true)) {
      if (!expectedOutputFiles.has(path.resolve(filePath))) {
        errors.push(`Unexpected generated file: ${path.relative(workspaceRoot, filePath)}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`${errors.join('\n')}\nRun: pnpm docs:agent:build`);
  }
}

try {
  const packageVersions = collectPackageVersions();
  const documents = collectDocuments(packageVersions);
  const artifacts = buildArtifacts(documents, packageVersions);

  if (command === 'build') {
    writeArtifacts(artifacts);
    console.log(
      `agent knowledge: generated ${documents.length} documents and ${artifacts.size} artifacts`,
    );
  } else {
    checkArtifacts(artifacts);
    console.log(`agent knowledge: ${documents.length} documents are valid and current`);
  }
} catch (error) {
  console.error(`agent knowledge: ${error.message}`);
  process.exit(1);
}
