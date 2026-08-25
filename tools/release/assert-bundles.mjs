import fs from 'node:fs';
import path from 'node:path';
import { APF_PACKAGES, parseTargets } from './package-catalog.mjs';

const selected = new Set(parseTargets(process.argv[2] ?? ''));

const EXPECTED_SIDE_EFFECTS = new Map([
  ['cdk', false],
  ['primitives', false],
  ['components', false],
  ['icons', ['./fesm2022/tailng-ui-icons.mjs']],
  ['theme', ['**/*.css']],
  ['charts', false],
  ['flow', ['./styles.css', './styles.scss']],
  ['flow-layout-dagre', false],
]);

const EXPECTED_SECONDARY_ENTRY_POINTS = new Map([
  ['cdk', ['./a11y', './adapters', './collections', './core', './overlay', './runtime']],
  ['icons', ['./core']],
]);

const PARTIAL_COMPILED_PACKAGES = new Set(['primitives', 'components', 'icons', 'charts', 'flow']);

function fail(message) {
  console.error(`assert-bundles: ${message}`);
  process.exit(1);
}

function exists(file) {
  return fs.existsSync(file);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listFiles(dir, predicate = () => true) {
  if (!exists(dir)) return [];

  const files = [];
  const visit = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (predicate(file)) files.push(file);
    }
  };
  visit(dir);
  return files;
}

function collectManifestTargets(value) {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(collectManifestTargets);
}

function wildcardTargetMatches(root, relativeTarget) {
  const pattern = relativeTarget
    .split('*')
    .map((part) => part.replace(/[|\\{}()[\]^$+?.]/g, '\\$&'))
    .join('[^/]+');
  const matcher = new RegExp(`^${pattern}$`);
  return listFiles(root).some((file) =>
    matcher.test(path.relative(root, file).split(path.sep).join('/')),
  );
}

function assertManifestTargetExists(root, target, label) {
  if (!target.startsWith('./')) {
    fail(`${label} must use a package-relative target; received '${target}'`);
  }

  const relativeTarget = target.slice(2);
  if (relativeTarget.includes('*')) {
    if (!wildcardTargetMatches(root, relativeTarget)) {
      fail(`${label} wildcard does not match a published file: '${target}'`);
    }
    return;
  }

  if (!exists(path.join(root, relativeTarget))) {
    fail(`${label} points to a missing published file: '${target}'`);
  }
}

function assertNoCommonJs(name, files, root) {
  const markers = [
    ['require(', /\brequire\s*\(/],
    ['module.exports', /\bmodule\.exports\b/],
  ];

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    for (const [label, matcher] of markers) {
      if (matcher.test(source)) {
        fail(`${name}: CommonJS marker '${label}' found in ${path.relative(root, file)}`);
      }
    }
  }
}

function assertRelativeEsmSpecifiersHaveExtensions(name, files, root) {
  const specifierPattern = /(?:\bfrom\s*|\bimport\s*)["'](\.[^"']+)["']/g;
  const allowedExtension = /\.(?:mjs|js|json|css|scss)$/;

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(specifierPattern)) {
      if (!allowedExtension.test(match[1])) {
        fail(
          `${name}: extensionless relative ESM specifier '${match[1]}' in ${path.relative(root, file)}`,
        );
      }
    }
  }
}

function assertApfPackage(definition) {
  const { target: name, packageName } = definition;
  const root = path.resolve(definition.distDir);
  const packageJsonPath = path.join(root, 'package.json');

  if (!exists(packageJsonPath)) fail(`${name}: missing ${packageJsonPath}`);
  const pkg = readJson(packageJsonPath);

  if (pkg.name !== packageName) {
    fail(`${name}: expected package name '${packageName}', received '${pkg.name}'`);
  }
  if (pkg.type !== 'module') fail(`${name}: package.json must declare "type": "module"`);

  const expectedSideEffects = EXPECTED_SIDE_EFFECTS.get(name);
  if (JSON.stringify(pkg.sideEffects) !== JSON.stringify(expectedSideEffects)) {
    fail(
      `${name}: sideEffects must be ${JSON.stringify(expectedSideEffects)}, received ${JSON.stringify(pkg.sideEffects)}`,
    );
  }

  if (!pkg.exports || typeof pkg.exports !== 'object' || Array.isArray(pkg.exports)) {
    fail(`${name}: package.json must declare APF exports`);
  }

  const rootExport = pkg.exports['.'];
  if (
    !rootExport ||
    typeof rootExport !== 'object' ||
    typeof rootExport.types !== 'string' ||
    typeof rootExport.default !== 'string'
  ) {
    fail(`${name}: root export must declare 'types' and 'default' targets`);
  }
  if (!rootExport.types.startsWith('./types/') || !rootExport.types.endsWith('.d.ts')) {
    fail(`${name}: root types must use the APF types directory; received '${rootExport.types}'`);
  }
  if (!rootExport.default.startsWith('./fesm2022/') || !rootExport.default.endsWith('.mjs')) {
    fail(`${name}: root JavaScript must use an FESM2022 .mjs; received '${rootExport.default}'`);
  }

  const manifestTargets = collectManifestTargets(pkg.exports);
  for (const target of manifestTargets) {
    if (target.includes('/src/')) {
      fail(`${name}: package export exposes the former raw source layout: '${target}'`);
    }
    assertManifestTargetExists(root, target, `${name}: package.json#exports`);
  }

  for (const field of ['module', 'typings']) {
    if (typeof pkg[field] !== 'string' || !exists(path.join(root, pkg[field]))) {
      fail(`${name}: package.json#${field} must point to a published APF artifact`);
    }
  }

  for (const subpath of EXPECTED_SECONDARY_ENTRY_POINTS.get(name) ?? []) {
    const value = pkg.exports[subpath];
    if (
      !value ||
      typeof value.types !== 'string' ||
      !value.types.startsWith('./types/') ||
      typeof value.default !== 'string' ||
      !value.default.startsWith('./fesm2022/')
    ) {
      fail(`${name}: secondary entry point '${subpath}' is missing APF types/default exports`);
    }
  }

  if (exists(path.join(root, 'src'))) {
    fail(`${name}: raw src/ output must not be published after the APF migration`);
  }

  const fesmFiles = listFiles(path.join(root, 'fesm2022'), (file) => file.endsWith('.mjs'));
  const typeFiles = listFiles(path.join(root, 'types'), (file) => file.endsWith('.d.ts'));
  if (fesmFiles.length === 0) fail(`${name}: fesm2022 contains no .mjs bundles`);
  if (typeFiles.length === 0) fail(`${name}: types contains no .d.ts bundles`);
  if (fesmFiles.every((file) => fs.statSync(file).size < 256)) {
    fail(`${name}: every FESM2022 bundle is suspiciously small`);
  }

  assertNoCommonJs(name, fesmFiles, root);
  assertRelativeEsmSpecifiersHaveExtensions(name, fesmFiles, root);

  for (const file of typeFiles) {
    const declaration = fs.readFileSync(file, 'utf8');
    if (/(?:from\s*|import\s*)["'](?:dist\/|\/)/.test(declaration)) {
      fail(`${name}: declaration bundle contains a private filesystem import`);
    }
  }

  if (PARTIAL_COMPILED_PACKAGES.has(name)) {
    const bundleSource = fesmFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
    if (!bundleSource.includes('ɵɵngDeclare')) {
      fail(`${name}: Angular partial-compilation declarations were not found in FESM output`);
    }
  }
}

function assertThemeAssets() {
  const root = path.resolve('dist/libs/tailng-ui/theme');
  const pkg = readJson(path.join(root, 'package.json'));
  const required = ['index.css', 'component-contracts/index.css'];

  for (const relative of required) {
    const file = path.join(root, relative);
    if (!exists(file) || fs.statSync(file).size === 0) {
      fail(`theme: missing or empty published asset '${relative}'`);
    }
  }

  if (pkg.style !== './index.css' || pkg.exports?.['./index.css'] !== './index.css') {
    fail(`theme: root style and './index.css' export must point to './index.css'`);
  }
}

function assertFlowContract() {
  const root = path.resolve('dist/libs/tailng-ui/flow');
  const pkg = readJson(path.join(root, 'package.json'));

  for (const style of ['./styles.css', './styles.scss']) {
    const file = path.join(root, style.slice(2));
    if (!exists(file) || fs.statSync(file).size === 0) {
      fail(`flow: missing or empty published style '${style}'`);
    }
    if (pkg.exports?.[style] !== style || !pkg.sideEffects?.includes(style)) {
      fail(`flow: '${style}' must remain exported and side-effectful`);
    }
  }

  const declaration = fs.readFileSync(path.join(root, 'types/tailng-ui-flow.d.ts'), 'utf8');
  if (declaration.includes('@foblex/')) {
    fail('flow: a Foblex type leaked into the public declaration bundle');
  }

  const requiredSymbols = [
    'TngFlowConnectionCreateRequest',
    'TngFlowConnectionReconnectRequest',
    'TngFlowConnectionValidator',
    'TngFlowEditorMode',
    'TngFlowPresentation',
    'TngFlowSelection',
    'TngFlowValidation',
    'TngFlowValidationBadgeComponent',
    'TngFlowValidationTarget',
    'sanitizeTngFlowSelection',
    'validateTngFlowDefinition',
  ];
  for (const symbol of requiredSymbols) {
    if (!declaration.includes(symbol)) fail(`flow: public declaration is missing '${symbol}'`);
  }
}

for (const definition of APF_PACKAGES) {
  if (selected.has(definition.target)) assertApfPackage(definition);
}

if (selected.has('theme')) assertThemeAssets();
if (selected.has('flow')) assertFlowContract();

console.log('assert-bundles: all selected APF outputs look sane.');
