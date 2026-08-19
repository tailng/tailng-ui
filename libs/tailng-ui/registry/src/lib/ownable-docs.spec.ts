import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getRegistryGeneratedFilePaths, getRegistryImportSymbols } from './ownable-docs';
import { listRegistryItemNames } from './registry';

function collectRouteFiles(directory: string): readonly string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectRouteFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name === 'routes.ts') {
      files.push(fullPath);
    }
  }

  return files;
}

describe('ownable docs helpers', () => {
  it('derives generated files directly from the registry item', () => {
    expect(getRegistryGeneratedFilePaths('button')).toEqual([
      'src/app/tailng-ui/tng-trigger-target.ts',
      'src/app/tailng-ui/button/tng-press-primitive.ts',
      'src/app/tailng-ui/button/tng-button.ts',
      'src/app/tailng-ui/button/tng-button.html',
      'src/app/tailng-ui/button/tng-button.css',
      'src/app/tailng-ui/button/index.ts',
    ]);
  });

  it('derives import symbols from wrapper and primitive source files', () => {
    expect(getRegistryImportSymbols('button')).toEqual(['TngButton', 'TngPressPrimitive']);
    expect(getRegistryImportSymbols('tooltip')).toEqual([
      'TngTooltip',
      'TngTooltipTrigger',
      'TngTooltipContent',
    ]);
    expect(getRegistryImportSymbols('breadcrumb')).toEqual([
      'TngBreadcrumb',
      'TngBreadcrumbPrimitive',
      'TngBreadcrumbListPrimitive',
      'TngBreadcrumbItemPrimitive',
      'TngBreadcrumbLinkPrimitive',
      'TngBreadcrumbSeparatorPrimitive',
    ]);
  });

  it('keeps docs ownable routes aligned with supported registry items', () => {
    const docsComponentsDirectory = resolve(
      process.cwd(),
      'apps/tailng-ui/docs/src/app/pages/components',
    );
    const routeFiles = collectRouteFiles(docsComponentsDirectory).filter((file) => {
      return readFileSync(file, 'utf8').includes("path: 'ownable-install'");
    });
    const registryNames = new Set(listRegistryItemNames());

    expect(routeFiles.length).toBeGreaterThan(0);

    for (const routeFile of routeFiles) {
      const content = readFileSync(routeFile, 'utf8');

      expect(content).not.toMatch(/componentName:/);
      expect(content).not.toMatch(/componentSymbol:/);
      expect(content).not.toMatch(/primitiveSymbol:/);

      const registrySlugMatches = content.matchAll(/registrySlug:\s*'([^']+)'/g);
      const registrySlugs = Array.from(registrySlugMatches, ([, slug]) => slug);

      expect(registrySlugs.length).toBeGreaterThan(0);

      for (const registrySlug of registrySlugs) {
        expect(
          registryNames.has(registrySlug),
          `Missing registry item "${registrySlug}" for ${routeFile}`,
        ).toBe(true);
      }

      expect(content, `Hard-coded ownable redirect in ${routeFile}`).not.toMatch(
        /redirectTo:\s*['"]\/ownable\//,
      );

      const redirectSlug = content.match(/requireOwnableDocsHref\('([^']+)'\)/)?.[1];
      const rendersRegistryInstallLocally = content.includes(
        'DocsOwnableInstallSectionComponent',
      );

      expect(
        redirectSlug === registrySlugs[0] || rendersRegistryInstallLocally,
        `Expected a canonical ownable redirect or local registry renderer for ${routeFile}`,
      ).toBe(true);
    }
  });
});
