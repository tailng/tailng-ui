import { describe, expect, it } from 'vitest';
import { progressBarRegistryItem } from './progress-bar.registry';

describe('progress-bar registry item', () => {
  it('contains expected metadata', () => {
    expect(progressBarRegistryItem.name).toBe('progress-bar');
    expect(progressBarRegistryItem.dependencies).toEqual([]);
    expect(progressBarRegistryItem.files).toHaveLength(5);
  });

  it('generates local progress bar source files', () => {
    const componentFile = progressBarRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/progress-bar/tng-progress-bar.ts'),
    );
    expect(componentFile?.content).toContain('export class TngProgressBar');
    expect(componentFile?.content).toContain('toTngProgressBarPercent');
    expect(componentFile?.content).toContain('ariaLabelledby');

    const primitiveFile = progressBarRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/progress-bar/tng-progress-bar-primitive.ts'),
    );
    expect(primitiveFile?.content).toContain('export class TngProgressBarPrimitive');
    expect(primitiveFile?.content).toContain('readonly percent = computed');
    expect(primitiveFile?.content).toContain("HostBinding('attr.data-state')");

    const cssFile = progressBarRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/progress-bar/tng-progress-bar.css'),
    );
    expect(cssFile?.content).toContain('@media (prefers-reduced-motion: reduce)');
    expect(cssFile?.content).toContain('--tng-progress-bar-track');
    expect(cssFile?.content).toContain(
      'border-radius: var(--tng-progress-bar-radius, var(--tng-radius-control, 0.5rem));',
    );
    expect(cssFile?.content).not.toContain('var(--tng-progress-bar-radius, 9999px)');

    const indexFile = progressBarRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/progress-bar/index.ts'),
    );
    expect(indexFile?.content).toContain("export * from './tng-progress-bar';");
    expect(indexFile?.content).toContain("export * from './tng-progress-bar-primitive';");
  });
});
