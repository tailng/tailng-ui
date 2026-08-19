import type { RegistryItem } from '../registry.types';

const progressSpinnerPrimitiveTsTemplate = `import { booleanAttribute, Directive, HostBinding, input } from '@angular/core';

function normalizeFiniteNumber(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

export function normalizeTngProgressSpinnerMin(value: number): number {
  return normalizeFiniteNumber(value, 0);
}

export function normalizeTngProgressSpinnerMax(value: number): number {
  return normalizeFiniteNumber(value, 100);
}

export function resolveTngProgressSpinnerRange(
  min: number,
  max: number,
  value: number,
): Readonly<{
  max: number;
  min: number;
  value: number;
}> {
  const resolvedMin = normalizeTngProgressSpinnerMin(min);
  const resolvedMax = Math.max(normalizeTngProgressSpinnerMax(max), resolvedMin);
  const normalizedValue = normalizeFiniteNumber(value, resolvedMin);
  const resolvedValue = Math.min(Math.max(normalizedValue, resolvedMin), resolvedMax);

  return Object.freeze({
    max: resolvedMax,
    min: resolvedMin,
    value: resolvedValue,
  });
}

@Directive({
  selector: '[tngProgressSpinner]',
  exportAs: 'tngProgressSpinner',
})
export class TngProgressSpinnerPrimitive {
  public readonly indeterminate = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly max = input<number, number | string>(100, {
    transform: (value: number | string): number =>
      normalizeTngProgressSpinnerMax(typeof value === 'number' ? value : Number(value)),
  });
  public readonly min = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      normalizeTngProgressSpinnerMin(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      typeof value === 'number' ? value : Number(value),
  });

  @HostBinding('attr.aria-valuemax')
  protected get ariaValueMaxAttr(): string | null {
    if (this.indeterminate()) {
      return null;
    }

    return String(this.range.max);
  }

  @HostBinding('attr.aria-valuemin')
  protected get ariaValueMinAttr(): string | null {
    if (this.indeterminate()) {
      return null;
    }

    return String(this.range.min);
  }

  @HostBinding('attr.aria-valuenow')
  protected get ariaValueNowAttr(): string | null {
    if (this.indeterminate()) {
      return null;
    }

    return String(this.range.value);
  }

  @HostBinding('attr.data-indeterminate')
  protected get dataIndeterminateAttr(): '' | null {
    return this.indeterminate() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'progress-spinner' as const;

  @HostBinding('attr.role')
  protected readonly roleAttr = 'progressbar' as const;

  private get range(): Readonly<{
    max: number;
    min: number;
    value: number;
  }> {
    return resolveTngProgressSpinnerRange(this.min(), this.max(), this.value());
  }
}
`;

const progressSpinnerComponentTsTemplate = `import { booleanAttribute, Component, computed, input } from '@angular/core';
import {
  normalizeTngProgressSpinnerMax,
  normalizeTngProgressSpinnerMin,
  resolveTngProgressSpinnerRange,
  TngProgressSpinnerPrimitive,
} from './tng-progress-spinner-primitive';

const spinnerRadius = 18;
const spinnerCircumference = 2 * Math.PI * spinnerRadius;

function normalizePositiveNumber(value: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return value > 0 ? value : fallback;
}

export function toTngProgressSpinnerPercent(min: number, max: number, value: number): number {
  const range = resolveTngProgressSpinnerRange(min, max, value);
  const denominator = range.max - range.min;
  if (denominator <= 0) {
    return 100;
  }

  return ((range.value - range.min) / denominator) * 100;
}

export function toTngProgressSpinnerDashOffset(percent: number): number {
  return spinnerCircumference - (spinnerCircumference * percent) / 100;
}

@Component({
  selector: 'tng-progress-spinner',
  imports: [TngProgressSpinnerPrimitive],
  templateUrl: './tng-progress-spinner.html',
  styleUrl: './tng-progress-spinner.css',
})
export class TngProgressSpinner {
  public readonly ariaLabel = input<string | null>(null);
  public readonly indeterminate = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly max = input<number, number | string>(100, {
    transform: (value: number | string): number =>
      normalizeTngProgressSpinnerMax(typeof value === 'number' ? value : Number(value)),
  });
  public readonly min = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      normalizeTngProgressSpinnerMin(typeof value === 'number' ? value : Number(value)),
  });
  public readonly size = input<number, number | string>(40, {
    transform: (value: number | string): number =>
      normalizePositiveNumber(typeof value === 'number' ? value : Number(value), 40),
  });
  public readonly strokeWidth = input<number, number | string>(4, {
    transform: (value: number | string): number =>
      normalizePositiveNumber(typeof value === 'number' ? value : Number(value), 4),
  });
  public readonly value = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      typeof value === 'number' ? value : Number(value),
  });

  protected readonly circumference = spinnerCircumference;
  protected readonly dashOffset = computed<number>(() =>
    toTngProgressSpinnerDashOffset(
      toTngProgressSpinnerPercent(this.min(), this.max(), this.value()),
    ),
  );
}
`;

const progressSpinnerTemplateHtml = `<span
  tngProgressSpinner
  class="tng-progress-spinner"
  [attr.aria-label]="ariaLabel()"
  [indeterminate]="indeterminate()"
  [max]="max()"
  [min]="min()"
  [style.--tng-progress-spinner-size.px]="size()"
  [style.--tng-progress-spinner-stroke-width.px]="strokeWidth()"
  [value]="value()"
>
  <svg class="tng-progress-spinner-svg" viewBox="0 0 40 40">
    <circle class="tng-progress-spinner-track" cx="20" cy="20" r="18"></circle>
    <circle
      class="tng-progress-spinner-indicator"
      [attr.data-indeterminate]="indeterminate() ? '' : null"
      [attr.stroke-dasharray]="circumference"
      [attr.stroke-dashoffset]="indeterminate() ? null : dashOffset()"
      cx="20"
      cy="20"
      r="18"
    ></circle>
  </svg>
</span>
`;

const progressSpinnerTemplateCss = `:host {
  display: inline-flex;
}

.tng-progress-spinner {
  display: inline-flex;
  height: var(--tng-progress-spinner-size, 40px);
  width: var(--tng-progress-spinner-size, 40px);
}

.tng-progress-spinner-svg {
  display: block;
  height: 100%;
  width: 100%;
}

.tng-progress-spinner-track,
.tng-progress-spinner-indicator {
  fill: none;
  stroke-linecap: round;
  stroke-width: var(--tng-progress-spinner-stroke-width, 4px);
}

.tng-progress-spinner-track {
  stroke: var(--tng-semantic-background-surface, #e2e8f0);
}

.tng-progress-spinner-indicator {
  stroke: var(--tng-semantic-accent-brand, #2563eb);
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 180ms ease;
}

.tng-progress-spinner-indicator[data-indeterminate] {
  animation: tng-progress-spinner-indeterminate 1s linear infinite;
  stroke-dasharray: 70;
  stroke-dashoffset: 20;
}

@keyframes tng-progress-spinner-indeterminate {
  0% {
    transform: rotate(-90deg);
  }
  100% {
    transform: rotate(270deg);
  }
}
`;

const progressSpinnerIndexTsTemplate = `export * from './tng-progress-spinner';
export * from './tng-progress-spinner-primitive';
`;

export const progressSpinnerRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for progress spinner primitive and styled wrapper.',
  install: {
    importPath: './tailng-ui/progress-spinner',
    importSymbols: ['TngProgressSpinner', 'TngProgressSpinnerPrimitive'],
  },
  files: [
    {
      content: progressSpinnerPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/progress-spinner/tng-progress-spinner-primitive.ts',
    },
    {
      content: progressSpinnerComponentTsTemplate,
      path: 'src/app/tailng-ui/progress-spinner/tng-progress-spinner.ts',
    },
    {
      content: progressSpinnerTemplateHtml,
      path: 'src/app/tailng-ui/progress-spinner/tng-progress-spinner.html',
    },
    {
      content: progressSpinnerTemplateCss,
      path: 'src/app/tailng-ui/progress-spinner/tng-progress-spinner.css',
    },
    {
      content: progressSpinnerIndexTsTemplate,
      path: 'src/app/tailng-ui/progress-spinner/index.ts',
    },
  ],
  name: 'progress-spinner',
} satisfies RegistryItem;
