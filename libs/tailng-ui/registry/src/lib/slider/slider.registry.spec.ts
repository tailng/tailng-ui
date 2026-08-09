import { describe, expect, it } from 'vitest';
import { sliderRegistryItem } from './slider.registry';

describe('slider registry item', () => {
  it('contains expected metadata', () => {
    expect(sliderRegistryItem.name).toBe('slider');
    expect(sliderRegistryItem.dependencies).toEqual([]);
    expect(sliderRegistryItem.files).toHaveLength(5);
  });

  it('generates local slider source files', () => {
    const componentFile = sliderRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/slider/tng-slider.ts'),
    );
    expect(componentFile).toBeDefined();
    expect(componentFile?.content).toContain("selector: 'tng-slider'");

    const primitiveFile = sliderRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/slider/tng-slider-primitive.ts'),
    );
    expect(primitiveFile).toBeDefined();
    expect(primitiveFile?.content).toContain("selector: 'input[tngSlider]'");

    expect(sliderRegistryItem.files.some((file) => file.path.includes('tng-range-slider'))).toBe(
      false,
    );
  });
});
