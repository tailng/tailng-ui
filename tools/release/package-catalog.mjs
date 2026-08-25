export const PACKAGE_CATALOG = Object.freeze([
  {
    target: 'cdk',
    packageName: '@tailng-ui/cdk',
    project: 'cdk',
    sourcePackageJson: 'libs/tailng-ui/cdk/package.json',
    distDir: 'dist/libs/tailng-ui/cdk',
    apf: true,
  },
  {
    target: 'primitives',
    packageName: '@tailng-ui/primitives',
    project: 'primitives',
    sourcePackageJson: 'libs/tailng-ui/primitives/package.json',
    distDir: 'dist/libs/tailng-ui/primitives',
    apf: true,
  },
  {
    target: 'components',
    packageName: '@tailng-ui/components',
    project: 'components',
    sourcePackageJson: 'libs/tailng-ui/components/package.json',
    distDir: 'dist/libs/tailng-ui/components',
    apf: true,
  },
  {
    target: 'icons',
    packageName: '@tailng-ui/icons',
    project: 'icons',
    sourcePackageJson: 'libs/tailng-ui/icons/package.json',
    distDir: 'dist/libs/tailng-ui/icons',
    apf: true,
  },
  {
    target: 'theme',
    packageName: '@tailng-ui/theme',
    project: 'theme',
    sourcePackageJson: 'libs/tailng-ui/theme/package.json',
    distDir: 'dist/libs/tailng-ui/theme',
    apf: true,
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
  },
  {
    target: 'flow',
    packageName: '@tailng-ui/flow',
    project: 'flow',
    sourcePackageJson: 'libs/tailng-ui/flow/package.json',
    distDir: 'dist/libs/tailng-ui/flow',
    apf: true,
  },
  {
    target: 'flow-layout-dagre',
    packageName: '@tailng-ui/flow-layout-dagre',
    project: 'flow-layout-dagre',
    sourcePackageJson: 'libs/tailng-ui/flow-layout-dagre/package.json',
    distDir: 'dist/libs/tailng-ui/flow-layout-dagre',
    apf: true,
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
