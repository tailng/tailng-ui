import { describe, expect, it } from 'vitest';
import { sliderRegistryItem } from './slider.registry';

describe('slider registry item', () => {
  it('contains expected metadata', () => {
    expect(sliderRegistryItem.name).toBe('slider');
    expect(sliderRegistryItem.dependencies).toEqual([]);
    expect(sliderRegistryItem.files).toHaveLength(8);
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

    const rangeComponentFile = sliderRegistryItem.files.find((file) =>
      file.path.endsWith('tailng-ui/slider/tng-range-slider.ts'),
    );
    expect(rangeComponentFile).toBeDefined();
    expect(rangeComponentFile?.content).toContain("selector: 'tng-range-slider'");
    expect(rangeComponentFile?.content).toContain('minGap');
  });
});
