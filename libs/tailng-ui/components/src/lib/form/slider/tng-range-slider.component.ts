import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { booleanAttribute } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import {
  normalizeTngSliderMax,
  normalizeTngSliderMin,
  normalizeTngSliderStep,
} from '@tailng-ui/primitives';

import {
  TNG_FORM_FIELD_CONTROL,
  type TngFormFieldControl,
} from '../form-field/tng-form-field.control';
import {
  normalizeTngRangeSliderGap,
  normalizeTngRangeSliderValue,
  snapTngSliderValue,
  tngSliderValuePercent,
  type TngRangeSliderThumb,
  type TngRangeSliderValue,
} from './tng-slider.utils';

let nextRangeSliderId = 0;

function createRangeSliderId(): string {
  nextRangeSliderId += 1;
  return `tng-range-slider-${nextRangeSliderId}`;
}

function normalizeMinGap(value: number | string): number {
  const numericValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 0;
}

function joinIds(...groups: readonly (string | null | readonly string[])[]): string | null {
  const ids = new Set<string>();

  for (const group of groups) {
    const values = Array.isArray(group) ? group : [group];
    for (const value of values) {
      if (typeof value !== 'string') continue;
      for (const id of value.split(/\s+/u)) {
        if (id.length > 0) ids.add(id);
      }
    }
  }

  return ids.size > 0 ? Array.from(ids).join(' ') : null;
}

@Component({
  selector: 'tng-range-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tng-range-slider.component.html',
  styleUrl: './tng-range-slider.component.css',
  providers: [
    {
      provide: TNG_FORM_FIELD_CONTROL,
      useFactory: (component: TngRangeSliderComponent) => component.formFieldControl,
      deps: [forwardRef(() => TngRangeSliderComponent)],
    },
  ],
})
export class TngRangeSliderComponent implements FormValueControl<TngRangeSliderValue> {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly fallbackId = createRangeSliderId();
  private readonly rootRef = viewChild<ElementRef<HTMLElement>>('root');
  private readonly trackRef = viewChild<ElementRef<HTMLElement>>('track');
  private readonly formFieldDescribedByIds = signal<readonly string[]>([]);
  private readonly formFieldLabelId = signal<string | null>(null);
  private readonly formFieldInvalid = signal(false);
  private readonly formFieldRequired = signal(false);
  private readonly focused = signal(false);
  protected readonly activeThumb = signal<TngRangeSliderThumb>('min');
  private activePointerId: number | null = null;

  public readonly id = input<string | null>(null);
  public readonly value = model<TngRangeSliderValue>({ min: 0, max: 100 });
  public readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly invalid = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly required = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly max = input<number | undefined, unknown>(100, {
    transform: (value: unknown): number =>
      normalizeTngSliderMax(typeof value === 'number' ? value : Number(value)),
  });
  public readonly min = input<number | undefined, unknown>(0, {
    transform: (value: unknown): number =>
      normalizeTngSliderMin(typeof value === 'number' ? value : Number(value)),
  });
  public readonly step = input<number, number | string>(1, {
    transform: (value: number | string): number =>
      normalizeTngSliderStep(typeof value === 'number' ? value : Number(value)),
  });
  public readonly minGap = input<number, number | string>(0, {
    transform: normalizeMinGap,
  });
  public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  public readonly ariaLabelledBy = input<string | null>(null, {
    alias: 'aria-labelledby',
  });
  public readonly ariaDescribedBy = input<string | null>(null, {
    alias: 'aria-describedby',
  });
  public readonly minAriaLabel = input<string>('Minimum value');
  public readonly maxAriaLabel = input<string>('Maximum value');
  public readonly minValueText = input<string | null>(null);
  public readonly maxValueText = input<string | null>(null);

  protected readonly resolvedId = computed(() => this.id()?.trim() || this.fallbackId);
  protected readonly minInputId = computed(() => `${this.resolvedId()}-min`);
  protected readonly maxInputId = computed(() => `${this.resolvedId()}-max`);
  protected readonly groupLabelId = computed(() => `${this.resolvedId()}-label`);
  protected readonly minThumbLabelId = computed(() => `${this.resolvedId()}-min-label`);
  protected readonly maxThumbLabelId = computed(() => `${this.resolvedId()}-max-label`);
  protected readonly lowerBound = computed(() => Math.min(this.min() ?? 0, this.max() ?? 100));
  protected readonly upperBound = computed(() => Math.max(this.min() ?? 0, this.max() ?? 100));
  protected readonly effectiveGap = computed(() =>
    normalizeTngRangeSliderGap(this.minGap(), this.lowerBound(), this.upperBound(), this.step()),
  );
  protected readonly currentValue = computed(() =>
    normalizeTngRangeSliderValue(
      this.value(),
      this.lowerBound(),
      this.upperBound(),
      this.step(),
      this.effectiveGap(),
    ),
  );
  protected readonly minPercent = computed(
    () =>
      `${tngSliderValuePercent(this.currentValue().min, this.lowerBound(), this.upperBound())}%`,
  );
  protected readonly maxPercent = computed(
    () =>
      `${tngSliderValuePercent(this.currentValue().max, this.lowerBound(), this.upperBound())}%`,
  );
  protected readonly minInputMax = computed(() => this.currentValue().max - this.effectiveGap());
  protected readonly maxInputMin = computed(() => this.currentValue().min + this.effectiveGap());
  protected readonly effectiveInvalid = computed(() => this.invalid() || this.formFieldInvalid());
  protected readonly effectiveRequired = computed(
    () => this.required() || this.formFieldRequired(),
  );
  protected readonly describedBy = computed(() =>
    joinIds(this.ariaDescribedBy(), this.formFieldDescribedByIds()),
  );
  protected readonly minLabelledBy = computed(() =>
    joinIds(
      this.formFieldLabelId(),
      this.ariaLabelledBy(),
      this.ariaLabel() === null ? null : this.groupLabelId(),
      this.minThumbLabelId(),
    ),
  );
  protected readonly maxLabelledBy = computed(() =>
    joinIds(
      this.formFieldLabelId(),
      this.ariaLabelledBy(),
      this.ariaLabel() === null ? null : this.groupLabelId(),
      this.maxThumbLabelId(),
    ),
  );

  public readonly formFieldControl: TngFormFieldControl = this.createFormFieldControl();

  public onThumbInput(thumb: TngRangeSliderThumb, event: Event): void {
    if (this.disabled() || !(event.target instanceof HTMLInputElement)) return;
    this.commitThumbValue(thumb, Number(event.target.value));
  }

  public onThumbPointerDown(thumb: TngRangeSliderThumb): void {
    if (!this.disabled()) this.activeThumb.set(thumb);
  }

  public onTrackPointerDown(event: PointerEvent): void {
    if (this.disabled() || event.button !== 0 || event.target instanceof HTMLInputElement) {
      return;
    }

    const root = this.rootRef()?.nativeElement;
    if (root === undefined) return;

    event.preventDefault();
    this.activePointerId = event.pointerId;
    if (typeof root.setPointerCapture === 'function') {
      root.setPointerCapture(event.pointerId);
    }

    const pointerValue = this.valueFromPointer(event);
    const value = this.currentValue();
    const minDistance = Math.abs(pointerValue - value.min);
    const maxDistance = Math.abs(pointerValue - value.max);
    const thumb: TngRangeSliderThumb =
      minDistance === maxDistance ? this.activeThumb() : minDistance < maxDistance ? 'min' : 'max';
    this.activeThumb.set(thumb);
    this.commitThumbValue(thumb, pointerValue);
    this.focusThumb(thumb);
  }

  public onTrackPointerMove(event: PointerEvent): void {
    if (this.activePointerId !== event.pointerId || this.disabled()) return;
    event.preventDefault();
    this.commitThumbValue(this.activeThumb(), this.valueFromPointer(event));
  }

  public onTrackPointerEnd(event: PointerEvent): void {
    if (this.activePointerId !== event.pointerId) return;
    const root = this.rootRef()?.nativeElement;
    if (
      root !== undefined &&
      typeof root.hasPointerCapture === 'function' &&
      root.hasPointerCapture(event.pointerId)
    ) {
      root.releasePointerCapture(event.pointerId);
    }
    this.activePointerId = null;
  }

  public onFocusIn(): void {
    this.focused.set(true);
  }

  public onFocusOut(event: FocusEvent): void {
    if (event.relatedTarget instanceof Node && this.hostElement.contains(event.relatedTarget)) {
      return;
    }
    this.focused.set(false);
  }

  private commitThumbValue(thumb: TngRangeSliderThumb, rawValue: number): void {
    const value = this.currentValue();
    const gap = this.effectiveGap();
    let next: TngRangeSliderValue;

    if (thumb === 'min') {
      const maximum = value.max - gap;
      next = {
        min: snapTngSliderValue(rawValue, this.lowerBound(), maximum, this.step()),
        max: value.max,
      };
    } else {
      const minimum = value.min + gap;
      next = {
        min: value.min,
        max: snapTngSliderValue(rawValue, minimum, this.upperBound(), this.step()),
      };
    }

    this.activeThumb.set(thumb);
    this.value.set(next);
  }

  private valueFromPointer(event: PointerEvent): number {
    const track = this.trackRef()?.nativeElement;
    if (track === undefined) return this.currentValue()[this.activeThumb()];

    const rect = track.getBoundingClientRect();
    if (rect.width <= 0) return this.currentValue()[this.activeThumb()];

    let ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    if (this.resolveDirection() === 'rtl') ratio = 1 - ratio;
    return this.lowerBound() + ratio * (this.upperBound() - this.lowerBound());
  }

  private resolveDirection(): 'ltr' | 'rtl' {
    const direction =
      this.hostElement.ownerDocument.defaultView?.getComputedStyle(this.hostElement).direction ??
      this.hostElement.closest('[dir]')?.getAttribute('dir') ??
      'ltr';
    return direction.toLowerCase() === 'rtl' ? 'rtl' : 'ltr';
  }

  private focusThumb(thumb: TngRangeSliderThumb): void {
    const selector = thumb === 'min' ? `#${this.minInputId()}` : `#${this.maxInputId()}`;
    this.hostElement.querySelector<HTMLElement>(selector)?.focus();
  }

  private createFormFieldControl(): TngFormFieldControl {
    const component = this;
    const minInput = (): HTMLInputElement | null =>
      component.hostElement.querySelector<HTMLInputElement>('.tng-range-slider-input--min');

    return {
      controlKind: 'composite',
      get id(): string | null {
        return minInput()?.id ?? null;
      },
      get disabled(): boolean {
        return component.disabled();
      },
      get focused(): boolean {
        return component.focused();
      },
      get invalid(): boolean {
        return component.effectiveInvalid();
      },
      get required(): boolean {
        return component.effectiveRequired();
      },
      get focusableElement(): HTMLElement | null {
        return minInput();
      },
      setDescribedByIds(ids: readonly string[]): void {
        component.formFieldDescribedByIds.set(ids);
      },
      setLabelledById(id: string | null): void {
        component.formFieldLabelId.set(id);
      },
      setAriaInvalid(invalid: boolean): void {
        component.formFieldInvalid.set(invalid);
      },
      setAriaRequired(required: boolean): void {
        component.formFieldRequired.set(required);
      },
    };
  }
}
