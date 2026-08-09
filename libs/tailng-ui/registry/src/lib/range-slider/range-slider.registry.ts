import type { RegistryItemSource } from '../registry.types';

const rangeSliderComponentTsTemplate = `import { booleanAttribute, Component, computed, input, output } from '@angular/core';

export type TngRangeSliderValue = Readonly<{
  min: number;
  max: number;
}>;

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function normalizeOptionalBound(value: number | string | undefined): number | undefined {
  if (value === undefined || value === '') return undefined;
  const numericValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}

function normalizeStep(value: number | string): number {
  const numericValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 1;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, finiteOr(value, min)));
}

function snap(value: number, min: number, max: number, step: number): number {
  const stepped = min + Math.round((clamp(value, min, max) - min) / step) * step;
  return clamp(Number(stepped.toFixed(12)), min, max);
}

@Component({
  selector: 'tng-range-slider',
  templateUrl: './tng-range-slider.html',
  styleUrl: './tng-range-slider.css',
})
export class TngRangeSlider {
  public readonly value = input<TngRangeSliderValue>({ min: 0, max: 100 });
  public readonly valueChange = output<TngRangeSliderValue>();
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly lowerBound = input<number | undefined, number | string | undefined>(undefined, {
    transform: normalizeOptionalBound,
  });
  public readonly upperBound = input<number | undefined, number | string | undefined>(undefined, {
    transform: normalizeOptionalBound,
  });
  /** @deprecated Use lowerBound. The min binding conflicts with Signal Forms formField. */
  public readonly min = input<number | undefined, number | string | undefined>(undefined, {
    transform: normalizeOptionalBound,
  });
  /** @deprecated Use upperBound. The max binding conflicts with Signal Forms formField. */
  public readonly max = input<number | undefined, number | string | undefined>(undefined, {
    transform: normalizeOptionalBound,
  });
  public readonly step = input<number, number | string>(1, { transform: normalizeStep });
  public readonly minGap = input<number, number | string>(0, {
    transform: (value: number | string): number => {
      const numericValue = typeof value === 'number' ? value : Number(value);
      return Number.isFinite(numericValue) ? Math.max(0, numericValue) : 0;
    },
  });
  public readonly minAriaLabel = input('Minimum value');
  public readonly maxAriaLabel = input('Maximum value');

  protected readonly minimum = computed(() =>
    Math.min(this.lowerBound() ?? this.min() ?? 0, this.upperBound() ?? this.max() ?? 100),
  );
  protected readonly maximum = computed(() =>
    Math.max(this.lowerBound() ?? this.min() ?? 0, this.upperBound() ?? this.max() ?? 100),
  );
  protected readonly gap = computed(() =>
    Math.min(
      this.maximum() - this.minimum(),
      Math.ceil(this.minGap() / this.step()) * this.step(),
    ),
  );
  protected readonly currentValue = computed<TngRangeSliderValue>(() => {
    const first = snap(this.value().min, this.minimum(), this.maximum(), this.step());
    const second = snap(this.value().max, this.minimum(), this.maximum(), this.step());
    let min = Math.min(first, second);
    let max = Math.max(first, second);
    if (max - min < this.gap()) {
      max = Math.min(this.maximum(), min + this.gap());
      min = Math.max(this.minimum(), max - this.gap());
    }
    return { min, max };
  });
  protected readonly minPercent = computed(() => {
    const span = this.maximum() - this.minimum();
    return String(span > 0 ? ((this.currentValue().min - this.minimum()) / span) * 100 : 0) + '%';
  });
  protected readonly maxPercent = computed(() => {
    const span = this.maximum() - this.minimum();
    return String(span > 0 ? ((this.currentValue().max - this.minimum()) / span) * 100 : 0) + '%';
  });

  public onInput(thumb: 'min' | 'max', event: Event): void {
    if (this.disabled() || !(event.target instanceof HTMLInputElement)) return;
    const current = this.currentValue();
    const rawValue = Number(event.target.value);
    const value =
      thumb === 'min'
        ? {
            min: snap(rawValue, this.minimum(), current.max - this.gap(), this.step()),
            max: current.max,
          }
        : {
            min: current.min,
            max: snap(rawValue, current.min + this.gap(), this.maximum(), this.step()),
          };
    this.valueChange.emit(value);
  }
}
`;

const rangeSliderTemplateHtml = `<div
  class="tng-range-slider-root"
  data-slot="range-slider"
  [attr.data-disabled]="disabled() ? '' : null"
  [style.--tng-slider-range-start]="minPercent()"
  [style.--tng-slider-range-end]="maxPercent()"
>
  <div class="tng-range-slider-track" data-slot="range-slider-track" aria-hidden="true">
    <div class="tng-range-slider-fill" data-slot="range-slider-fill"></div>
  </div>
  <input
    class="tng-range-slider-input"
    data-slot="range-slider-min-thumb"
    type="range"
    [disabled]="disabled()"
    [min]="minimum()"
    [max]="currentValue().max - gap()"
    [step]="step()"
    [value]="currentValue().min"
    [attr.aria-label]="minAriaLabel()"
    (input)="onInput('min', $event)"
  />
  <input
    class="tng-range-slider-input"
    data-slot="range-slider-max-thumb"
    type="range"
    [disabled]="disabled()"
    [min]="currentValue().min + gap()"
    [max]="maximum()"
    [step]="step()"
    [value]="currentValue().max"
    [attr.aria-label]="maxAriaLabel()"
    (input)="onInput('max', $event)"
  />
</div>
`;

const rangeSliderTemplateCss = `:host {
  display: block;
  width: 100%;
  --_track: var(--tng-slider-track-color, #d1d5db);
  --_range: var(--tng-slider-range-color, #2563eb);
  --_thumb: var(--tng-slider-thumb-color, #fff);
  --_thumb-border: var(--tng-slider-thumb-border-color, #2563eb);
  --_track-size: var(--tng-slider-track-size, 0.375rem);
  --_thumb-size: var(--tng-slider-thumb-size, 1.125rem);
}

.tng-range-slider-root {
  min-height: max(2rem, var(--_thumb-size));
  position: relative;
  width: 100%;
}

.tng-range-slider-track {
  background: var(--_track);
  border-radius: 999px;
  height: var(--_track-size);
  inset-inline: calc(var(--_thumb-size) / 2);
  inset-block-start: calc(50% - var(--_track-size) / 2);
  overflow: hidden;
  position: absolute;
}

.tng-range-slider-fill {
  background: var(--_range);
  height: 100%;
  inset-inline-start: var(--tng-slider-range-start);
  position: absolute;
  width: calc(var(--tng-slider-range-end) - var(--tng-slider-range-start));
}

.tng-range-slider-input {
  appearance: none;
  background: transparent;
  inset: 0;
  margin: 0;
  pointer-events: none;
  position: absolute;
  width: 100%;
}

.tng-range-slider-input::-webkit-slider-runnable-track,
.tng-range-slider-input::-moz-range-track {
  background: transparent;
  height: var(--_track-size);
}

.tng-range-slider-input::-webkit-slider-thumb {
  appearance: none;
  margin-top: calc((var(--_track-size) - var(--_thumb-size)) / 2);
}

.tng-range-slider-input::-webkit-slider-thumb,
.tng-range-slider-input::-moz-range-thumb {
  background: var(--_thumb);
  border: 2px solid var(--_thumb-border);
  border-radius: 50%;
  height: var(--_thumb-size);
  pointer-events: auto;
  width: var(--_thumb-size);
}

.tng-range-slider-root[data-disabled] {
  cursor: not-allowed;
  opacity: 0.55;
}
`;

const rangeSliderIndexTsTemplate = `export * from './tng-range-slider';
`;

export const rangeSliderRegistryItem: RegistryItemSource = {
  dependencies: [],
  description: 'Shadcn-style source files for a dual-thumb range slider component.',
  files: [
    {
      content: rangeSliderComponentTsTemplate,
      path: 'src/app/tailng-ui/range-slider/tng-range-slider.ts',
    },
    {
      content: rangeSliderTemplateHtml,
      path: 'src/app/tailng-ui/range-slider/tng-range-slider.html',
    },
    {
      content: rangeSliderTemplateCss,
      path: 'src/app/tailng-ui/range-slider/tng-range-slider.css',
    },
    {
      content: rangeSliderIndexTsTemplate,
      path: 'src/app/tailng-ui/range-slider/index.ts',
    },
  ],
  name: 'range-slider',
};
