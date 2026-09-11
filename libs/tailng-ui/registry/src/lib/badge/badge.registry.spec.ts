import { describe, expect, it } from 'vitest';
import { badgeRegistryItem } from './badge.registry';

describe('badge registry item', () => {
  it('contains expected metadata', () => {
    expect(badgeRegistryItem.name).toBe('badge');
    expect(badgeRegistryItem.dependencies).toEqual([]);
    expect(badgeRegistryItem.files).toHaveLength(3);
  });

  it('generates local badge directive source files', () => {
    const componentFile = badgeRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/badge/tng-badge.ts'),
    );
    expect(componentFile?.content).toContain('export class TngBadge');

    const primitiveFile = badgeRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/badge/tng-badge-primitive.ts'),
    );
    expect(primitiveFile?.content).toContain("selector: '[tngBadge]'");
    expect(primitiveFile?.content).toContain(
      "'var(--tng-badge-radius, var(--tng-radius-control, 0.5rem))'",
    );
    expect(primitiveFile?.content).not.toContain('var(--tng-badge-radius, 9999px)');

    const indexFile = badgeRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/badge/index.ts'),
    );
    expect(indexFile?.content).toContain("export * from './tng-badge';");
    expect(indexFile?.content).toContain("export * from './tng-badge-primitive';");
  });
});
