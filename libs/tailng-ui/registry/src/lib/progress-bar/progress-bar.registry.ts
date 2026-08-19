import type { RegistryItem } from '../registry.types';

const progressBarPrimitiveTsTemplate = `import { booleanAttribute, computed, Directive, HostBinding, inject, input } from '@angular/core';

function normalizeFiniteNumber(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

export function normalizeTngProgressBarMin(value: number): number {
  return normalizeFiniteNumber(value, 0);
}

export function normalizeTngProgressBarMax(value: number): number {
  return normalizeFiniteNumber(value, 100);
}

export function resolveTngProgressBarRange(
  min: number,
  max: number,
  value: number,
): Readonly<{
  max: number;
  min: number;
  value: number;
}> {
  const resolvedMin = normalizeTngProgressBarMin(min);
  const resolvedMax = Math.max(normalizeTngProgressBarMax(max), resolvedMin);
  const normalizedValue = normalizeFiniteNumber(value, resolvedMin);
  const resolvedValue = Math.min(Math.max(normalizedValue, resolvedMin), resolvedMax);

  return Object.freeze({
    max: resolvedMax,
    min: resolvedMin,
    value: resolvedValue,
  });
}

@Directive({
  selector: '[tngProgressBar]',
  exportAs: 'tngProgressBar',
})
export class TngProgressBarPrimitive {
  public readonly ariaValueText = input<string | null>(null);
  public readonly indeterminate = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly max = input<number, number | string>(100, {
    transform: (value: number | string): number =>
      normalizeTngProgressBarMax(typeof value === 'number' ? value : Number(value)),
  });
  public readonly min = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      normalizeTngProgressBarMin(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      typeof value === 'number' ? value : Number(value),
  });

  public readonly range = computed(() =>
    resolveTngProgressBarRange(this.min(), this.max(), this.value()),
  );

  public readonly percent = computed(() => {
    const range = this.range();
    const denominator = range.max - range.min;
    return denominator <= 0 ? 100 : ((range.value - range.min) / denominator) * 100;
  });

  @HostBinding('attr.aria-valuemax')
  protected get ariaValueMaxAttr(): string | null {
    if (this.indeterminate()) {
      return null;
    }

    return String(this.range().max);
  }

  @HostBinding('attr.aria-valuemin')
  protected get ariaValueMinAttr(): string | null {
    if (this.indeterminate()) {
      return null;
    }

    return String(this.range().min);
  }

  @HostBinding('attr.aria-valuenow')
  protected get ariaValueNowAttr(): string | null {
    if (this.indeterminate()) {
      return null;
    }

    return String(this.range().value);
  }

  @HostBinding('attr.aria-valuetext')
  protected get ariaValueTextAttr(): string | null {
    return this.ariaValueText();
  }

  @HostBinding('attr.data-indeterminate')
  protected get dataIndeterminateAttr(): '' | null {
    return this.indeterminate() ? '' : null;
  }

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'determinate' | 'indeterminate' {
    return this.indeterminate() ? 'indeterminate' : 'determinate';
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'progress-bar' as const;

  @HostBinding('attr.role')
  protected readonly roleAttr = 'progressbar' as const;

}

@Directive({
  selector: '[tngProgressBarIndicator]',
  exportAs: 'tngProgressBarIndicator',
})
export class TngProgressBarIndicatorPrimitive {
  private readonly progressBar = inject(TngProgressBarPrimitive, {
    optional: true,
    skipSelf: true,
  });

  @HostBinding('attr.data-indeterminate')
  protected get dataIndeterminateAttr(): '' | null {
    return this.progressBar?.indeterminate() ? '' : null;
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'progress-bar-indicator' as const;

  @HostBinding('attr.data-state')
  protected get dataStateAttr(): 'determinate' | 'indeterminate' | null {
    if (this.progressBar === null) {
      return null;
    }

    return this.progressBar.indeterminate() ? 'indeterminate' : 'determinate';
  }
}
`;

const progressBarComponentTsTemplate = `import { booleanAttribute, Component, input } from '@angular/core';
import {
  normalizeTngProgressBarMax,
  normalizeTngProgressBarMin,
  resolveTngProgressBarRange,
  TngProgressBarIndicatorPrimitive,
  TngProgressBarPrimitive,
} from './tng-progress-bar-primitive';

export function toTngProgressBarPercent(min: number, max: number, value: number): number {
  const range = resolveTngProgressBarRange(min, max, value);
  const denominator = range.max - range.min;
  if (denominator <= 0) {
    return 100;
  }

  return ((range.value - range.min) / denominator) * 100;
}

@Component({
  selector: 'tng-progress-bar',
  imports: [TngProgressBarPrimitive, TngProgressBarIndicatorPrimitive],
  templateUrl: './tng-progress-bar.html',
  styleUrl: './tng-progress-bar.css',
})
export class TngProgressBar {
  public readonly ariaLabel = input<string | null>(null);
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly ariaValueText = input<string | null>(null);
  public readonly indeterminate = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly max = input<number, number | string>(100, {
    transform: (value: number | string): number =>
      normalizeTngProgressBarMax(typeof value === 'number' ? value : Number(value)),
  });
  public readonly min = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      normalizeTngProgressBarMin(typeof value === 'number' ? value : Number(value)),
  });
  public readonly value = input<number, number | string>(0, {
    transform: (value: number | string): number =>
      typeof value === 'number' ? value : Number(value),
  });

}
`;

const progressBarTemplateHtml = `<div
  tngProgressBar
  #progressBar="tngProgressBar"
  class="tng-progress-bar"
  [attr.aria-label]="ariaLabel()"
  [attr.aria-labelledby]="ariaLabelledby()"
  [ariaValueText]="ariaValueText()"
  [indeterminate]="indeterminate()"
  [max]="max()"
  [min]="min()"
  [value]="value()"
>
  <span
    tngProgressBarIndicator
    class="tng-progress-bar-indicator"
    [style.width.%]="indeterminate() ? 40 : progressBar.percent()"
  ></span>
</div>
`;

const progressBarTemplateCss = `:host {
  display: block;
  width: 100%;
}

.tng-progress-bar {
  background: var(
    --tng-progress-bar-track,
    var(--tng-semantic-background-muted, #e2e8f0)
  );
  border-radius: var(--tng-progress-bar-radius, 9999px);
  height: var(--tng-progress-bar-height, 0.625rem);
  overflow: hidden;
  position: relative;
  width: 100%;
}

.tng-progress-bar-indicator {
  background: var(
    --tng-progress-bar-indicator,
    var(--tng-semantic-accent-brand, #2563eb)
  );
  border-radius: inherit;
  display: block;
  height: 100%;
  transition: width var(--tng-progress-bar-transition-duration, 180ms) ease;
}

.tng-progress-bar-indicator[data-indeterminate] {
  animation: tng-progress-bar-indeterminate
    var(--tng-progress-bar-indeterminate-duration, 1.1s) ease-in-out infinite;
}

@keyframes tng-progress-bar-indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(250%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tng-progress-bar-indicator {
    transition: none;
  }

  .tng-progress-bar-indicator[data-indeterminate] {
    animation: none;
    transform: translateX(75%);
  }
}
`;

const progressBarIndexTsTemplate = `export * from './tng-progress-bar';
export * from './tng-progress-bar-primitive';
`;

export const progressBarRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for progress bar primitives and styled wrapper.',
  install: {
    importPath: './tailng-ui/progress-bar',
    importSymbols: [
      'TngProgressBar',
      'TngProgressBarPrimitive',
      'TngProgressBarIndicatorPrimitive',
    ],
  },
  files: [
    {
      content: progressBarPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/progress-bar/tng-progress-bar-primitive.ts',
    },
    {
      content: progressBarComponentTsTemplate,
      path: 'src/app/tailng-ui/progress-bar/tng-progress-bar.ts',
    },
    {
      content: progressBarTemplateHtml,
      path: 'src/app/tailng-ui/progress-bar/tng-progress-bar.html',
    },
    {
      content: progressBarTemplateCss,
      path: 'src/app/tailng-ui/progress-bar/tng-progress-bar.css',
    },
    {
      content: progressBarIndexTsTemplate,
      path: 'src/app/tailng-ui/progress-bar/index.ts',
    },
  ],
  name: 'progress-bar',
} satisfies RegistryItem;
