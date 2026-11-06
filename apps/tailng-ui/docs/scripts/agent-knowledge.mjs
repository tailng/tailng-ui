/* global console, process */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

import { buildComponentSectionBodies } from './agent-knowledge/component-sections.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(scriptDir, '..');
const workspaceRoot = path.resolve(docsRoot, '../../..');
const sourceRoot = path.join(docsRoot, 'agent-knowledge');
const publicRoot = path.join(docsRoot, 'public');
const outputRoot = path.join(publicRoot, 'ai');
const componentCatalogPath = path.join(docsRoot, 'src/app/pages/components/component-docs.data.ts');

const command = process.argv[2] ?? 'check';
const allowedCommands = new Set(['build', 'check', 'test']);
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
  'libs/tailng-ui/flow/package.json',
  'libs/tailng-ui/registry/package.json',
  'libs/tailng/cli/package.json',
];

const componentCatalogGroups = new Set([
  'form',
  'layout',
  'flow',
  'overlay',
  'feedback',
  'utility',
  'navigation',
]);

const additionalPublicComponentProducts = [
  {
    id: 'bottom-sheet',
    slug: 'bottom-sheet',
    title: 'Bottom Sheet',
    description: 'Display focused content in a modal panel attached to the bottom of the viewport.',
    groupId: 'layout',
  },
  {
    id: 'grid',
    slug: 'grid',
    title: 'Grid',
    description: 'Arrange content in a responsive styled grid surface.',
    groupId: 'layout',
  },
  {
    id: 'dropdown-menu',
    slug: 'dropdown-menu',
    title: 'Dropdown Menu',
    description: 'Open a contextual menu from an explicit trigger control.',
    groupId: 'navigation',
  },
  {
    id: 'navigation-menu',
    slug: 'navigation-menu',
    title: 'Navigation Menu',
    description: 'Compose application navigation with nested and keyboard-accessible menu content.',
    groupId: 'navigation',
  },
  {
    id: 'toolbar',
    slug: 'toolbar',
    title: 'Toolbar',
    description: 'Group related actions with toolbar semantics and keyboard navigation.',
    groupId: 'navigation',
  },
];

const componentProductOverrides = {
  'form/fileupload': {
    package: '@tailng-ui/primitives',
    sourceDirs: ['libs/tailng-ui/primitives/src/lib/form/file-upload'],
  },
  'utility/codeblock': {
    sourceDirs: ['libs/tailng-ui/components/src/lib/utility/code-block'],
  },
  'utility/copybutton': {
    sourceDirs: ['libs/tailng-ui/components/src/lib/utility/copy-button'],
  },
  'navigation/pagination': {
    sourceDirs: ['libs/tailng-ui/components/src/lib/navigation/paginator'],
  },
  'navigation/tree': {
    sourceDirs: ['libs/tailng-ui/components/src/lib/utility/tree'],
  },
  'flow/flow-editor': {
    package: '@tailng-ui/flow',
    sourceDirs: [
      'libs/tailng-ui/flow/src/lib/connection-template',
      'libs/tailng-ui/flow/src/lib/editor',
      'libs/tailng-ui/flow/src/lib/node',
      'libs/tailng-ui/flow/src/lib/node-template',
      'libs/tailng-ui/flow/src/lib/node-palette',
      'libs/tailng-ui/flow/src/lib/palette-item',
      'libs/tailng-ui/flow/src/lib/port',
      'libs/tailng-ui/flow/src/lib/validation-badge',
    ],
  },
  'flow/flow-workbench': {
    package: '@tailng-ui/flow',
    importPath: '@tailng-ui/flow/execution',
    sourceDirs: [
      'libs/tailng-ui/flow/src/execution/components/workbench',
      'libs/tailng-ui/flow/src/execution/components/inspector',
      'libs/tailng-ui/flow/src/execution/components/payload',
      'libs/tailng-ui/flow/src/execution/templates',
    ],
  },
  'flow/flow-execution-graph': {
    package: '@tailng-ui/flow',
    importPath: '@tailng-ui/flow/execution',
    sourceDirs: ['libs/tailng-ui/flow/src/execution/components/graph'],
  },
  'flow/flow-node-properties': {
    package: '@tailng-ui/flow',
    importPath: '@tailng-ui/flow/execution',
    sourceDirs: ['libs/tailng-ui/flow/src/execution/components/node-properties'],
  },
};

if (!allowedCommands.has(command)) {
  console.error(`Unknown command "${command}". Use "build", "check", or "test".`);
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

function toWorkspaceRelative(filePath) {
  return toPosixPath(path.relative(workspaceRoot, filePath));
}

function getObjectProperty(objectLiteral, propertyName) {
  return objectLiteral.properties.find((property) => {
    if (!ts.isPropertyAssignment(property) && !ts.isShorthandPropertyAssignment(property)) {
      return false;
    }
    return property.name?.getText().replaceAll("'", '').replaceAll('"', '') === propertyName;
  });
}

function getLiteralText(node, filePath) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  throw new Error(`${toWorkspaceRelative(filePath)}: expected a static string literal.`);
}

function getStaticObjectString(objectLiteral, propertyName, filePath) {
  const property = getObjectProperty(objectLiteral, propertyName);
  if (property === undefined || !ts.isPropertyAssignment(property)) {
    throw new Error(`${toWorkspaceRelative(filePath)}: missing static property "${propertyName}".`);
  }
  return getLiteralText(property.initializer, filePath);
}

function collectComponentCatalog() {
  const content = fs.readFileSync(componentCatalogPath, 'utf8');
  const sourceFile = ts.createSourceFile(
    componentCatalogPath,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const products = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        !ts.isIdentifier(declaration.name) ||
        !ts.isObjectLiteralExpression(declaration.initializer)
      ) {
        continue;
      }
      if (!declaration.name.text.match(/^COMPONENTS_[A-Z_]+_GROUP$/)) continue;

      const groupId = getStaticObjectString(declaration.initializer, 'id', componentCatalogPath);
      if (!componentCatalogGroups.has(groupId)) continue;
      const itemsProperty = getObjectProperty(declaration.initializer, 'items');
      if (
        itemsProperty === undefined ||
        !ts.isPropertyAssignment(itemsProperty) ||
        !ts.isArrayLiteralExpression(itemsProperty.initializer)
      ) {
        throw new Error(
          `${toWorkspaceRelative(componentCatalogPath)}: group ${groupId} has no static items array.`,
        );
      }

      for (const element of itemsProperty.initializer.elements) {
        if (!ts.isObjectLiteralExpression(element)) {
          throw new Error(
            `${toWorkspaceRelative(componentCatalogPath)}: ${groupId} contains a non-object item.`,
          );
        }
        products.push({
          id: getStaticObjectString(element, 'id', componentCatalogPath),
          slug: getStaticObjectString(element, 'slug', componentCatalogPath),
          title: getStaticObjectString(element, 'title', componentCatalogPath),
          description: getStaticObjectString(element, 'description', componentCatalogPath),
          groupId,
          officialCatalog: true,
        });
      }
    }
  }

  if (products.length === 0) {
    throw new Error(`${toWorkspaceRelative(componentCatalogPath)}: no component products found.`);
  }

  return [
    ...products,
    ...additionalPublicComponentProducts.map((product) => ({
      ...product,
      officialCatalog: false,
    })),
  ];
}

function getDecoratorCall(node, decoratorName) {
  if (!ts.canHaveDecorators(node)) return undefined;
  return ts.getDecorators(node)?.find((decorator) => {
    const expression = decorator.expression;
    return (
      ts.isCallExpression(expression) &&
      ts.isIdentifier(expression.expression) &&
      expression.expression.text === decoratorName
    );
  })?.expression;
}

function getSignalInitializerKind(initializer) {
  if (!ts.isCallExpression(initializer)) return null;
  if (ts.isIdentifier(initializer.expression)) {
    return ['input', 'output', 'model'].includes(initializer.expression.text)
      ? { kind: initializer.expression.text, required: false }
      : null;
  }
  if (
    ts.isPropertyAccessExpression(initializer.expression) &&
    ts.isIdentifier(initializer.expression.expression) &&
    initializer.expression.expression.text === 'input' &&
    initializer.expression.name.text === 'required'
  ) {
    return { kind: 'input', required: true };
  }
  return null;
}

function getStaticStringArray(objectLiteral, propertyName) {
  const property = getObjectProperty(objectLiteral, propertyName);
  if (
    property === undefined ||
    !ts.isPropertyAssignment(property) ||
    !ts.isArrayLiteralExpression(property.initializer)
  ) {
    return [];
  }
  return property.initializer.elements
    .filter((element) => ts.isStringLiteral(element) || ts.isNoSubstitutionTemplateLiteral(element))
    .map((element) => element.text);
}

function collectComponentApis(filePaths) {
  const apis = [];
  for (const filePath of filePaths) {
    const content = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    for (const statement of sourceFile.statements) {
      if (!ts.isClassDeclaration(statement) || statement.name === undefined) continue;
      if (
        !statement.name.text.startsWith('Tng') ||
        (!statement.name.text.endsWith('Component') && !statement.name.text.endsWith('Directive'))
      ) {
        continue;
      }
      const angularDecorator =
        getDecoratorCall(statement, 'Component') ?? getDecoratorCall(statement, 'Directive');
      if (angularDecorator === undefined) continue;
      const decoratorOptions = angularDecorator.arguments[0];
      if (decoratorOptions === undefined || !ts.isObjectLiteralExpression(decoratorOptions))
        continue;

      const selectorProperty = getObjectProperty(decoratorOptions, 'selector');
      const selector =
        selectorProperty !== undefined &&
        ts.isPropertyAssignment(selectorProperty) &&
        (ts.isStringLiteral(selectorProperty.initializer) ||
          ts.isNoSubstitutionTemplateLiteral(selectorProperty.initializer))
          ? selectorProperty.initializer.text
          : null;
      const api = {
        symbol: statement.name.text,
        selector,
        inputs: [],
        requiredInputs: [],
        outputs: [],
        models: [],
        forwardedInputs: [],
        forwardedOutputs: [],
        sourcePath: toWorkspaceRelative(filePath),
      };

      for (const member of statement.members) {
        const memberName =
          member.name !== undefined &&
          (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name))
            ? member.name.text
            : null;
        if (memberName === null) continue;
        if (ts.isPropertyDeclaration(member) && member.initializer !== undefined) {
          const signalKind = getSignalInitializerKind(member.initializer);
          if (signalKind?.kind === 'input') {
            api.inputs.push(memberName);
            if (signalKind.required) api.requiredInputs.push(memberName);
          } else if (signalKind?.kind === 'output') {
            api.outputs.push(memberName);
          } else if (signalKind?.kind === 'model') {
            api.models.push(memberName);
          }
        }
        if (getDecoratorCall(member, 'Input') !== undefined) api.inputs.push(memberName);
        if (getDecoratorCall(member, 'Output') !== undefined) api.outputs.push(memberName);
      }

      const hostDirectivesProperty = getObjectProperty(decoratorOptions, 'hostDirectives');
      if (
        hostDirectivesProperty !== undefined &&
        ts.isPropertyAssignment(hostDirectivesProperty) &&
        ts.isArrayLiteralExpression(hostDirectivesProperty.initializer)
      ) {
        for (const hostDirective of hostDirectivesProperty.initializer.elements) {
          if (!ts.isObjectLiteralExpression(hostDirective)) continue;
          api.forwardedInputs.push(...getStaticStringArray(hostDirective, 'inputs'));
          api.forwardedOutputs.push(...getStaticStringArray(hostDirective, 'outputs'));
        }
      }

      for (const key of [
        'inputs',
        'requiredInputs',
        'outputs',
        'models',
        'forwardedInputs',
        'forwardedOutputs',
      ]) {
        api[key] = [...new Set(api[key])].sort((left, right) => left.localeCompare(right));
      }
      apis.push(api);
    }
  }
  return apis.sort((left, right) => left.symbol.localeCompare(right.symbol));
}

function resolveComponentProduct(product) {
  const key = `${product.groupId}/${product.id}`;
  const override = componentProductOverrides[key] ?? {};
  const packageName = override.package ?? '@tailng-ui/components';
  const importPath = override.importPath ?? packageName;
  const sourceDirs = override.sourceDirs ?? [
    `libs/tailng-ui/components/src/lib/${product.groupId}/${product.slug}`,
  ];
  const sourceFiles = sourceDirs.flatMap((relativeDir) => {
    const absoluteDir = path.join(workspaceRoot, relativeDir);
    if (!fs.existsSync(absoluteDir)) {
      throw new Error(`Component product ${key} has no source directory: ${relativeDir}`);
    }
    return listFiles(absoluteDir, (filePath) => {
      return (
        filePath.endsWith('.ts') &&
        !filePath.includes(`${path.sep}__tests__${path.sep}`) &&
        !filePath.endsWith('.spec.ts') &&
        !filePath.endsWith('.test.ts')
      );
    });
  });
  if (sourceFiles.length === 0) {
    throw new Error(`Component product ${key} has no component source files.`);
  }
  const docsRoute = path.join(
    docsRoot,
    'src/app/pages/components',
    product.groupId,
    product.slug,
    'routes.ts',
  );
  const humanDocsUrl = product.officialCatalog
    ? `https://tailng.dev/components/${product.groupId}/${product.slug}/overview`
    : undefined;
  const apis = collectComponentApis(sourceFiles);
  if (apis.length === 0) {
    throw new Error(`Component product ${key} has no Angular component classes.`);
  }
  return {
    ...product,
    packageName,
    importPath,
    humanDocsUrl,
    sourcePaths: [
      ...sourceFiles.map(toWorkspaceRelative),
      ...(fs.existsSync(docsRoute) ? [toWorkspaceRelative(docsRoute)] : []),
    ],
    apis,
  };
}

function toPascalCase(value) {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join('');
}

function selectPrimaryApi(product) {
  const aliases = {
    codeblock: 'TngCodeBlockComponent',
    copybutton: 'TngCopyButtonComponent',
    pagination: 'TngPaginatorComponent',
  };
  const expected = aliases[product.id] ?? `Tng${toPascalCase(product.id)}Component`;
  return product.apis.find((api) => api.symbol === expected) ?? product.apis[0];
}

function renderGeneratedComponentBody(product) {
  const primaryApi = selectPrimaryApi(product);
  const requiredBindings = primaryApi.requiredInputs
    .map((inputName) => ` [${inputName}]="$any(null)"`)
    .join('');
  const selectorExample = primaryApi.selector?.startsWith('tng-')
    ? `<${primaryApi.selector}${requiredBindings} />`
    : primaryApi.selector?.match(/^\[([a-zA-Z][a-zA-Z0-9]*)\]$/)
      ? `<div ${primaryApi.selector.slice(1, -1)}${requiredBindings}></div>`
      : '<!-- See the linked human guide for template composition. -->';
  const className = `${toPascalCase(product.id)}AgentExample`;
  const packageStyleNote =
    product.packageName === '@tailng-ui/flow'
      ? '\nLoad `@tailng-ui/flow/styles.css` once in the application styles in addition to the TailNG theme contract.\n'
      : '';
  const familyMembers = product.apis
    .map((api) => `- \`${api.symbol}\`${api.selector ? ` — selector \`${api.selector}\`` : ''}`)
    .join('\n');
  const humanDocs = product.humanDocsUrl
    ? `Use the [human documentation](${product.humanDocsUrl}) for visual examples and extended API guidance.`
    : 'This public export does not yet have a dedicated human catalog page; use this reference together with the package source API.';

  return `# ${product.title} component

${product.description}

## Package and import

Import the standalone Angular API from \`${product.importPath}\`:

\`\`\`ts
import { Component } from '@angular/core';
import { ${primaryApi.symbol} } from '${product.importPath}';

@Component({
  standalone: true,
  imports: [${primaryApi.symbol}],
  template: \`${selectorExample}\`,
})
export class ${className} {}
\`\`\`
${packageStyleNote}
## Component family

${familyMembers}

Use the dedicated API reference for inputs, outputs, models, compound parts, and forwarded host-directive APIs.

## Accessibility and styling

Preserve the component's documented keyboard behavior and accessible naming. Load the TailNG theme contract stylesheet before rendering styled components, and prefer semantic TailNG tokens over hard-coded colors.

${humanDocs}
`;
}

function serializeFrontMatter(metadata) {
  const entries = Object.entries(metadata).map(([key, value]) => {
    if (Array.isArray(value)) return `${key}: ${JSON.stringify(value)}`;
    if (typeof value === 'string') return `${key}: ${JSON.stringify(value)}`;
    return `${key}: ${String(value)}`;
  });
  return `---\n${entries.join('\n')}\n---\n`;
}

function createGeneratedComponentDocument(product) {
  const relativePath = `components/${product.id}/overview.md`;
  const metadata = {
    id: relativePath.slice(0, -'.md'.length),
    title: `${product.title} component`,
    description: product.description,
    category: 'components',
    status: 'stable',
    tags: [product.id, product.groupId, 'component'],
    package: product.packageName,
    importPath: product.importPath,
    sourcePaths: product.sourcePaths,
    ...(product.humanDocsUrl ? { humanDocsUrl: product.humanDocsUrl } : {}),
    componentGroup: product.groupId,
    symbols: product.apis.map((api) => api.symbol),
    selectors: product.apis.map((api) => api.selector).filter(Boolean),
    productId: product.id,
    section: 'overview',
    officialCatalog: product.officialCatalog,
    generated: true,
  };
  const body = renderGeneratedComponentBody(product).trim();
  const content = `${serializeFrontMatter(metadata)}\n${body}\n`;
  return {
    body,
    content,
    metadata,
    relativePath,
    url: `https://tailng.dev/ai/${relativePath}`,
  };
}

function createGeneratedComponentSectionDocument(product, section, body, sectionSourcePaths) {
  const relativePath = `components/${product.id}/${section}.md`;
  const sectionTitles = {
    api: 'API',
    examples: 'examples',
    styling: 'styling',
  };
  const metadata = {
    id: relativePath.slice(0, -'.md'.length),
    title: `${product.title} ${sectionTitles[section]}`,
    description: `${product.title} ${sectionTitles[section]} reference for Angular applications.`,
    category: 'components',
    status: 'stable',
    tags: [product.id, product.groupId, section],
    package: product.packageName,
    importPath: product.importPath,
    sourcePaths: [...new Set([...product.sourcePaths, ...sectionSourcePaths])],
    ...(product.humanDocsUrl
      ? {
          humanDocsUrl: product.humanDocsUrl.replace(/\/overview$/, `/${section}`),
        }
      : {}),
    componentGroup: product.groupId,
    symbols: product.apis.map((api) => api.symbol),
    selectors: product.apis.map((api) => api.selector).filter(Boolean),
    productId: product.id,
    section,
    officialCatalog: product.officialCatalog,
    generated: true,
  };
  const content = `${serializeFrontMatter(metadata)}\n${body.trim()}\n`;
  return {
    body: body.trim(),
    content,
    metadata,
    relativePath,
    url: `https://tailng.dev/ai/${relativePath}`,
  };
}

function appendComponentSectionLinks(documents) {
  const overviews = documents.filter(
    (document) =>
      document.metadata.category === 'components' && document.metadata.section === 'overview',
  );
  for (const overview of overviews) {
    const productId = overview.metadata.productId;
    const links = ['api', 'styling', 'examples']
      .map((section) => {
        const target = documents.find(
          (document) =>
            document.metadata.productId === productId && document.metadata.section === section,
        );
        return target ? `- [${section[0].toUpperCase()}${section.slice(1)}](${target.url})` : null;
      })
      .filter(Boolean);
    if (links.length === 0 || overview.body.includes('## Documentation sections')) continue;
    const sectionBlock = `## Documentation sections\n\n${links.join('\n')}`;
    overview.body = `${overview.body.trim()}\n\n${sectionBlock}`;
    overview.content = `${overview.content.trim()}\n\n${sectionBlock}\n`;
  }
}

function resolveLocalExport(fromFile, moduleSpecifier) {
  if (!moduleSpecifier.startsWith('.')) return null;
  const base = path.resolve(path.dirname(fromFile), moduleSpecifier);
  for (const candidate of [`${base}.ts`, path.join(base, 'index.ts')]) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function collectPublicComponentSymbols(entryPoints) {
  const visited = new Set();
  const publicAngularFiles = new Set();
  const visit = (filePath) => {
    const resolvedPath = path.resolve(filePath);
    if (visited.has(resolvedPath)) return;
    visited.add(resolvedPath);
    const sourceFile = ts.createSourceFile(
      resolvedPath,
      fs.readFileSync(resolvedPath, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    for (const statement of sourceFile.statements) {
      if (!ts.isExportDeclaration(statement) || statement.moduleSpecifier === undefined) continue;
      if (!ts.isStringLiteral(statement.moduleSpecifier)) continue;
      const exportedFile = resolveLocalExport(resolvedPath, statement.moduleSpecifier.text);
      if (exportedFile === null) continue;
      if (exportedFile.endsWith(`${path.sep}index.ts`)) visit(exportedFile);
      else publicAngularFiles.add(exportedFile);
    }
  };
  for (const entryPoint of entryPoints) visit(path.join(workspaceRoot, entryPoint));
  return new Set(collectComponentApis([...publicAngularFiles]).map((api) => api.symbol));
}

function expandComponentCatalogIndex(documents) {
  const indexDocument = documents.find(
    (document) => document.relativePath === 'components/index.md',
  );
  if (indexDocument === undefined) return;
  const marker = '<!-- COMPONENT_CATALOG -->';
  if (!indexDocument.content.includes(marker)) {
    throw new Error('components/index.md: missing generated component catalog marker.');
  }
  const componentDocuments = documents.filter(
    (document) =>
      document.metadata.category === 'components' && document.metadata.section === 'overview',
  );
  const groups = new Map();
  for (const document of componentDocuments) {
    const group = document.metadata.componentGroup ?? document.metadata.tags?.[1] ?? 'other';
    const entries = groups.get(group) ?? [];
    entries.push(document);
    groups.set(group, entries);
  }
  const catalog = [...groups.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(
      ([group, entries]) =>
        `### ${toPascalCase(group)}\n\n${entries
          .sort((left, right) => left.metadata.title.localeCompare(right.metadata.title))
          .map(
            (document) =>
              `- [${document.metadata.title}](${document.url}): ${document.metadata.description}`,
          )
          .join('\n')}`,
    )
    .join('\n\n');
  indexDocument.content = indexDocument.content.replace(marker, catalog);
  indexDocument.body = indexDocument.body.replace(marker, catalog);
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

  const componentProducts = collectComponentCatalog().map(resolveComponentProduct);
  const componentProductsById = new Map(
    componentProducts.map((product) => [`components/${product.id}/overview`, product]),
  );

  for (const document of documents) {
    const product = componentProductsById.get(document.metadata.id);
    if (product === undefined) continue;
    document.metadata.componentGroup = product.groupId;
    document.metadata.symbols = product.apis.map((api) => api.symbol);
    document.metadata.selectors = product.apis.map((api) => api.selector).filter(Boolean);
    document.metadata.productId = product.id;
    document.metadata.section = 'overview';
    document.metadata.officialCatalog = product.officialCatalog;
    document.metadata.generated = false;
  }

  for (const product of componentProducts) {
    const id = `components/${product.id}/overview`;
    if (ids.has(id)) continue;
    const generatedDocument = createGeneratedComponentDocument(product);
    ids.add(id);
    documents.push(generatedDocument);
  }

  for (const product of componentProducts) {
    const { sectionBodies, sectionSources } = buildComponentSectionBodies(
      product,
      docsRoot,
      workspaceRoot,
    );
    for (const section of ['api', 'styling', 'examples']) {
      const generatedDocument = createGeneratedComponentSectionDocument(
        product,
        section,
        sectionBodies[section],
        sectionSources[section],
      );
      if (ids.has(generatedDocument.metadata.id)) {
        throw new Error(`Duplicate generated component section: ${generatedDocument.metadata.id}`);
      }
      ids.add(generatedDocument.metadata.id);
      documents.push(generatedDocument);
    }
  }

  appendComponentSectionLinks(documents);
  documents.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
  expandComponentCatalogIndex(documents);

  const publicComponentSymbols = collectPublicComponentSymbols([
    'libs/tailng-ui/components/src/index.ts',
    'libs/tailng-ui/flow/src/index.ts',
    'libs/tailng-ui/flow/src/execution/index.ts',
  ]);
  const documentedComponentSymbols = new Set(
    documents.flatMap((document) => document.metadata.symbols ?? []),
  );
  const missingPublicSymbols = [...publicComponentSymbols]
    .filter((symbol) => !documentedComponentSymbols.has(symbol))
    .sort((left, right) => left.localeCompare(right));
  if (missingPublicSymbols.length > 0) {
    throw new Error(
      `Public component exports have no agent-document mapping: ${missingPublicSymbols.join(', ')}`,
    );
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
  const componentDocuments = documents.filter(
    (document) =>
      document.metadata.category === 'components' && document.metadata.section === 'overview',
  );
  const publicComponentSymbols = collectPublicComponentSymbols([
    'libs/tailng-ui/components/src/index.ts',
    'libs/tailng-ui/flow/src/index.ts',
    'libs/tailng-ui/flow/src/execution/index.ts',
  ]);
  const componentSectionDocuments = documents.filter(
    (document) => document.metadata.category === 'components' && document.metadata.productId,
  );
  const products = componentDocuments.map((overview) => {
    const sections = Object.fromEntries(
      ['overview', 'api', 'styling', 'examples'].map((section) => {
        const document = componentSectionDocuments.find(
          (candidate) =>
            candidate.metadata.productId === overview.metadata.productId &&
            candidate.metadata.section === section,
        );
        if (document === undefined) {
          throw new Error(
            `Missing ${section} document for component product ${overview.metadata.productId}.`,
          );
        }
        return [
          section,
          {
            url: document.url,
            humanDocsUrl: document.metadata.humanDocsUrl ?? null,
            title: document.metadata.title,
            generated: document.metadata.generated ?? false,
          },
        ];
      }),
    );
    return {
      id: overview.metadata.productId,
      title: overview.metadata.title.replace(/ component$/, ''),
      description: overview.metadata.description,
      category: overview.metadata.componentGroup,
      package: overview.metadata.package,
      importPath: overview.metadata.importPath ?? overview.metadata.package,
      status: overview.metadata.status,
      officialCatalog: overview.metadata.officialCatalog,
      symbols: overview.metadata.symbols ?? [],
      selectors: overview.metadata.selectors ?? [],
      sections,
    };
  });
  const index = {
    schemaVersion: 3,
    repositoryVersion: workspacePackage.version,
    baseUrl: 'https://tailng.dev/ai/',
    packageVersions: packageVersionMap,
    componentCoverage: {
      officialCatalogProducts: componentDocuments.filter(
        (document) => document.metadata.officialCatalog === true,
      ).length,
      additionalPublicProducts: componentDocuments.filter(
        (document) => document.metadata.officialCatalog === false,
      ).length,
      productDocuments: componentDocuments.length,
      sectionDocuments: componentSectionDocuments.length,
      completeProducts: products.length,
      publicComponentSymbols: publicComponentSymbols.size,
      mappedPublicComponentSymbols: publicComponentSymbols.size,
    },
    products,
    bundles: [
      {
        id: 'all',
        url: 'https://tailng.dev/llms-full.txt',
      },
      ...[...allowedCategories]
        .filter(
          (category) =>
            category !== 'overview' &&
            documents.some((document) => document.metadata.category === category),
        )
        .map((category) => ({
          id: category,
          url: `https://tailng.dev/ai/bundles/${category}.txt`,
        })),
      ...[...componentCatalogGroups]
        .sort((left, right) => left.localeCompare(right))
        .map((group) => ({
          id: `components-${group}`,
          url: `https://tailng.dev/ai/bundles/components-${group}.txt`,
        })),
      ...['api', 'styling', 'examples'].map((section) => ({
        id: `components-${section}`,
        url: `https://tailng.dev/ai/bundles/components-${section}.txt`,
      })),
    ],
    documents: documents.map((document) => ({
      id: document.metadata.id,
      title: document.metadata.title,
      description: document.metadata.description,
      category: document.metadata.category,
      status: document.metadata.status,
      tags: document.metadata.tags,
      package: document.metadata.package ?? null,
      importPath: document.metadata.importPath ?? document.metadata.package ?? null,
      packageVersion:
        document.metadata.package === undefined
          ? null
          : packageVersions[document.metadata.package].version,
      url: document.url,
      humanDocsUrl: document.metadata.humanDocsUrl ?? null,
      componentGroup: document.metadata.componentGroup ?? null,
      symbols: document.metadata.symbols ?? [],
      selectors: document.metadata.selectors ?? [],
      productId: document.metadata.productId ?? null,
      section: document.metadata.section ?? null,
      generated: document.metadata.generated ?? false,
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
    '## Component bundles',
    '',
    ...[...componentCatalogGroups]
      .sort((left, right) => left.localeCompare(right))
      .map(
        (group) =>
          `- [${toPascalCase(group)} components](https://tailng.dev/ai/bundles/components-${group}.txt)`,
      ),
    '- [Component API references](https://tailng.dev/ai/bundles/components-api.txt)',
    '- [Component styling references](https://tailng.dev/ai/bundles/components-styling.txt)',
    '- [Component examples](https://tailng.dev/ai/bundles/components-examples.txt)',
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

  for (const group of [...componentCatalogGroups].sort((left, right) =>
    left.localeCompare(right),
  )) {
    const groupDocuments = documents.filter(
      (document) =>
        document.metadata.category === 'components' && document.metadata.componentGroup === group,
    );
    if (groupDocuments.length === 0) continue;
    artifacts.set(
      path.join(outputRoot, 'bundles', `components-${group}.txt`),
      renderBundle(`TailNG ${group} components`, groupDocuments),
    );
  }

  for (const section of ['api', 'styling', 'examples']) {
    const sectionDocuments = documents.filter(
      (document) =>
        document.metadata.category === 'components' && document.metadata.section === section,
    );
    artifacts.set(
      path.join(outputRoot, 'bundles', `components-${section}.txt`),
      renderBundle(`TailNG component ${section}`, sectionDocuments),
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

function testComponentSnippets(documents) {
  const componentDocuments = documents.filter(
    (document) =>
      document.metadata.category === 'components' && document.metadata.section === 'overview',
  );
  const snippets = componentDocuments.map((document) => {
    const match = document.body.match(/```ts\r?\n([\s\S]*?)\r?\n```/);
    if (match === null) {
      throw new Error(`${document.relativePath}: missing primary TypeScript example.`);
    }
    return { document, source: match[1] };
  });
  const tempRoot = fs.mkdtempSync(path.join(docsRoot, '.agent-snippets-'));
  try {
    const snippetFiles = snippets.map(({ document, source }, index) => {
      const filePath = path.join(tempRoot, `component-${String(index + 1).padStart(3, '0')}.ts`);
      fs.writeFileSync(filePath, `${source.trim()}\n`);
      return filePath;
    });
    const tsConfigPath = path.join(tempRoot, 'tsconfig.json');
    fs.writeFileSync(
      tsConfigPath,
      `${JSON.stringify(
        {
          extends: path.join(docsRoot, 'tsconfig.app.json'),
          compilerOptions: {
            noEmit: true,
          },
          files: snippetFiles,
          include: [],
          exclude: [],
        },
        null,
        2,
      )}\n`,
    );
    execFileSync(path.join(workspaceRoot, 'node_modules/.bin/ngc'), ['-p', tsConfigPath], {
      cwd: workspaceRoot,
      encoding: 'utf8',
      stdio: 'pipe',
    });
  } catch (error) {
    const details = [error.stdout, error.stderr].filter(Boolean).join('\n').trim();
    throw new Error(`component snippet compilation failed${details ? `:\n${details}` : ''}`);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
  return snippets.length;
}

function testComponentExampleFiles(documents) {
  const exampleDocuments = documents.filter(
    (document) =>
      document.metadata.category === 'components' && document.metadata.section === 'examples',
  );
  const tempRoot = fs.mkdtempSync(path.join(docsRoot, '.agent-examples-'));
  const tsFiles = [];
  try {
    for (const document of exampleDocuments) {
      const productDir = path.join(tempRoot, document.metadata.productId);
      fs.mkdirSync(productDir, { recursive: true });
      const blocks = [
        ...document.body.matchAll(
          /### ([^\r\n]+)\r?\n\r?\n```(ts|html|css)\r?\n([\s\S]*?)\r?\n```/g,
        ),
      ];
      const auxiliaryTypeScriptBlocks = blocks.filter(
        (block) => block[2] === 'ts' && /\.(?:data|util)\.ts$/.test(block[1].trim()),
      );
      let anonymousIndex = 0;
      let exampleIndex = 0;
      let exampleDir = path.join(productDir, 'example-000');
      let expectedFiles = {};
      for (const block of blocks) {
        const [, rawTitle, language, source] = block;
        if (language === 'ts') {
          exampleDir = path.join(productDir, `example-${String(++exampleIndex).padStart(3, '0')}`);
          fs.mkdirSync(exampleDir, { recursive: true });
          expectedFiles = {
            html: source.match(/templateUrl:\s*['"]([^'"]+)['"]/)?.[1],
            css: source.match(/styleUrl:\s*['"]([^'"]+)['"]/)?.[1],
          };
          for (const auxiliaryBlock of auxiliaryTypeScriptBlocks) {
            const auxiliaryPath = path.join(exampleDir, path.basename(auxiliaryBlock[1].trim()));
            fs.writeFileSync(auxiliaryPath, `${auxiliaryBlock[3].trim()}\n`);
          }
        }
        const expectedExtension = language === 'ts' ? '.ts' : `.${language}`;
        const rawBasename = path.basename(rawTitle.trim());
        const fileName = expectedFiles[language]
          ? path.basename(expectedFiles[language])
          : rawBasename.endsWith(expectedExtension)
            ? rawBasename
            : `example-${String(++anonymousIndex).padStart(3, '0')}${expectedExtension}`;
        fs.mkdirSync(exampleDir, { recursive: true });
        const filePath = path.join(exampleDir, fileName);
        fs.writeFileSync(filePath, `${source.trim()}\n`);
        if (language === 'ts') tsFiles.push(filePath);
      }
    }

    for (const tsFile of tsFiles) {
      const source = fs.readFileSync(tsFile, 'utf8');
      for (const match of source.matchAll(/(?:templateUrl|styleUrl):\s*['"]([^'"]+)['"]/g)) {
        const referencedFile = path.resolve(path.dirname(tsFile), match[1]);
        if (!fs.existsSync(referencedFile)) {
          throw new Error(
            `${toWorkspaceRelative(tsFile)}: referenced example file is missing: ${match[1]}`,
          );
        }
      }
    }

    const tsConfigPath = path.join(tempRoot, 'tsconfig.json');
    fs.writeFileSync(
      tsConfigPath,
      `${JSON.stringify(
        {
          extends: path.join(docsRoot, 'tsconfig.app.json'),
          compilerOptions: { noEmit: true },
          files: tsFiles,
          include: [],
          exclude: [],
        },
        null,
        2,
      )}\n`,
    );
    execFileSync(path.join(workspaceRoot, 'node_modules/.bin/ngc'), ['-p', tsConfigPath], {
      cwd: workspaceRoot,
      encoding: 'utf8',
      stdio: 'pipe',
    });
  } catch (error) {
    const details = [error.message, error.stdout, error.stderr].filter(Boolean).join('\n').trim();
    throw new Error(`component example compilation failed${details ? `:\n${details}` : ''}`);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
  return tsFiles.length;
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
  } else if (command === 'check') {
    checkArtifacts(artifacts);
    console.log(`agent knowledge: ${documents.length} documents are valid and current`);
  } else {
    checkArtifacts(artifacts);
    const snippetCount = testComponentSnippets(documents);
    const exampleFileCount = testComponentExampleFiles(documents);
    console.log(
      `agent knowledge: ${snippetCount} overview examples and ${exampleFileCount} extracted example files compile successfully`,
    );
  }
} catch (error) {
  console.error(`agent knowledge: ${error.message}`);
  process.exit(1);
}
