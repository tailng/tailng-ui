import { resolve } from 'node:path';

export function createTailngUiCdkSecondaryAliases(
  workspaceRoot: string,
): readonly Readonly<{ find: RegExp; replacement: string }>[] {
  const cdkSourceRoot = resolve(workspaceRoot, 'libs/tailng-ui/cdk/src');

  return [
    {
      find: /^@tailng-ui\/cdk\/adapters$/,
      replacement: resolve(cdkSourceRoot, 'adapters/index.ts'),
    },
    {
      find: /^@tailng-ui\/cdk\/a11y$/,
      replacement: resolve(cdkSourceRoot, 'a11y/index.ts'),
    },
    {
      find: /^@tailng-ui\/cdk\/collections$/,
      replacement: resolve(cdkSourceRoot, 'collections/index.ts'),
    },
    {
      find: /^@tailng-ui\/cdk\/core$/,
      replacement: resolve(cdkSourceRoot, 'core/index.ts'),
    },
    {
      find: /^@tailng-ui\/cdk\/overlay$/,
      replacement: resolve(cdkSourceRoot, 'overlay/index.ts'),
    },
    {
      find: /^@tailng-ui\/cdk\/runtime$/,
      replacement: resolve(cdkSourceRoot, 'overlay/runtime/index.ts'),
    },
  ];
}
