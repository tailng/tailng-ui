export type TailngFilterType = 'text' | 'number' | 'date' | 'enum';

export type TailngTextFilter = string; // contains
export type TailngNumberFilter = { min?: number; max?: number };
export type TailngDateFilter = { from?: string; to?: string }; // ISO yyyy-mm-dd
export type TailngEnumFilter = string[]; // multi-select by default

export type TailngFilterValue =
  | TailngTextFilter
  | TailngNumberFilter
  | TailngDateFilter
  | TailngEnumFilter;

export type TailngFilters = Record<string, TailngFilterValue>;
