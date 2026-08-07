import { NgTemplateOutlet } from '@angular/common';
import type { TemplateRef } from '@angular/core';
import {
  Component,
  ViewEncapsulation,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import type { TngOverlayScrollStrategy } from '@tailng-ui/cdk';

import {
  TngAutocomplete,
  TngAutocompleteTrigger,
  TngAutocompleteTriggerContainer,
  TngAutocompleteIcon,
  TngAutocompleteContent,
  TngAutocompleteOverlay,
  TngAutocompleteListbox,
  TngAutocompleteOption,
} from '@tailng-ui/primitives';


export type TngAutocompleteGetValue<O, V> = (opt: O) => V;
export type TngAutocompleteGetLabel<O> = (opt: O) => string;
export type TngAutocompleteIsDisabled<O> = (opt: O) => boolean;
export type TngAutocompleteTrackBy<O> = (index: number, opt: O) => unknown;

export type TngAutocompleteOptionContext<O, V> = {
  $implicit: O;
  option: O;
  value: V;
  label: string;
  selected: boolean;
  disabled: boolean;
};

export type TngAutocompleteSelectedContext<O, V> = {
  $implicit: O;
  option: O;
  value: V | null;
  label: string;
};

@Component({
  selector: 'tng-autocomplete',
  imports: [
    NgTemplateOutlet,
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteIcon,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  hostDirectives: [
    {
      directive: TngAutocomplete,
      inputs: [
        'open',
        'disabled',
        'loading',
        'invalid',
        'labelId',
        'descriptionId',
        'errorId',
      ],
      outputs: ['openChange'],
    },
  ],
  templateUrl: './tng-autocomplete.component.html',
  styleUrls: [
    './tng-autocomplete.component.css',
    './tng-autocomplete.overlay.component.css',
    './tng-autocomplete.form-field.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TngAutocompleteComponent<O = unknown, V = unknown> {
  protected readonly primitive = inject<TngAutocomplete<V>>(TngAutocomplete);

  protected readonly optionTemplate =
    contentChild<TemplateRef<TngAutocompleteOptionContext<O, V>>>('tngAutocompleteOptionTpl');

  protected readonly selectedOptionTemplate =
    contentChild<TemplateRef<TngAutocompleteSelectedContext<O, V>>>('tngAutocompleteSelectedTpl');

  protected readonly Object = Object;

  /**
   * Controlled value for the styled component.
   *
   * `undefined` means uncontrolled mode. In uncontrolled mode, the internal primitive
   * value is allowed to change without being reset by this wrapper.
   */
  public readonly value = input<V | null | undefined>(undefined);
  public readonly valueChange = output<V | null>();

  public readonly options = input<readonly O[]>([]);
  public readonly placeholder = input<string>('Type to search…');
  public readonly query = model<string>('');
  public readonly scrollStrategy = input<TngOverlayScrollStrategy>('block');

  public readonly getOptionValue = input<TngAutocompleteGetValue<O, V>>(
    ((opt: unknown) => (opt as { value?: V })?.value) as TngAutocompleteGetValue<O, V>,
  );

  public readonly getOptionLabel = input<TngAutocompleteGetLabel<O>>(
    ((opt: unknown) =>
      String(
        (opt as { label?: string; value?: unknown })?.label ??
        (opt as { value?: unknown })?.value ??
        opt,
      )) as TngAutocompleteGetLabel<O>,
  );

  public readonly isOptionDisabled = input<TngAutocompleteIsDisabled<O>>(
    ((opt: unknown) => !!(opt as { disabled?: boolean })?.disabled) as TngAutocompleteIsDisabled<O>,
  );

  public readonly trackBy = input<TngAutocompleteTrackBy<O>>((_, opt) => {
    const option = opt as Record<string, unknown> | null | undefined;
    return option?.['value'] ?? option?.['id'] ?? opt;
  });

  public readonly iconText = input<string>('▾');
  public readonly ariaLabel = input<string>('Autocomplete');

  private readonly userIsTyping = signal(false);
  private readonly lastSyncedValue = signal<V | null>(null);
  private readonly lastAppliedExternalValue = signal<V | null | undefined>(undefined);
  private readonly knownOptionLabels: { value: V; label: string }[] = [];

  public constructor() {
    this.setupExternalValueSyncEffect();
    this.setupPrimitiveValueEmitEffect();
    this.setupPrimitiveQuerySyncEffect();
    this.setupDisplaySyncEffects();
  }

  private setupExternalValueSyncEffect(): void {
    effect(() => {
      const externalValue = this.value();
      const primitiveValue = untracked(() => this.primitive.value());

      if (externalValue === undefined) {
        return;
      }

      if (
        Object.is(externalValue, this.lastAppliedExternalValue()) &&
        Object.is(primitiveValue, externalValue)
      ) {
        return;
      }

      this.lastAppliedExternalValue.set(externalValue);

      if (!Object.is(primitiveValue, externalValue)) {
        this.primitive.value.set(externalValue);
      }
    });
  }

  private setupPrimitiveValueEmitEffect(): void {
    effect(() => {
      const primitiveValue = this.primitive.value();
      const externalValue = this.value();
      const lastAppliedExternalValue = this.lastAppliedExternalValue();

      if (externalValue !== undefined && !Object.is(externalValue, lastAppliedExternalValue)) {
        return;
      }

      if (Object.is(primitiveValue, lastAppliedExternalValue)) {
        return;
      }

      if (externalValue !== undefined && Object.is(primitiveValue, externalValue)) {
        return;
      }

      this.valueChange.emit(primitiveValue);
    });
  }

  private setupPrimitiveQuerySyncEffect(): void {
    effect(() => {
      const query = this.query();

      if (!Object.is(this.primitive.query(), query)) {
        this.primitive.query.set(query);
      }
    });
  }

  private setupDisplaySyncEffects(): void {
    effect(() => {
      const value = this.selectedValue();
      const open = this.primitive.open();
      const userIsTyping = this.userIsTyping();
      const lastSyncedValue = this.lastSyncedValue();

      // Track these so query is refreshed after async option loading too.
      const options = this.options();
      const getOptionLabel = this.getOptionLabel();
      const getOptionValue = this.getOptionValue();
      this.rememberOptionLabels(options, getOptionValue, getOptionLabel);

      const option = this.findOption(value, options);
      const label = this.resolveDisplayLabel(value, option, getOptionLabel);

      const valueChangedSinceLastSync = !Object.is(value, lastSyncedValue);

      if (this.shouldUpdateDisplayQuery({ open, userIsTyping, valueChangedSinceLastSync, query: this.query(), label })) {
        this.query.set(label);
        this.lastSyncedValue.set(value);
      }

      if (valueChangedSinceLastSync) {
        this.userIsTyping.set(false);
      }
    });

    effect(() => {
      if (!this.primitive.open()) {
        this.userIsTyping.set(false);
      }
    });
  }

  private shouldUpdateDisplayQuery(
    state: Readonly<{
      open: boolean;
      userIsTyping: boolean;
      valueChangedSinceLastSync: boolean;
      query: string;
      label: string;
    }>,
  ): boolean {
    if (
      state.open &&
      !state.userIsTyping &&
      !state.valueChangedSinceLastSync &&
      !Object.is(state.query, state.label)
    ) {
      return false;
    }

    return !state.open || !state.userIsTyping || state.valueChangedSinceLastSync;
  }

  protected readonly selectedValue = computed<V | null>(() => this.primitive.value());

  protected readonly selectedOption = computed<O | null>(() => {
    const value = this.selectedValue();

    if (value === null) {
      return null;
    }

    const getValue = this.getOptionValue();

    for (const option of this.options()) {
      if (Object.is(getValue(option), value)) {
        return option;
      }
    }

    return null;
  });

  protected readonly selectedLabel = computed<string>(() =>
    this.resolveDisplayLabel(this.selectedValue(), this.selectedOption(), this.getOptionLabel()),
  );

  protected readonly filteredOptions = computed<readonly O[]>(() => {
    return this.options();
  });

  protected readonly displayText = computed<string>(() =>
    this.primitive.open() ? this.query() : this.selectedLabel(),
  );

  protected onInput(event: Readonly<Event>): void {
    const value = (event.target as HTMLInputElement).value;
    this.userIsTyping.set(true);
    this.query.set(value);
  }

  protected onFocus(event: Readonly<FocusEvent>): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
  }

  private resolveDisplayLabel(
    value: V | null,
    option: O | null,
    getOptionLabel: TngAutocompleteGetLabel<O>,
  ): string {
    if (option !== null) {
      return getOptionLabel(option);
    }

    const knownLabel = this.findKnownLabel(value);
    if (knownLabel !== null) {
      return knownLabel;
    }

    if (value === null || value === undefined) {
      return '';
    }

    return String(value);
  }

  private findOption(value: V | null, options: readonly O[] = this.options()): O | null {
    if (value === null) {
      return null;
    }

    const getValue = this.getOptionValue();

    for (const option of options) {
      if (Object.is(getValue(option), value)) {
        return option;
      }
    }

    return null;
  }

  private rememberOptionLabels(
    options: readonly O[],
    getOptionValue: TngAutocompleteGetValue<O, V>,
    getOptionLabel: TngAutocompleteGetLabel<O>,
  ): void {
    for (const option of options) {
      const value = getOptionValue(option);
      const label = getOptionLabel(option);
      const existing = this.knownOptionLabels.find((entry: Readonly<{ value: V; label: string }>) => Object.is(entry.value, value));
      if (existing !== undefined) {
        existing.label = label;
      } else {
        this.knownOptionLabels.push({ value, label });
      }
    }
  }

  private findKnownLabel(value: V | null): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    return this.knownOptionLabels.find((entry: Readonly<{ value: V; label: string }>) => Object.is(entry.value, value))?.label ?? null;
  }
}
