import { describe, expect, it } from 'vitest';
import { rangeSliderRegistryItem } from './range-slider.registry';

describe('range-slider registry item', () => {
  it('contains expected metadata', () => {
    expect(rangeSliderRegistryItem.name).toBe('range-slider');
    expect(rangeSliderRegistryItem.dependencies).toEqual([]);
    expect(rangeSliderRegistryItem.files).toHaveLength(4);
  });

  it('generates self-contained range-slider source files', () => {
    const componentFile = rangeSliderRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/range-slider/tng-range-slider.ts'),
    );

    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-range-slider'");
    expect(componentFile?.content).toContain('lowerBound');
    expect(componentFile?.content).toContain('upperBound');
    expect(componentFile?.content).toContain('minGap');
    expect(componentFile?.content).not.toContain("from './tng-slider-primitive'");
  });
});
