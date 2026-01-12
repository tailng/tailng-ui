import type { TemplateRef } from '@angular/core';
import type { TailngAlign } from './align.type';
import type { TailngCellContext, TailngHeaderContext } from './context.type';

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
