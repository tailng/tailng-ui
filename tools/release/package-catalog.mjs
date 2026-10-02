export const PACKAGE_CATALOG = Object.freeze([
  {
    target: 'cdk',
    packageName: '@tailng-ui/cdk',
    project: 'cdk',
    sourcePackageJson: 'libs/tailng-ui/cdk/package.json',
    distDir: 'dist/libs/tailng-ui/cdk',
    apf: true,
    publishedSideEffects: false,
  },
  {
    target: 'primitives',
    packageName: '@tailng-ui/primitives',
    project: 'primitives',
    sourcePackageJson: 'libs/tailng-ui/primitives/package.json',
    distDir: 'dist/libs/tailng-ui/primitives',
    apf: true,
    publishedSideEffects: false,
  },
  {
    target: 'components',
    packageName: '@tailng-ui/components',
    project: 'components',
    sourcePackageJson: 'libs/tailng-ui/components/package.json',
    distDir: 'dist/libs/tailng-ui/components',
    apf: true,
    publishedSideEffects: false,
  },
  {
    target: 'icons',
    packageName: '@tailng-ui/icons',
    project: 'icons',
    sourcePackageJson: 'libs/tailng-ui/icons/package.json',
    distDir: 'dist/libs/tailng-ui/icons',
    apf: true,
    publishedSideEffects: ['./fesm2022/tailng-ui-icons.mjs'],
  },
  {
    target: 'theme',
    packageName: '@tailng-ui/theme',
    project: 'theme',
    sourcePackageJson: 'libs/tailng-ui/theme/package.json',
    distDir: 'dist/libs/tailng-ui/theme',
    apf: true,
    publishedSideEffects: ['**/*.css'],
  },
  {
    target: 'registry',
    packageName: '@tailng-ui/registry',
    project: 'registry',
    sourcePackageJson: 'libs/tailng-ui/registry/package.json',
    distDir: 'dist/libs/tailng-ui/registry',
    apf: false,
  },
  {
    target: 'charts',
    packageName: '@tailng-ui/charts',
    project: 'charts',
    sourcePackageJson: 'libs/tailng-ui/charts/package.json',
    distDir: 'dist/libs/tailng-ui/charts',
    apf: true,
    publishedSideEffects: false,
  },
  {
    target: 'flow',
    packageName: '@tailng-ui/flow',
    project: 'flow',
    sourcePackageJson: 'libs/tailng-ui/flow/package.json',
    distDir: 'dist/libs/tailng-ui/flow',
    apf: true,
    publishedSideEffects: ['./styles.css', './styles.scss'],
  },
  {
    target: 'cli',
    packageName: 'tailng',
    project: 'tailng-cli',
    sourcePackageJson: 'libs/tailng/cli/package.json',
    distDir: 'dist/libs/tailng/cli',
    apf: false,
  },
]);

export const PACKAGE_BY_TARGET = new Map(
  PACKAGE_CATALOG.map((definition) => [definition.target, definition]),
);

export const APF_PACKAGES = Object.freeze(PACKAGE_CATALOG.filter((definition) => definition.apf));

export const PUBLISHABLE_PACKAGES = PACKAGE_CATALOG;
export const VALID_TARGETS = Object.freeze([...PACKAGE_BY_TARGET.keys(), 'docs']);
export const VALID_RELEASE_TYPES = Object.freeze(['patch', 'minor', 'major']);

export function parseTargets(value) {
  return value
    .split(',')
    .map((target) => target.trim())
    .filter(Boolean);
}
