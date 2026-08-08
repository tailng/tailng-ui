import { DestroyRef, Directive, effect, HostBinding, HostListener, inject, untracked } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
import { normalizeToSingle } from '../../internal/combobox';
import { TngListboxDirective } from '../listbox/listbox.directive';
import { TngOptionDirective } from '../listbox/option.directive';
import { TNG_LISTBOX_PRESERVE_VALUE_ON_UNREGISTER } from '../listbox/tokens';
import { TNG_SELECT } from './tng-select.tokens';
import type { TngSelect } from './tng-select';
import { TngSelectListboxApi } from './tng-select.listbox.types';
import { TNG_SELECT_LISTBOX } from './tng-select.listbox.tokens';

const createListboxId = createTngIdFactory('tng-select-listbox');
@Directive({
  selector: '[tngSelectListbox]',
  providers: [
    { provide: TNG_SELECT_LISTBOX, useExisting: TngSelectListbox },
    // Keep selection across option remounts (e.g. unstable mapped [options] arrays).
    { provide: TNG_LISTBOX_PRESERVE_VALUE_ON_UNREGISTER, useValue: true },
  ],
  hostDirectives: [
    {
      directive: TngListboxDirective,
      inputs: ['orientation', 'direction', 'disabled', 'loop', 'value'],
      outputs: ['valueChange'],
    },
  ],
})
export class TngSelectListbox<T = unknown> implements TngSelectListboxApi<T> {
  private readonly select = inject<TngSelect<T>>(TNG_SELECT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly listbox = inject(TngListboxDirective<T>, { self: true });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-listbox' = 'select-listbox';

  @HostBinding('attr.id')
  protected readonly id = createListboxId();

  constructor() {
    // register id
    this.select.setListboxId(this.id);

    // register API into select (Mode-2 bridge)
    this.select.setListboxApi(this);

    // controlled sync from Select -> Listbox
    effect(() => {
      const v = this.select.value();

      if (this.select.open()) return;

      const current = untracked(this.listbox.value);
      const currentSingle = normalizeToSingle(current);
      if (Object.is(currentSingle, v)) return;
      this.listbox.value.set(v as T | null);
    });

    this.destroyRef.onDestroy(() => {
      this.select.setListboxId(null);
      this.select.setListboxApi(null);
    });
  }

  // ---------------- API ----------------

  getHostId(): string | null {
    return this.id ?? null;
  }

  getActiveId(): string | null {
    return this.listbox.getActiveId();
  }

  ensureActive(pref?: 'first' | 'last'): void {
    this.listbox.ensureActive(pref);
  }

  handleKey(key: string, shiftKey?: boolean): boolean {
    return this.listbox.handleKeyFromCombobox(key, shiftKey);
  }

  typeahead(key: string): boolean {
    return this.listbox.typeaheadFromCombobox(key);
  }

  commitActive(): void {
    const value = this.listbox.getActiveValue();
    if (value === undefined) return;
    this.select.selectValue(value as T);
  }

  @HostListener('valueChange', ['$event'])
  protected onListboxValueChange(value: T | readonly T[] | null): void {
    if (this.select.disabled()) return;

    const next = normalizeToSingle(value);
    if (Object.is(next, this.select.value())) {
      if (this.select.open() && next !== null) {
        this.select.selectValue(next as T);
      }
      return;
    }

    // Null from option remount/teardown must not clear the controlled select value
    // or close the overlay. Real clears go through select.value / selectValue.
    if (next === null) {
      return;
    }

    if (!this.select.open()) {
      this.select.value.set(next as T);
      return;
    }

    this.select.selectValue(next);
  }
}

@Directive({
  selector: '[tngSelectOption]',
  hostDirectives: [
    {
      directive: TngOptionDirective,
      inputs: ['tngValue', 'disabled'],
    },
  ],
})
export class TngSelectOption<T> {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select-option' = 'select-option';
}