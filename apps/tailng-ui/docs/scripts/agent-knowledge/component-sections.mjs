/* global process */

import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function listFiles(root, predicate) {
  if (!fs.existsSync(root)) return [];
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(entryPath, predicate));
    else if (predicate(entryPath)) files.push(entryPath);
  }
  return files.sort((left, right) => left.localeCompare(right));
}

function unwrapExpression(node) {
  let current = node;
  while (
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isParenthesizedExpression(current) ||
    ts.isNonNullExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function collectStaticValues(filePaths) {
  const nodes = new Map();
  for (const filePath of filePaths) {
    const sourceFile = ts.createSourceFile(
      filePath,
      fs.readFileSync(filePath, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );
    const visit = (node) => {
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
        nodes.set(node.name.text, node.initializer);
      }
      if (ts.isPropertyDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
        nodes.set(node.name.text, node.initializer);
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }

  const values = new Map();
  const resolving = new Set();
  const evaluate = (input) => {
    const node = unwrapExpression(input);
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    if (ts.isTemplateExpression(node)) {
      let result = node.head.text;
      for (const span of node.templateSpans) {
        const expression = evaluate(span.expression);
        if (expression === undefined) return undefined;
        result += `${String(expression)}${span.literal.text}`;
      }
      return result;
    }
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (node.kind === ts.SyntaxKind.NullKeyword) return null;
    if (ts.isIdentifier(node)) {
      if (values.has(node.text)) return values.get(node.text);
      const referencedNode = nodes.get(node.text);
      if (referencedNode === undefined || resolving.has(node.text)) return undefined;
      resolving.add(node.text);
      const value = evaluate(referencedNode);
      resolving.delete(node.text);
      if (value !== undefined) values.set(node.text, value);
      return value;
    }
    if (ts.isArrayLiteralExpression(node)) {
      const items = node.elements.map(evaluate);
      return items.some((item) => item === undefined) ? undefined : items;
    }
    if (ts.isObjectLiteralExpression(node)) {
      const value = {};
      for (const property of node.properties) {
        if (!ts.isPropertyAssignment(property)) continue;
        const name = property.name.getText().replace(/^['"]|['"]$/g, '');
        const propertyValue = evaluate(property.initializer);
        if (propertyValue !== undefined) value[name] = propertyValue;
      }
      return value;
    }
    if (ts.isTaggedTemplateExpression(node)) {
      const tag = node.tag.getText();
      if (tag !== 'String.raw') return undefined;
      if (ts.isNoSubstitutionTemplateLiteral(node.template)) return node.template.rawText;
      if (!ts.isTemplateExpression(node.template)) return undefined;
      let result = node.template.head.rawText;
      for (const span of node.template.templateSpans) {
        const expression = evaluate(span.expression);
        if (expression === undefined) return undefined;
        result += `${String(expression)}${span.literal.rawText}`;
      }
      return result;
    }
    if (ts.isCallExpression(node)) {
      const expressionText = node.expression.getText();
      if (expressionText === 'Object.freeze' && node.arguments[0])
        return evaluate(node.arguments[0]);
      if (expressionText === 'JSON.stringify' && node.arguments[0]) {
        const value = evaluate(node.arguments[0]);
        const indentation = node.arguments[2] ? evaluate(node.arguments[2]) : undefined;
        return value === undefined ? undefined : JSON.stringify(value, null, indentation);
      }
      if (
        ts.isPropertyAccessExpression(node.expression) &&
        node.expression.name.text === 'join' &&
        node.arguments.length <= 1
      ) {
        const valuesToJoin = evaluate(node.expression.expression);
        const separator = node.arguments[0] ? evaluate(node.arguments[0]) : ',';
        return Array.isArray(valuesToJoin) && typeof separator === 'string'
          ? valuesToJoin.join(separator)
          : undefined;
      }
    }
    return undefined;
  };

  for (const name of nodes.keys()) {
    if (!values.has(name)) {
      const value = evaluate(nodes.get(name));
      if (value !== undefined) values.set(name, value);
    }
  }
  return values;
}

function decodeHtml(value) {
  const entities = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  };
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&([a-z]+);/gi, (match, name) => entities[name.toLowerCase()] ?? match);
}

function cleanInlineHtml(value) {
  return decodeHtml(
    value
      .replace(/<code(?:\s[^>]*)?>/gi, '`')
      .replace(/<\/code>/gi, '`')
      .replace(/<br\s*\/?\s*>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/{{[\s\S]*?}}/g, '')
      .replace(/@[a-z]+\s*\([^)]*\)\s*{/gi, ''),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeTableCell(value) {
  return String(value ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, '<br>')
    .trim();
}

function renderTable(headers, rows) {
  if (headers.length === 0 || rows.length === 0) return '';
  return [
    `| ${headers.map(escapeTableCell).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(escapeTableCell).join(' | ')} |`),
  ].join('\n');
}

function renderHtmlTable(tableHtml, staticValues) {
  const headers = [...tableHtml.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gi)].map((match) =>
    cleanInlineHtml(match[1]),
  );
  const forMatch = tableHtml.match(/@for\s*\(\s*\w+\s+of\s+(\w+)/);
  if (forMatch) {
    const values = staticValues.get(forMatch[1]);
    if (!Array.isArray(values)) return '';
    const rowName = tableHtml.match(/@for\s*\(\s*(\w+)\s+of/)?.[1] ?? 'row';
    const propertyOrder = [
      ...new Set(
        [...tableHtml.matchAll(new RegExp(`{{\\s*${rowName}\\.(\\w+)`, 'g'))].map(
          (match) => match[1],
        ),
      ),
    ];
    const rows = values
      .filter((value) => value !== null && typeof value === 'object' && !Array.isArray(value))
      .map((value) => propertyOrder.map((property) => value[property] ?? ''));
    return renderTable(headers.length === propertyOrder.length ? headers : propertyOrder, rows);
  }
  const body = tableHtml.match(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/i)?.[1] ?? tableHtml;
  const rows = [...body.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((rowMatch) =>
      [...rowMatch[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) =>
        cleanInlineHtml(cell[1]),
      ),
    )
    .filter((row) => row.length > 0);
  return renderTable(headers, rows);
}

function getAttribute(tag, name) {
  return tag.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`, 'i'))?.[1] ?? null;
}

function getBoundAttribute(tag, name) {
  return tag.match(new RegExp(`\\[${name}\\]="([^"]*)"`, 'i'))?.[1] ?? null;
}

function renderCodeBlockTag(tag, staticValues) {
  const reference = getBoundAttribute(tag, 'code');
  const code = reference ? staticValues.get(reference) : null;
  if (typeof code !== 'string' || code.trim() === '') return '';
  const language = getAttribute(tag, 'language') ?? 'text';
  const title = getAttribute(tag, 'title');
  return `${title ? `#### ${title}\n\n` : ''}\`\`\`${language}\n${code.trim()}\n\`\`\``;
}

function renderHumanSectionHtml(html, staticValues) {
  const blocks = [];
  const pattern =
    /<(h[1-4]|p|table|tng-code-block)\b[^>]*>[\s\S]*?<\/\1>|<tng-code-block\b[^>]*><\/tng-code-block>/gi;
  for (const match of html.matchAll(pattern)) {
    const block = match[0];
    const tagName = match[1]?.toLowerCase() ?? 'tng-code-block';
    if (tagName.startsWith('h')) {
      const text = cleanInlineHtml(block);
      if (text) blocks.push(`${'#'.repeat(Number(tagName[1]))} ${text}`);
    } else if (tagName === 'p') {
      const text = cleanInlineHtml(block);
      if (text && !text.includes('@for')) blocks.push(text);
    } else if (tagName === 'table') {
      const table = renderHtmlTable(block, staticValues);
      if (table) blocks.push(table);
    } else {
      const code = renderCodeBlockTag(block, staticValues);
      if (code) blocks.push(code);
    }
  }
  return blocks.join('\n\n');
}

function renderSectionIntroduction(html) {
  const heading = html.match(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/i);
  const paragraph = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
  return [
    heading ? `## ${cleanInlineHtml(heading[1])}` : '',
    paragraph ? cleanInlineHtml(paragraph[1]) : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}

function collectCodeTabs(staticValues) {
  const tabs = [];
  const seen = new Set();
  const visit = (value) => {
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (value === null || typeof value !== 'object') return;
    if (
      typeof value.code === 'string' &&
      typeof value.language === 'string' &&
      value.code.trim() !== ''
    ) {
      const key = `${value.language}\u0000${value.title ?? ''}\u0000${value.code}`;
      if (!seen.has(key)) {
        seen.add(key);
        tabs.push({
          code: value.code,
          language: value.language,
          title: value.title ?? value.label ?? 'Example',
        });
      }
    }
    for (const nested of Object.values(value)) visit(nested);
  };
  for (const value of staticValues.values()) visit(value);
  return tabs;
}

function renderCodeTabs(tabs, existingBody = '') {
  return tabs
    .filter((tab) => !existingBody.includes(tab.code.trim()))
    .map((tab) => `### ${tab.title}\n\n\`\`\`${tab.language}\n${tab.code.trim()}\n\`\`\``)
    .join('\n\n');
}

function renderApiFacts(product) {
  const structural = [];
  const detailed = [];
  for (const api of product.apis) {
    const rows = [];
    if (api.inputs.length)
      rows.push(`- Inputs: ${api.inputs.map((name) => `\`${name}\``).join(', ')}`);
    if (api.requiredInputs.length) {
      rows.push(`- Required inputs: ${api.requiredInputs.map((name) => `\`${name}\``).join(', ')}`);
    }
    if (api.models.length)
      rows.push(`- Two-way models: ${api.models.map((name) => `\`${name}\``).join(', ')}`);
    if (api.outputs.length)
      rows.push(`- Outputs: ${api.outputs.map((name) => `\`${name}\``).join(', ')}`);
    if (api.forwardedInputs.length) {
      rows.push(
        `- Forwarded inputs: ${api.forwardedInputs.map((name) => `\`${name}\``).join(', ')}`,
      );
    }
    if (api.forwardedOutputs.length) {
      rows.push(
        `- Forwarded outputs: ${api.forwardedOutputs.map((name) => `\`${name}\``).join(', ')}`,
      );
    }
    const label = `\`${api.symbol}\`${api.selector ? ` — \`${api.selector}\`` : ''}`;
    if (rows.length === 0) structural.push(label);
    else detailed.push(`### ${label}\n\n${rows.join('\n')}`);
  }
  const sections = [];
  if (detailed.length) sections.push(detailed.join('\n\n'));
  if (structural.length) {
    sections.push(
      `### Structural surfaces\n\nThese APIs provide composition or projection surfaces without their own bindable signal API:\n\n${structural.map((item) => `- ${item}`).join('\n')}`,
    );
  }
  return sections.join('\n\n');
}

function selectPrimaryApi(product) {
  const aliases = {
    codeblock: 'TngCodeBlockComponent',
    copybutton: 'TngCopyButtonComponent',
    fileupload: 'TngFileUploadDirective',
    pagination: 'TngPaginatorComponent',
  };
  const toPascalCase = (value) =>
    value
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
      .join('');
  const expected = aliases[product.id] ?? `Tng${toPascalCase(product.id)}Component`;
  return product.apis.find((api) => api.symbol === expected) ?? product.apis[0];
}

function renderFallbackExample(product) {
  const primary = selectPrimaryApi(product);
  const selector = primary.selector ?? '';
  const template = selector.startsWith('tng-')
    ? `<${selector} />`
    : selector.match(/^\[([a-zA-Z][a-zA-Z0-9]*)\]$/)
      ? `<div ${selector.slice(1, -1)}></div>`
      : '<!-- See the component API for composition. -->';
  return `## Minimal example

\`\`\`ts
import { Component } from '@angular/core';
import { ${primary.symbol} } from '${product.importPath}';

@Component({
  standalone: true,
  imports: [${primary.symbol}],
  template: \`${template}\`,
})
export class ${product.id.replace(/(^|-)([a-z])/g, (_, __, letter) => letter.toUpperCase())}Example {}
\`\`\``;
}

function renderStylingFallback(product, workspaceRoot) {
  const sourceDirs = new Set(
    product.sourcePaths
      .filter((sourcePath) => sourcePath.includes('/src/') && sourcePath.endsWith('.ts'))
      .map((sourcePath) => path.dirname(path.join(workspaceRoot, sourcePath))),
  );
  const cssFiles = [...sourceDirs].flatMap((directory) =>
    listFiles(directory, (filePath) => filePath.endsWith('.css')),
  );
  const hooks = new Set();
  const tokens = new Set();
  for (const cssFile of cssFiles) {
    const css = fs.readFileSync(cssFile, 'utf8');
    for (const match of css.matchAll(
      /data-(?:slot|state|variant|tone|size|orientation|disabled|active|open|selected)(?:=[^\]\s,{]+)?/g,
    )) {
      hooks.add(match[0]);
    }
    for (const match of css.matchAll(/--tng-[a-zA-Z0-9-]+/g)) tokens.add(match[0]);
  }
  const blocks = [
    '## Styling contract',
    '',
    'Load the TailNG theme contract stylesheet and prefer semantic tokens over hard-coded colors.',
  ];
  if (hooks.size)
    blocks.push(
      '',
      '### State and slot hooks',
      '',
      [...hooks]
        .sort()
        .map((hook) => `- \`${hook}\``)
        .join('\n'),
    );
  if (tokens.size)
    blocks.push(
      '',
      '### CSS custom properties',
      '',
      [...tokens]
        .sort()
        .map((token) => `- \`${token}\``)
        .join('\n'),
    );
  return blocks.join('\n');
}

export function buildComponentSectionBodies(product, docsRoot, workspaceRoot) {
  const sectionBodies = {};
  const sectionSources = {};
  for (const section of ['api', 'styling', 'examples']) {
    const sectionDir = path.join(
      docsRoot,
      'src/app/pages/components',
      product.groupId,
      product.slug,
      'sections',
      section,
    );
    const files = listFiles(
      sectionDir,
      (filePath) =>
        (filePath.endsWith('.ts') || filePath.endsWith('.html') || filePath.endsWith('.css')) &&
        !filePath.endsWith('.spec.ts') &&
        !filePath.endsWith('.test.ts'),
    );
    const tsFiles = files.filter((filePath) => filePath.endsWith('.ts'));
    const htmlFiles = files.filter((filePath) => filePath.endsWith('.html'));
    const staticValues = collectStaticValues(tsFiles);
    const renderedHtml = htmlFiles
      .map((filePath) => renderHumanSectionHtml(fs.readFileSync(filePath, 'utf8'), staticValues))
      .filter(Boolean)
      .join('\n\n');
    const introduction = htmlFiles
      .map((filePath) => renderSectionIntroduction(fs.readFileSync(filePath, 'utf8')))
      .filter(Boolean)
      .join('\n\n');
    const codeTabs = renderCodeTabs(collectCodeTabs(staticValues), renderedHtml);
    sectionSources[section] = files.map((filePath) =>
      toPosixPath(path.relative(workspaceRoot, filePath)),
    );

    if (section === 'api') {
      sectionBodies.api = `# ${product.title} API

${product.description}

${renderedHtml ? `${renderedHtml}\n\n` : ''}## Source-derived public Angular API

${renderApiFacts(product)}${codeTabs ? `\n\n## Additional API examples\n\n${codeTabs}` : ''}`.trim();
    } else if (section === 'styling') {
      sectionBodies.styling = `# ${product.title} styling

${renderedHtml || renderStylingFallback(product, workspaceRoot)}${codeTabs ? `\n\n## Styling examples\n\n${codeTabs}` : ''}`.trim();
    } else {
      sectionBodies.examples = `# ${product.title} examples

${introduction ? `${introduction}\n\n` : ''}${codeTabs || renderFallbackExample(product)}`.trim();
    }
  }
  return { sectionBodies, sectionSources };
}
