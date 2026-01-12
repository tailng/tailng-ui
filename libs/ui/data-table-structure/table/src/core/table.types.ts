import { TemplateRef } from '@angular/core';

export type TailngAlign = 'left' | 'center' | 'right';

export type TailngCellContext<T> = {
  /** row */
  $implicit: T;
  row: T;

  /** zero-based row index */
  rowIndex: number;

  /** column id */
  colId: string;

  /** resolved value for this cell */
  value: unknown;
};

export type TailngHeaderContext = {
  colId: string;
  header: string;
};

export type TailngResolvedColumn<T> = {
  id: string;
  header: string;
  align?: TailngAlign;
  width?: string;
  klass?: string;

  value?: (row: T) => unknown;

  headerTpl?: TemplateRef<TailngHeaderContext>;
  cellTpl?: TemplateRef<TailngCellContext<T>>;
};

export type TailngSortDir = '' | 'asc' | 'desc';
export type TailngSort = { active: string; direction: TailngSortDir };

// -------------------- FILTER --------------------
export type TailngFilterType = 'text' | 'number' | 'date' | 'enum';

export type TailngTextFilter = string; // contains
export type TailngNumberFilter = { min?: number; max?: number };
export type TailngDateFilter = { from?: string; to?: string }; // ISO yyyy-mm-dd
export type TailngEnumFilter = string[]; // multi-select by default

export type TailngFilterValue = TailngTextFilter | TailngNumberFilter | TailngDateFilter | TailngEnumFilter;
export type TailngFilters = Record<string, TailngFilterValue>;

// Column-level filter metadata (used by defaults)
export type TailngEnumOption = { value: string; label: string };

export type TailngColumnFilterMeta =
  | { type: 'text'; placeholder?: string }
  | { type: 'number' }
  | { type: 'date' }
  | { type: 'enum'; options: TailngEnumOption[] };

export type TailngColumnMeta = {
  id: string;
  label?: string;
  filter?: TailngColumnFilterMeta;
};