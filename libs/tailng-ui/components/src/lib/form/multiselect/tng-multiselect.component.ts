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
import type { TngOverlayScrollStrategy } from '@tailng-ui/cdk';

import {
  TngMultiSelect,
  TngSelectTrigger,
  TngSelectValue,
  TngSelectIcon,
  TngSelectContent,
  TngSelectOverlay,
  TngMultiSelectListbox,
  TngMultiSelectOption,
} from '@tailng-ui/primitives';

export type TngMultiSelectGetValue<O, V> = (opt: O) => V;
export type TngMultiSelectGetLabel<O> = (opt: O) => string;
export type TngMultiSelectIsDisabled<O> = (opt: O) => boolean;
export type TngMultiSelectTrackBy<O> = (index: number, opt: O) => unknown;

export type TngMultiSelectValueContext<O, V> = {
  $implicit: {
    value: readonly V[];
    options: readonly O[];
    label: string;
    removeItem: (item: V) => void;
  };
};
export type TngMultiSelectOptionContext<O, V> = {
  $implicit: { option: O; value: V; label: string; disabled: boolean; selected: boolean; active: boolean };
};

@Component({
  selector: 'tng-multiselect',
  imports: [
    NgTemplateOutlet,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngMultiSelectListbox,
    TngMultiSelectOption,
  ],
  hostDirectives: [
    {
      directive: TngMultiSelect,
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
  templateUrl: './tng-multiselect.component.html',
  styleUrl: './tng-multiselect.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TngMultiSelectComponent<O = unknown, V = unknown> {
  protected readonly primitive = inject<TngMultiSelect<V>>(TngMultiSelect);

  readonly options = input<readonly O[]>([]);
  readonly placeholder = input<string>('Select…');
  readonly scrollStrategy = input<TngOverlayScrollStrategy>('reposition');

  readonly getOptionValue = input<TngMultiSelectGetValue<O, V>>(
    ((opt: unknown) => (opt as { value?: V })?.value) as TngMultiSelectGetValue<O, V>,
  );
  readonly getOptionLabel = input<TngMultiSelectGetLabel<O>>(
    ((opt: unknown) => String((opt as { label?: string; value?: unknown })?.label ?? (opt as { value?: unknown })?.value ?? opt)) as TngMultiSelectGetLabel<O>,
  );
  readonly isOptionDisabled = input<TngMultiSelectIsDisabled<O>>(
    ((opt: unknown) => !!(opt as { disabled?: boolean })?.disabled) as TngMultiSelectIsDisabled<O>,
  );
  readonly trackBy = input<TngMultiSelectTrackBy<O>>((_, opt) => opt as unknown);

  readonly iconText = input<string>('▾');

  @ContentChild('tngMultiSelectValueTpl', { read: TemplateRef }) valueTpl?: TemplateRef<TngMultiSelectValueContext<O, V>>;
  @ContentChild('tngMultiSelectOptionTpl', { read: TemplateRef }) optionTpl?: TemplateRef<TngMultiSelectOptionContext<O, V>>;

  protected readonly selectedOptions = computed<readonly O[]>(() => {
    const v = this.primitive.value() ?? [];
    const getV = this.getOptionValue();
    const result: O[] = [];
    for (const opt of this.options()) {
      const optVal = getV(opt);
      if (v.some((x) => Object.is(x, optVal))) result.push(opt);
    }
    return result;
  });

  protected readonly selectedLabel = computed<string>(() => {
    const opts = this.selectedOptions();
    if (opts.length === 0) return this.placeholder();
    return opts.map((o) => this.getOptionLabel()(o)).join(', ');
  });

  protected valueContext(): TngMultiSelectValueContext<O, V> {
    const opts = this.selectedOptions();
    const v = this.primitive.value() ?? [];
    const label = opts.length > 0 ? opts.map((o) => this.getOptionLabel()(o)).join(', ') : this.placeholder();
    return {
      $implicit: {
        value: v,
        options: opts,
        label,
        removeItem: (item: V) => this.removeSelectedItem(item),
      },
    };
  }

  protected optionContext(opt: O): TngMultiSelectOptionContext<O, V> {
    const optVal = this.getOptionValue()(opt);
    const label = this.getOptionLabel()(opt);
    const disabled = this.isOptionDisabled()(opt);
    const v = this.primitive.value() ?? [];
    const selected = v.some((x) => Object.is(x, optVal));

    return { $implicit: { option: opt, value: optVal, label, disabled, selected, active: false } };
  }

  /** Adds an item to the selection. Delegates to primitive. */
  addSelectedItem(item: V): void {
    this.primitive.addSelectedItem(item);
  }

  /** Removes an item from the selection. Delegates to primitive. */
  removeSelectedItem(item: V): void {
    this.primitive.removeSelectedItem(item);
  }

  /** Toggles an item in the selection. Delegates to primitive. */
  toggleSelectedItem(item: V): void {
    this.primitive.toggleSelectedItem(item);
  }

  /** Clears the selection. Delegates to primitive. */
  clear(): void {
    this.primitive.clear();
  }
}
