import { describe, expect, it } from 'vitest';
import { popoverRegistryItem } from './popover.registry';

describe('popover registry item', () => {
  it('contains expected metadata', () => {
    expect(popoverRegistryItem.name).toBe('popover');
    expect(popoverRegistryItem.dependencies).toEqual([]);
    expect(popoverRegistryItem.files).toHaveLength(5);
  });

  it('generates local popover source files', () => {
    const popoverFile = popoverRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/popover/tng-popover.ts'),
    );
    expect(popoverFile).toBeDefined();
    expect(popoverFile?.content).toContain("selector: 'tng-popover'");
    expect(popoverFile?.content).toContain("from './tng-popover-primitive';");
    expect(popoverFile?.content).toContain('closeOnFocusOutside');
    expect(popoverFile?.content).toContain("this.requestClose('focus-outside')");
    expect(popoverFile?.content).not.toContain('@tailng-ui/cdk');

    const primitiveFile = popoverRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/popover/tng-popover-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain('createPopoverId');
    expect(primitiveFile?.content).toContain("| 'focus-outside'");

    const indexFile = popoverRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/popover/index.ts'),
    );
    expect(indexFile).toBeDefined();
    expect(indexFile?.content).toContain("export * from './tng-popover';");
  });
});
