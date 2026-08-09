import {
  Component,
  ContentChild,
  TemplateRef,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import {
  TngSelect,
  TngSelectTrigger,
  TngSelectValue,
  TngSelectIcon,
  TngSelectContent,
  TngSelectOverlay,
  TngSelectListbox,
  TngSelectOption,
} from '@tailng-ui/primitives';
import type { TngOverlayScrollStrategy } from '@tailng-ui/cdk';

export type TngSelectGetValue<O, V> = (opt: O) => V;
export type TngSelectGetLabel<O> = (opt: O) => string;
export type TngSelectIsDisabled<O> = (opt: O) => boolean;
export type TngSelectTrackBy<O> = (index: number, opt: O) => unknown;

function defaultGetOptionValue(opt: unknown): unknown {
  return opt !== null && typeof opt === 'object' && 'value' in opt ? opt.value : opt;
}

// Slot templates (optional)
export type TngSelectValueContext<O, V> = {
  $implicit: { value: V | readonly V[] | null; option: O | null; label: string };
};
export type TngSelectOptionContext<O, V> = {
  $implicit: {
    option: O;
    value: V;
    label: string;
    disabled: boolean;
    selected: boolean;
    active: boolean;
  };
};

@Component({
  selector: 'tng-select',
  imports: [
    NgTemplateOutlet,
    // primitives used in template
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
  ],
  // Attach primitive directive to host + re-expose its controlled API.
  hostDirectives: [
    {
      directive: TngSelect,
      inputs: [
        'open',
        'value',
        'disabled',
        'loading',
        'invalid',
        'labelId',
        'descriptionId',
        'errorId',
      ],
      outputs: ['openChange', 'valueChange'],
    },
  ],
  templateUrl: './tng-select.component.html',
  styleUrl: './tng-select.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TngSelectComponent<O = unknown, V = unknown> {
  // Access primitive instance for reading value/open state inside template.
  // (This works because the primitive is attached via hostDirectives.)
  protected readonly primitive = inject<TngSelect<V>>(TngSelect);

  // ----- data / accessors (recommended API) -----
  readonly options = input<readonly O[]>([]);
  readonly placeholder = input<string>('Select…');
  readonly scrollStrategy = input<TngOverlayScrollStrategy>('block');

  readonly getOptionValue = input<TngSelectGetValue<O, V>>(
    defaultGetOptionValue as TngSelectGetValue<O, V>,
  );
  readonly getOptionLabel = input<TngSelectGetLabel<O>>(((opt: any) =>
    String(opt?.label ?? opt?.value ?? opt)) as TngSelectGetLabel<O>);
  readonly isOptionDisabled = input<TngSelectIsDisabled<O>>(
    ((opt: any) => !!opt?.disabled) as TngSelectIsDisabled<O>,
  );
  /**
   * Optional identity for `@for`. When omitted, defaults to `getOptionValue(opt)`
   * so mapped option objects can be recreated each CD without remounting rows.
   */
  readonly trackBy = input<TngSelectTrackBy<O> | undefined>(undefined);

  // ----- optional: icon text/slot (still headless) -----
  readonly iconText = input<string>('▾');

  // ----- slots (optional) -----
  @ContentChild('tngSelectValueTpl', { read: TemplateRef }) valueTpl?: TemplateRef<
    TngSelectValueContext<O, V>
  >;
  @ContentChild('tngSelectOptionTpl', { read: TemplateRef }) optionTpl?: TemplateRef<
    TngSelectOptionContext<O, V>
  >;

  // ----- derived state for default rendering -----
  protected readonly selectedOption = computed<O | null>(() => {
    const v = this.primitive.value();
    if (v === null) return null;

    const getV = this.getOptionValue();
    for (const opt of this.options()) {
      if (Object.is(getV(opt), v)) return opt;
    }
    return null;
  });

  protected readonly selectedLabel = computed<string>(() => {
    const opt = this.selectedOption();
    return opt ? this.getOptionLabel()(opt) : this.placeholder();
  });

  protected trackOption(index: number, opt: O): unknown {
    const trackBy = this.trackBy();
    if (trackBy) {
      return trackBy(index, opt);
    }
    return this.getOptionValue()(opt);
  }

  // Context helpers for templates
  protected valueContext(): TngSelectValueContext<O, V> {
    const v = this.primitive.value();
    const opt = this.selectedOption();
    const label = opt ? this.getOptionLabel()(opt) : this.placeholder();
    return { $implicit: { value: v, option: opt, label } };
  }

  protected optionContext(opt: O): TngSelectOptionContext<O, V> {
    const v = this.getOptionValue()(opt);
    const label = this.getOptionLabel()(opt);
    const disabled = this.isOptionDisabled()(opt);
    const selected = Object.is(this.primitive.value(), v);

    // “active” styling is handled by listbox primitive via data-active on the element,
    // but we include it in case the consumer’s template wants it.
    // (We can’t reliably compute active here without reading listbox controller state.)
    const active = false;

    return { $implicit: { option: opt, value: v, label, disabled, selected, active } };
  }
}
