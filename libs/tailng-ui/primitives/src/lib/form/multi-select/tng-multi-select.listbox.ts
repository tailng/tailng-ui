import { DestroyRef, Directive, effect, HostBinding, HostListener, inject, untracked } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
import { arraysEqual, normalizeToArray } from '../../internal/combobox';
import type { ListboxValue } from '../listbox/listbox.directive';
import { TngListboxDirective } from '../listbox/listbox.directive';
import { TngOptionDirective } from '../listbox/option.directive';
import { TNG_LISTBOX_PRESERVE_VALUE_ON_UNREGISTER } from '../listbox/tokens';
import { TNG_MULTI_SELECT } from './tng-multi-select.tokens';
import type { TngMultiSelect } from './tng-multi-select';
import { TngMultiSelectListboxApi } from './tng-multi-select.listbox.types';
import { TNG_MULTI_SELECT_LISTBOX } from './tng-multi-select.listbox.tokens';

const createListboxId = createTngIdFactory('tng-multi-select-listbox');

@Directive({
  selector: '[tngMultiSelectListbox]',
  providers: [
    { provide: TNG_MULTI_SELECT_LISTBOX, useExisting: TngMultiSelectListbox },
    { provide: TNG_LISTBOX_PRESERVE_VALUE_ON_UNREGISTER, useValue: true },
  ],
  hostDirectives: [
    {
      directive: TngListboxDirective,
      inputs: ['orientation', 'direction', 'disabled', 'loop', 'value', 'multiple'],
      outputs: ['valueChange'],
    },
  ],
})
export class TngMultiSelectListbox<T = unknown> implements TngMultiSelectListboxApi<T> {
  private readonly multiSelect = inject<TngMultiSelect<T>>(TNG_MULTI_SELECT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly listbox = inject(TngListboxDirective<T>, { self: true });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'multi-select-listbox' = 'multi-select-listbox';

  @HostBinding('attr.id')
  protected readonly id = createListboxId();

  constructor() {
    this.multiSelect.setListboxId(this.id);
    this.multiSelect.setListboxApi(this);

    effect(() => {
      const v = this.multiSelect.value();
      if (this.multiSelect.open()) return;

      const current = untracked(this.listbox.value);
      const arrV = v.length > 0 ? ([...v] as readonly T[]) : null;
      const arrCur = normalizeToArray(current);
      if (arraysEqual(arrV, arrCur)) return;
      this.listbox.value.set((v.length > 0 ? v : null) as ListboxValue<T>);
    });

    this.destroyRef.onDestroy(() => {
      this.multiSelect.setListboxId(null);
      this.multiSelect.setListboxApi(null);
    });
  }

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

  /** Multi: Enter toggles option, does not close. */
  commitActive(): void {
    this.listbox.handleKeyFromCombobox('Enter');
  }

  @HostListener('valueChange', ['$event'])
  protected onListboxValueChange(value: T | readonly T[] | null): void {
    if (this.multiSelect.disabled()) return;

    const next = normalizeToArray(value);
    const cur = this.multiSelect.value();
    if (arraysEqual(next, cur.length > 0 ? cur : null)) return;

    this.multiSelect.value.set(next && next.length > 0 ? [...next] : []);
    // Multi: overlay stays open
  }
}

@Directive({
  selector: '[tngMultiSelectOption]',
  hostDirectives: [
    {
      directive: TngOptionDirective,
      inputs: ['tngValue', 'disabled'],
    },
  ],
})
export class TngMultiSelectOption<T> {
  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'multi-select-option' = 'multi-select-option';
}
