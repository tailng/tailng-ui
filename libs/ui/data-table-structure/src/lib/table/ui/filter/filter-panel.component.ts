import { Component, computed, inject } from '@angular/core';
import { TNG_TABLE } from '../../core/tokens/table.token';
import type {
  TngColumnMeta,
  TngDateFilter,
  TngEnumFilter,
  TngNumberFilter,
  TngTextFilter,
  TngEnumOption,
} from '../../core/types';

import {
  TngOverlayRef,
  TngConnectedOverlay,
  TngOverlayPanel,
} from '../../../../../../popups-overlays/src/public-api';

@Component({
  selector: 'tng-filter-panel',
  standalone: true,
  imports: [TngOverlayRef, TngConnectedOverlay, TngOverlayPanel],
  templateUrl: './filter-panel.component.html',
})
export class TngFilterPanel {
  private readonly table = inject(TNG_TABLE);

  readonly activeColId = computed(() => this.table.openFilterColId());
  readonly isOpen = computed(() => this.activeColId() !== '');
  readonly anchorEl = computed(() => this.table.filterAnchorEl());

  readonly meta = computed<TngColumnMeta | undefined>(() => {
    const id = this.activeColId();
    return id ? this.table.metaFor(id) : undefined;
  });

  readonly filterType = computed(() => this.meta()?.filter?.type ?? 'text');

  readonly titleSuffix = computed(() => {
    const label = this.meta()?.label;
    return label ? ` • ${label}` : '';
  });

  readonly panelKlass = computed(() => {
    const base = 'min-w-80 max-w-[360px] p-0';
    const fromTrigger = this.table.filterPanelKlass();
    return `${base} ${fromTrigger}`.trim();
  });
  
  // ---- open/close wiring ----
  onOverlayOpenChange(open: boolean): void {
    // if overlay closes, reflect that back to controller
    if (!open && this.isOpen()) this.close();
  }

  onOverlayClosed(): void {
    // overlay stack says it's closed (outside click / escape)
    if (this.isOpen()) this.close();
  }

  close(): void {
    this.table.closeFilter();
  }

  clear(): void {
    const id = this.activeColId();
    if (id) this.table.clearFilter(id);
  }

  // ---------------- TEXT ----------------
  readonly textPlaceholder = computed(() => {
    const f = this.meta()?.filter;
    return f?.type === 'text' ? f.placeholder ?? 'Type to filter…' : 'Type to filter…';
  });

  textValue(): string {
    const id = this.activeColId();
    const v = id ? (this.table.filterValueFor(id) as TngTextFilter | undefined) : undefined;
    return typeof v === 'string' ? v : '';
  }

  onTextInput(ev: Event): void {
    const value = (ev.target as HTMLInputElement | null)?.value ?? '';
    const id = this.activeColId();
    if (!id) return;

    const trimmed = value.trim();
    if (!trimmed) this.table.clearFilter(id);
    else this.table.setFilter(id, trimmed);
  }

  // ---------------- NUMBER ----------------
  private numberValue(): TngNumberFilter {
    const id = this.activeColId();
    const v = id ? (this.table.filterValueFor(id) as TngNumberFilter | undefined) : undefined;
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  }

  numberMin(): string {
    const v = this.numberValue().min;
    return typeof v === 'number' && Number.isFinite(v) ? String(v) : '';
  }

  numberMax(): string {
    const v = this.numberValue().max;
    return typeof v === 'number' && Number.isFinite(v) ? String(v) : '';
  }

  onNumberMinInput(ev: Event): void {
    const raw = (ev.target as HTMLInputElement | null)?.value ?? '';
    const id = this.activeColId();
    if (!id) return;

    const cur = this.numberValue();
    const n = raw === '' ? undefined : Number(raw);

    const next: TngNumberFilter = { ...cur, min: Number.isFinite(n as number) ? (n as number) : undefined };
    if (!next.min && !next.max) this.table.clearFilter(id);
    else this.table.setFilter(id, next);
  }

  onNumberMaxInput(ev: Event): void {
    const raw = (ev.target as HTMLInputElement | null)?.value ?? '';
    const id = this.activeColId();
    if (!id) return;

    const cur = this.numberValue();
    const n = raw === '' ? undefined : Number(raw);

    const next: TngNumberFilter = { ...cur, max: Number.isFinite(n as number) ? (n as number) : undefined };
    if (!next.min && !next.max) this.table.clearFilter(id);
    else this.table.setFilter(id, next);
  }

  // ---------------- DATE ----------------
  private dateValue(): TngDateFilter {
    const id = this.activeColId();
    const v = id ? (this.table.filterValueFor(id) as TngDateFilter | undefined) : undefined;
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  }

  dateFrom(): string {
    return this.dateValue().from ?? '';
  }

  dateTo(): string {
    return this.dateValue().to ?? '';
  }

  onDateFromInput(ev: Event): void {
    const from = (ev.target as HTMLInputElement | null)?.value ?? '';
    const id = this.activeColId();
    if (!id) return;

    const cur = this.dateValue();
    const next: TngDateFilter = { ...cur, from: from || undefined };
    if (!next.from && !next.to) this.table.clearFilter(id);
    else this.table.setFilter(id, next);
  }

  onDateToInput(ev: Event): void {
    const to = (ev.target as HTMLInputElement | null)?.value ?? '';
    const id = this.activeColId();
    if (!id) return;

    const cur = this.dateValue();
    const next: TngDateFilter = { ...cur, to: to || undefined };
    if (!next.from && !next.to) this.table.clearFilter(id);
    else this.table.setFilter(id, next);
  }

  // ---------------- ENUM ----------------
  enumOptions(): TngEnumOption[] {
    const f = this.meta()?.filter;
    return f?.type === 'enum' ? f.options : [];
  }

  private enumValue(): TngEnumFilter {
    const id = this.activeColId();
    const v = id ? (this.table.filterValueFor(id) as TngEnumFilter | undefined) : undefined;
    return Array.isArray(v) ? v : [];
  }

  enumChecked(value: string): boolean {
    return this.enumValue().includes(value);
  }

  toggleEnum(value: string): void {
    const id = this.activeColId();
    if (!id) return;

    const cur = this.enumValue();
    const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];

    if (next.length === 0) this.table.clearFilter(id);
    else this.table.setFilter(id, next);
  }
}
