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
