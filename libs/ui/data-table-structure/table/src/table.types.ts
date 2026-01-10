import { TemplateRef } from '@angular/core';

export type TngAlign = 'left' | 'center' | 'right';

export type TngCellContext<T> = {
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

export type TngHeaderContext = {
  colId: string;
  header: string;
};

export type TngResolvedColumn<T> = {
  id: string;
  header: string;
  align?: TngAlign;
  width?: string;
  klass?: string;

  value?: (row: T) => unknown;

  headerTpl?: TemplateRef<TngHeaderContext>;
  cellTpl?: TemplateRef<TngCellContext<T>>;
};
