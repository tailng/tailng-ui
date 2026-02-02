export type TngFilterType = 'text' | 'number' | 'date' | 'enum';

export type TngTextFilter = string; // contains
export type TngNumberFilter = { min?: number; max?: number };
export type TngDateFilter = { from?: string; to?: string }; // ISO yyyy-mm-dd
export type TngEnumFilter = string[]; // multi-select by default

export type TngFilterValue =
  | TngTextFilter
  | TngNumberFilter
  | TngDateFilter
  | TngEnumFilter;

export type TngFilters = Record<string, TngFilterValue>;
