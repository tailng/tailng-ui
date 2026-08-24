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
  TngMultiAutocomplete,
  TngMultiAutocompleteChip,
  TngMultiAutocompleteContent,
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
  TngMultiAutocompleteOverlay,
  TngMultiAutocompleteTrigger,
} from '@tailng-ui/primitives';
import type { TngOverlayScrollStrategy } from '@tailng-ui/cdk';

export type TngMultiAutocompleteGetValue<O, V> = (opt: O) => V;
export type TngMultiAutocompleteGetLabel<O> = (opt: O) => string;
export type TngMultiAutocompleteResolveLabel<V> = (value: V) => string | null | undefined;
export type TngMultiAutocompleteIsDisabled<O> = (opt: O) => boolean;
export type TngMultiAutocompleteTrackBy<O> = (index: number, opt: O) => unknown;

export type TngMultiAutocompleteChipContext<O, V> = {
  $implicit: {
    option: O | null;
    value: V;
    label: string;
    removeItem: (item: V) => void;
  };
};

export type TngMultiAutocompleteOptionContext<O, V> = {
  $implicit: {
    option: O;
    value: V;
    label: string;
    disabled: boolean;
    selected: boolean;
    active: boolean;
  };
};

type SelectedItem<O, V> = {
  option: O | null;
  value: V;
  label: string;
  trackId: unknown;
};

@Component({
  selector: 'tng-multi-autocomplete',
  imports: [
    NgTemplateOutlet,
    TngMultiAutocompleteChip,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  hostDirectives: [
    {
      directive: TngMultiAutocomplete,
      inputs: ['open', 'value', 'query', 'disabled', 'loading', 'invalid'],
      outputs: ['openChange', 'valueChange', 'queryChange'],
    },
  ],
  templateUrl: './tng-multi-autocomplete.component.html',
  styleUrl: './tng-multi-autocomplete.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TngMultiAutocompleteComponent<O = unknown, V = unknown> {
  protected readonly primitive = inject<TngMultiAutocomplete<V>>(TngMultiAutocomplete);

  readonly options = input<readonly O[]>([]);
  readonly placeholder = input<string>('Type to search…');
  readonly emptyText = input<string>('No matches');
  readonly ariaLabel = input<string>('Multi autocomplete');
  readonly scrollStrategy = input<TngOverlayScrollStrategy>('reposition');

  readonly getOptionValue = input<TngMultiAutocompleteGetValue<O, V>>(
    ((opt: unknown) => (opt as { value?: V })?.value) as TngMultiAutocompleteGetValue<O, V>,
  );
  readonly getOptionLabel = input<TngMultiAutocompleteGetLabel<O>>(((opt: unknown) =>
    String(
      (opt as { label?: string; value?: unknown })?.label ??
        (opt as { value?: unknown })?.value ??
        opt,
    )) as TngMultiAutocompleteGetLabel<O>);
  readonly resolveValueLabel = input<TngMultiAutocompleteResolveLabel<V>>(
    (() => null) as TngMultiAutocompleteResolveLabel<V>,
  );
  readonly isOptionDisabled = input<TngMultiAutocompleteIsDisabled<O>>(
    ((opt: unknown) =>
      !!(opt as { disabled?: boolean })?.disabled) as TngMultiAutocompleteIsDisabled<O>,
  );
  readonly trackBy = input<TngMultiAutocompleteTrackBy<O>>((_, opt) => {
    const o = opt as Record<string, unknown> | null | undefined;
    return o?.['value'] ?? o?.['id'] ?? opt;
  });

  @ContentChild('tngMultiAutocompleteChipTpl', { read: TemplateRef })
  chipTpl?: TemplateRef<TngMultiAutocompleteChipContext<O, V>>;

  @ContentChild('tngMultiAutocompleteOptionTpl', { read: TemplateRef })
  optionTpl?: TemplateRef<TngMultiAutocompleteOptionContext<O, V>>;

  protected readonly selectedItems = computed<readonly SelectedItem<O, V>[]>(() => {
    const values = this.primitive.value();
    const getLabel = this.getOptionLabel();
    const resolveValueLabel = this.resolveValueLabel();

    return values.map((value) => {
      const option = this.findOption(value);
      const fallbackLabel = resolveValueLabel(value);
      return {
        option,
        value,
        label: option ? getLabel(option) : (fallbackLabel ?? String(value)),
        trackId: value as unknown,
      };
    });
  });

  protected readonly filteredOptions = computed<readonly O[]>(() => {
    return this.options();
  });

  protected chipContext(item: SelectedItem<O, V>): TngMultiAutocompleteChipContext<O, V> {
    return {
      $implicit: {
        option: item.option,
        value: item.value,
        label: item.label,
        removeItem: (value: V) => this.removeSelectedItem(value),
      },
    };
  }

  protected optionContext(opt: O): TngMultiAutocompleteOptionContext<O, V> {
    const value = this.getOptionValue()(opt);

    return {
      $implicit: {
        option: opt,
        value,
        label: this.getOptionLabel()(opt),
        disabled: this.isOptionDisabled()(opt),
        selected: this.hasSelectedValue(value),
        active: false,
      },
    };
  }

  addSelectedItem(item: V): void {
    this.primitive.add(item);
  }

  removeSelectedItem(item: V): void {
    this.primitive.remove(item);
  }

  toggleSelectedItem(item: V): void {
    this.primitive.toggle(item);
  }

  clear(): void {
    this.primitive.clear();
  }

  private findOption(value: V): O | null {
    const getValue = this.getOptionValue();

    for (const opt of this.options()) {
      if (Object.is(getValue(opt), value)) return opt;
    }

    return null;
  }

  private hasSelectedValue(value: V, selected: readonly V[] = this.primitive.value()): boolean {
    return selected.some((entry) => Object.is(entry, value));
  }
}
