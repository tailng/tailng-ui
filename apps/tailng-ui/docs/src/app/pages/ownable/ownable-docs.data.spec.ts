import { getRegistryItem } from '@tailng-ui/registry';
import { describe, expect, it } from 'vitest';
import {
  getOwnableDocsHref,
  OWNABLE_DOCS_GROUPS,
  requireOwnableDocsHref,
} from './ownable-docs.data';
import { OWNABLE_ROUTES } from './routes';

function getCanonicalOwnableRoutePaths(): ReadonlySet<string> {
  const rootRoute = OWNABLE_ROUTES[0];
  return new Set(
    rootRoute?.children
      ?.map((route) => route.path)
      .filter((path): path is string => path !== undefined && path !== '' && path !== '**') ?? [],
  );
}

describe('ownable docs registry contract', () => {
  it('maps each documented registry item exactly once', () => {
    const registrySlugs = OWNABLE_DOCS_GROUPS.flatMap((group) =>
      group.items.flatMap((item) => (item.registrySlug === undefined ? [] : [item.registrySlug])),
    );

    expect(registrySlugs.length).toBeGreaterThan(0);
    expect(new Set(registrySlugs).size).toBe(registrySlugs.length);

    for (const registrySlug of registrySlugs) {
      const item = getRegistryItem(registrySlug);
      expect(item, `Missing registry item "${registrySlug}"`).toBeDefined();
      expect(item?.install.importPath).toBe(`./tailng-ui/${registrySlug}`);
      expect(item?.install.importSymbols.length).toBeGreaterThan(0);
    }
  });

  it('resolves every registry-backed docs item to a real canonical route', () => {
    const routePaths = getCanonicalOwnableRoutePaths();

    for (const group of OWNABLE_DOCS_GROUPS) {
      for (const item of group.items) {
        if (item.registrySlug === undefined) {
          continue;
        }

        const expectedHref = `/ownable/${group.id}/${item.slug}`;
        expect(getOwnableDocsHref(item.registrySlug)).toBe(expectedHref);
        expect(requireOwnableDocsHref(item.registrySlug)).toBe(expectedHref);
        expect(routePaths.has(`${group.id}/${item.slug}`), expectedHref).toBe(true);
      }
    }
  });

  it('keeps confetti on its advertised ownable route', () => {
    expect(requireOwnableDocsHref('confetti')).toBe('/ownable/feedback/confetti');
  });
});
