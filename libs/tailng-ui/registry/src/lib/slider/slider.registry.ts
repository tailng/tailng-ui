import type { RegistryItemSource } from '../registry.types';

const sliderPrimitiveTsTemplate = `import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

function normalizeFiniteNumber(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

export function normalizeTngSliderMin(value: number): number {
  return normalizeFiniteNumber(value, 0);
}

export function normalizeTngSliderMax(value: number): number {
  return normalizeFiniteNumber(value, 100);
}

export function normalizeTngSliderStep(value: number): number {
  const normalized = normalizeFiniteNumber(value, 1);
  return normalized > 0 ? normalized : 1;
}

@Directive({
  selector: 'input[tngSlider]',
  exportAs: 'tngSlider',
})
export class TngSliderPrimitive {
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly max = input<number, number | string>(100, {
    transform: (value: number | string): number =>
      normalizeTngSliderMax(typeof value === 'number' ? value : Number(value)),
  });
  public readonly min = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      normalizeTngSliderMin(typeof value === 'number' ? value : Number(value)),
  });
  public readonly step = input<number, number | string>(1, {
    transform: (value: number | string): number =>
      normalizeTngSliderStep(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      typeof value === 'number' ? value : Number(value),
  });

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'slider' as const;

  @HostBinding('attr.disabled')
  protected get disabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostBinding('attr.max')
  protected get maxAttr(): string {
    return String(this.max());
  }

  @HostBinding('attr.min')
  protected get minAttr(): string {
    return String(this.min());
  }

  @HostBinding('attr.step')
  protected get stepAttr(): string {
    return String(this.step());
  }

  @HostBinding('attr.type')
  protected readonly typeAttr = 'range' as const;

  @HostBinding('attr.value')
  protected get valueAttr(): string {
    return String(this.value());
  }
}
`;

const sliderComponentTsTemplate = `import { booleanAttribute, Component, input, output } from '@angular/core';
import {
  normalizeTngSliderMax,
  normalizeTngSliderMin,
  normalizeTngSliderStep,
  TngSliderPrimitive,
} from './tng-slider-primitive';

export function readTngSliderEventValue(event: unknown): number | null {
  if (!(event instanceof Event)) {
    return null;
  }

  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return null;
  }

  return Number(target.value);
}

@Component({
  selector: 'tng-slider',
  imports: [TngSliderPrimitive],
  templateUrl: './tng-slider.html',
  styleUrl: './tng-slider.css',
})
export class TngSlider {
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly max = input<number, number | string>(100, {
    transform: (value: number | string): number =>
      normalizeTngSliderMax(typeof value === 'number' ? value : Number(value)),
  });
  public readonly min = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      normalizeTngSliderMin(typeof value === 'number' ? value : Number(value)),
  });
  public readonly step = input<number, number | string>(1, {
    transform: (value: number | string): number =>
      normalizeTngSliderStep(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      typeof value === 'number' ? value : Number(value),
  });

  public readonly valueChange = output<number>();

  public onInput(event: unknown): void {
    const nextValue = readTngSliderEventValue(event);
    if (nextValue === null) {
      return;
    }

    this.valueChange.emit(nextValue);
  }
}
`;

const sliderTemplateHtml = `<div class="tng-slider-root" [attr.data-disabled]="disabled() ? '' : null">
  <input
    tngSlider
    class="tng-slider-control"
    [disabled]="disabled()"
    [max]="max()"
    [min]="min()"
    [step]="step()"
    [value]="value()"
    (input)="onInput($event)"
  />
</div>
`;

const sliderTemplateCss = `:host {
  display: block;
  width: 100%;
}

.tng-slider-root {
  display: flex;
  width: 100%;
}

.tng-slider-control {
  accent-color: var(--tng-semantic-accent-brand, #2563eb);
  width: 100%;
}

.tng-slider-root[data-disabled] {
  cursor: not-allowed;
  opacity: 0.65;
}
`;

const sliderIndexTsTemplate = `export * from './tng-slider';
export * from './tng-slider-primitive';
`;

export const sliderRegistryItem: RegistryItemSource = {
  dependencies: [],
  description: 'Shadcn-style source files for a single-value slider component.',
  files: [
    {
      content: sliderPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/slider/tng-slider-primitive.ts',
    },
    {
      content: sliderComponentTsTemplate,
      path: 'src/app/tailng-ui/slider/tng-slider.ts',
    },
    {
      content: sliderTemplateHtml,
      path: 'src/app/tailng-ui/slider/tng-slider.html',
    },
    {
      content: sliderTemplateCss,
      path: 'src/app/tailng-ui/slider/tng-slider.css',
    },
    {
      content: sliderIndexTsTemplate,
      path: 'src/app/tailng-ui/slider/index.ts',
    },
  ],
  name: 'slider',
};
