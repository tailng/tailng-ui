import { NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChildren,
  inject,
  input,
  isDevMode,
  output,
  signal,
} from '@angular/core';
import type { TngTableSortDirection } from '@tailng-ui/cdk';
import {
  TngSortHeader,
  TngTable as TngTablePrimitive,
  TngTableBody,
  TngTableCell,
  TngTableHeader,
  TngTableHeaderCell,
  TngTableRow,
  TngTableScrollContainer,
  TngTableSort,
  type TngTableDirection,
  type TngTableLayoutMode,
  type TngTableScrollAxis,
  type TngTableSortChange,
  type TngTableStickySide,
} from '@tailng-ui/primitives';

export type TngTableDensity = 'compact' | 'comfortable';
export type TngTableHoverMode = 'row' | 'group';
export type TngTableCellAlign = 'center' | 'end' | 'start';
export type TngTableGroupByAlign = 'middle' | 'top';
export type TngTableColumnAccessor<TRow> = keyof TRow | ((row: TRow, index: number) => unknown);

/** Class values accepted by the styling hooks — mirrors the native `[class]` binding inputs. */
export type TngTableClassInput =
  | string
  | readonly string[]
  | Record<string, boolean>
  | null
  | undefined;
export type TngTableRowClassFn<TRow> = (row: TRow, index: number) => TngTableClassInput;
export type TngTableCellClassFn<TRow> = (
  row: TRow,
  value: unknown,
  index: number,
) => TngTableClassInput;
export type TngTableStyleInput =
  | Readonly<Record<string, string | number | null | undefined>>
  | null
  | undefined;
export type TngTableRowStyleFn<TRow> = (row: TRow, index: number) => TngTableStyleInput;
export type TngTableCellStyleFn<TRow> = (
  row: TRow,
  value: unknown,
  index: number,
) => TngTableStyleInput;

export type TngTableLeafColumn<TRow = unknown> = Readonly<{
  id: string;
  label?: string;
  accessor?: TngTableColumnAccessor<TRow>;
  align?: TngTableCellAlign;
  cellClass?: TngTableClassInput | TngTableCellClassFn<TRow>;
  cellStyle?: TngTableStyleInput | TngTableCellStyleFn<TRow>;
  groupBy?: boolean;
  groupByAlign?: TngTableGroupByAlign;
  headerAlign?: TngTableCellAlign;
  headerClass?: TngTableClassInput;
  headerStyle?: TngTableStyleInput;
  sortable?: boolean;
  sticky?: TngTableStickySide | null;
  truncate?: boolean;
  width?: number | string | null;
  hidden?: boolean;
  children?: never;
}>;

export type TngTableGroupColumn<TRow = unknown> = Readonly<{
  id: string;
  label?: string;
  headerAlign?: TngTableCellAlign;
  headerClass?: TngTableClassInput;
  headerStyle?: TngTableStyleInput;
  hidden?: boolean;
  children: readonly TngTableColumn<TRow>[];
}>;

export type TngTableColumn<TRow = unknown> = TngTableLeafColumn<TRow> | TngTableGroupColumn<TRow>;

export type TngTableCellContext<TRow = unknown> = Readonly<{
  $implicit: unknown;
  column: TngTableLeafColumn<TRow>;
  columnId: string;
  row: TRow;
  rowIndex: number;
  value: unknown;
  groupSize: number;
  isGroupLeader: boolean;
}>;

export type TngTableHeaderContext<TRow = unknown> = Readonly<{
  $implicit: TngTableColumn<TRow>;
  column: TngTableColumn<TRow>;
  columnId: string;
  label: string;
  isGroup: boolean;
  depth: number;
  colspan: number;
  rowspan: number;
}>;

export type TngTableHeaderCellNode<TRow = unknown> = Readonly<{
  column: TngTableColumn<TRow>;
  id: string;
  label: string;
  isGroup: boolean;
  depth: number;
  colspan: number;
  rowspan: number;
}>;

type HeaderTreeModel<TRow> = Readonly<{
  headerRows: readonly (readonly TngTableHeaderCellNode<TRow>[])[];
  leafColumns: readonly TngTableLeafColumn<TRow>[];
  maxDepth: number;
}>;

type TngTableBodyCellSpan = Readonly<{
  groupSize: number;
  isGroupLeader: boolean;
  render: boolean;
  rowspan: number;
}>;

type TngTableBodySpanRun = Readonly<{
  end: number;
  start: number;
}>;

type BodySpanGridState<TRow> = {
  readonly items: readonly TRow[];
  readonly rows: Record<string, TngTableBodyCellSpan>[];
}

type TableColumnWalkContext<TRow> = {
  readonly maxDepth: number;
  readonly headerRows: TngTableHeaderCellNode<TRow>[][];
  readonly leafColumns: TngTableLeafColumn<TRow>[];
}

const defaultBodyCellSpan: TngTableBodyCellSpan = Object.freeze({
  groupSize: 1,
  isGroupLeader: false,
  render: true,
  rowspan: 1,
});

function isGroupColumn<TRow>(column: TngTableColumn<TRow>): column is TngTableGroupColumn<TRow> {
  return (
    'children' in column &&
    Array.isArray((column as TngTableGroupColumn<TRow>).children) &&
    (column as TngTableGroupColumn<TRow>).children.length > 0
  );
}

function isHidden<TRow>(column: TngTableColumn<TRow>): boolean {
  return (column as { hidden?: boolean }).hidden === true;
}

function hasValidId<TRow>(column: TngTableColumn<TRow>): boolean {
  return typeof column.id === 'string' && column.id.trim().length > 0;
}

function normalizeCssLength(value: number | string | null | undefined): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value}px`;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeCellAlign(value: TngTableCellAlign | null | undefined): TngTableCellAlign {
  return value === 'center' || value === 'end' ? value : 'start';
}

function normalizeCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return String(value);
  }

  return JSON.stringify(value);
}

function normalizeClassToken(token: string): string {
  return token.trim();
}

/**
 * Flattens the supported class inputs (`string | string[] | Record<string, boolean>`)
 * into a single space-separated string. Done in the component rather than relying on
 * the native `[class]` binding directly so that object keys containing multiple
 * space-separated classes (which the native binding does not split) keep working.
 */
function normalizeClassValue(value: TngTableClassInput): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return normalizeClassToken(value);
  }

  if (Array.isArray(value)) {
    return value
      .filter((token): token is string => typeof token === 'string')
      .map(normalizeClassToken)
      .filter((token) => token.length > 0)
      .join(' ');
  }

  return Object.entries(value as Record<string, boolean>)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([token]) => normalizeClassToken(token))
    .filter((token) => token.length > 0)
    .join(' ');
}

function areGroupValuesEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }

  if (a instanceof Date && b instanceof Date) {
    return Object.is(a.getTime(), b.getTime());
  }

  return false;
}

function getColumnLabelText<TRow>(column: TngTableColumn<TRow>): string {
  return column.label ?? column.id;
}

@Directive({
  selector: 'ng-template[tngTableCellTemplate]',
  exportAs: 'tngTableCellTemplate',
})
export class TngTableCellTemplate<TRow = unknown> {
  public readonly columnId = input<string | null>(null, {
    alias: 'tngTableCellTemplate',
  });
  public readonly templateRef = inject<TemplateRef<TngTableCellContext<TRow>>>(TemplateRef);
}

@Directive({
  selector: 'ng-template[tngTableHeaderTemplate]',
  exportAs: 'tngTableHeaderTemplate',
})
export class TngTableHeaderTemplate<TRow = unknown> {
  public readonly columnId = input<string | null>(null, {
    alias: 'tngTableHeaderTemplate',
  });
  public readonly templateRef = inject<TemplateRef<TngTableHeaderContext<TRow>>>(TemplateRef);
}

@Component({
  selector: 'tng-table',
  imports: [
    NgStyle,
    NgTemplateOutlet,
    TngTablePrimitive,
    TngTableBody,
    TngTableCell,
    TngTableHeader,
    TngTableHeaderCell,
    TngSortHeader,
    TngTableRow,
    TngTableScrollContainer,
    TngTableSort,
  ],
  templateUrl: './tng-table.component.html',
  styleUrl: './tng-table.component.css',
  exportAs: 'tngTableComponent',
})
export class TngTableComponent<TRow = unknown> {
  private readonly cellTemplates = contentChildren(TngTableCellTemplate<TRow>);
  private readonly headerTemplates = contentChildren(TngTableHeaderTemplate<TRow>);

  public readonly ariaLabel = input<string | null>('Table');
  public readonly ariaLabelledby = input<string | null>(null);
  public readonly columns = input<readonly TngTableColumn<TRow>[]>([]);
  public readonly density = input<TngTableDensity>('comfortable');
  public readonly dir = input<TngTableDirection | null>(null);
  public readonly hoverMode = input<TngTableHoverMode>('row');
  public readonly error = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly filterable = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly items = input<readonly TRow[]>([]);
  public readonly layout = input<TngTableLayoutMode>('auto');
  public readonly loading = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly pageable = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly rowClass = input<TngTableRowClassFn<TRow> | null>(null);
  public readonly rowStyle = input<TngTableRowStyleFn<TRow> | null>(null);
  public readonly scrollAxis = input<TngTableScrollAxis>('x');
  public readonly sortActive = input<string | null | undefined>(undefined);
  public readonly sortDirection = input<TngTableSortDirection | null | undefined>(undefined);
  public readonly sortDisableClear = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly stickyHeader = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  public readonly sortChange = output<TngTableSortChange>();

  protected readonly headerTreeModel = computed<HeaderTreeModel<TRow>>(() =>
    this.buildHeaderTreeModel(this.columns()),
  );
  protected readonly bodySpanGrid = computed<
    readonly Readonly<Record<string, TngTableBodyCellSpan>>[]
  >(() => this.buildBodySpanGrid(this.items(), this.headerTreeModel().leafColumns));

  // For each body row, the index of its group leader based on the outermost
  // groupBy column. Rows that merge into the same rowspan share a key, so a
  // hover can highlight the whole group rather than a single physical <tr>.
  protected readonly rowGroupKeys = computed<readonly number[]>(() => {
    const items = this.items();
    const grid = this.bodySpanGrid();
    const primary = this.headerTreeModel().leafColumns.find((column) => column.groupBy === true);

    if (!primary) {
      return items.map((_, index) => index);
    }

    const keys: number[] = [];
    let leader = 0;
    for (let index = 0; index < items.length; index += 1) {
      if (grid[index]?.[primary.id]?.isGroupLeader) {
        leader = index;
      }
      keys.push(leader);
    }
    return keys;
  });

  // True when at least one leaf column declares groupBy, i.e. body rows merge
  // into rowspan groups and per-group styling hooks are meaningful.
  protected readonly hasRowGrouping = computed<boolean>(() =>
    this.headerTreeModel().leafColumns.some((column) => column.groupBy === true),
  );

  private readonly hoveredRowGroup = signal<number | null>(null);

  protected get visibleColumns(): readonly TngTableColumn<TRow>[] {
    return this.columns().filter((column) => hasValidId(column) && !isHidden(column));
  }

  protected get headerRows(): readonly (readonly TngTableHeaderCellNode<TRow>[])[] {
    return this.headerTreeModel().headerRows;
  }

  protected get leafColumns(): readonly TngTableLeafColumn<TRow>[] {
    return this.headerTreeModel().leafColumns;
  }

  protected getScrollOverflowX(): string {
    const axis = this.scrollAxis();
    return axis === 'x' || axis === 'both' ? 'var(--tng-table-scroll-overflow-x, auto)' : 'hidden';
  }

  protected getScrollOverflowY(): string {
    const axis = this.scrollAxis();
    return axis === 'y' || axis === 'both' ? 'var(--tng-table-scroll-overflow-y, auto)' : 'hidden';
  }

  protected getColumnLabel(column: TngTableColumn<TRow>): string {
    return getColumnLabelText(column);
  }

  protected getColumnWidth(column: TngTableLeafColumn<TRow>): string | null {
    return normalizeCssLength(column.width);
  }

  protected getHeaderAlign(node: TngTableHeaderCellNode<TRow>): TngTableCellAlign {
    if (node.isGroup) {
      return normalizeCellAlign((node.column as TngTableGroupColumn<TRow>).headerAlign ?? 'center');
    }

    const leaf = node.column as TngTableLeafColumn<TRow>;
    return normalizeCellAlign(leaf.headerAlign ?? leaf.align);
  }

  protected getCellAlign(column: TngTableLeafColumn<TRow>): TngTableCellAlign {
    return normalizeCellAlign(column.align);
  }

  protected getGroupByAlign(
    column: TngTableLeafColumn<TRow>,
    span: TngTableBodyCellSpan,
  ): TngTableGroupByAlign | null {
    if (!span.isGroupLeader || span.groupSize <= 1 || column.groupBy !== true) {
      return null;
    }

    return column.groupByAlign === 'middle' ? 'middle' : 'top';
  }

  protected getCellValue(row: TRow, column: TngTableLeafColumn<TRow>, rowIndex: number): unknown {
    const accessor = column.accessor;
    if (typeof accessor === 'function') {
      return accessor(row, rowIndex);
    }

    if (
      typeof accessor === 'string' ||
      typeof accessor === 'number' ||
      typeof accessor === 'symbol'
    ) {
      return (row as Record<PropertyKey, unknown>)[accessor];
    }

    return (row as Record<PropertyKey, unknown>)[column.id];
  }

  protected getCellText(row: TRow, column: TngTableLeafColumn<TRow>, rowIndex: number): string {
    return normalizeCellValue(this.getCellValue(row, column, rowIndex));
  }

  protected getCellTemplate(columnId: string): TngTableCellTemplate<TRow> | null {
    let fallbackTemplate: TngTableCellTemplate<TRow> | null = null;
    for (const template of this.cellTemplates()) {
      if (template.columnId() === columnId) {
        return template;
      }

      if (template.columnId() === null) {
        fallbackTemplate = template;
      }
    }

    return fallbackTemplate;
  }

  protected getHeaderTemplate(columnId: string): TngTableHeaderTemplate<TRow> | null {
    let fallbackTemplate: TngTableHeaderTemplate<TRow> | null = null;
    for (const template of this.headerTemplates()) {
      if (template.columnId() === columnId) {
        return template;
      }

      if (template.columnId() === null) {
        fallbackTemplate = template;
      }
    }

    return fallbackTemplate;
  }

  protected getCellContext(
    row: TRow,
    column: TngTableLeafColumn<TRow>,
    options: {
      readonly rowIndex: number;
      readonly span?: TngTableBodyCellSpan;
    },
  ): TngTableCellContext<TRow> {
    const { rowIndex, span = defaultBodyCellSpan } = options;
  
    const value = this.getCellValue(row, column, rowIndex);
  
    return {
      $implicit: value,
      column,
      columnId: column.id,
      row,
      rowIndex,
      value,
      groupSize: span.groupSize,
      isGroupLeader: span.isGroupLeader,
    };
  }

  protected getHeaderContext(node: TngTableHeaderCellNode<TRow>): TngTableHeaderContext<TRow> {
    return {
      $implicit: node.column,
      column: node.column,
      columnId: node.id,
      label: node.label,
      isGroup: node.isGroup,
      depth: node.depth,
      colspan: node.colspan,
      rowspan: node.rowspan,
    };
  }

  protected getColspan(): number {
    return Math.max(1, this.leafColumns.length);
  }

  protected getBodyCellSpan(rowIndex: number, columnId: string): TngTableBodyCellSpan {
    return this.bodySpanGrid()[rowIndex]?.[columnId] ?? defaultBodyCellSpan;
  }

  protected getRowId(_row: TRow, rowIndex: number): string {
    return String(rowIndex);
  }

  protected onRowPointerEnter(rowIndex: number): void {
    if (this.hoverMode() !== 'group') {
      return;
    }
    this.hoveredRowGroup.set(this.rowGroupKeys()[rowIndex] ?? null);
  }

  protected onTablePointerLeave(): void {
    if (this.hoveredRowGroup() !== null) {
      this.hoveredRowGroup.set(null);
    }
  }

  protected isRowGroupHovered(rowIndex: number): boolean {
    return this.hoverMode() === 'group' && this.hoveredRowGroup() === this.rowGroupKeys()[rowIndex];
  }

  // Position of a row within its primary (outermost) groupBy run. Returns null
  // when the table has no grouping so non-grouped tables stay unannotated.
  protected getRowGroupPosition(
    rowIndex: number,
  ): 'first' | 'middle' | 'last' | 'single' | null {
    if (!this.hasRowGrouping()) {
      return null;
    }

    const keys = this.rowGroupKeys();
    const key = keys[rowIndex];
    const prevSame = rowIndex > 0 && keys[rowIndex - 1] === key;
    const nextSame = rowIndex < keys.length - 1 && keys[rowIndex + 1] === key;

    if (prevSame && nextSame) {
      return 'middle';
    }
    if (nextSame) {
      return 'first';
    }
    if (prevSame) {
      return 'last';
    }
    return 'single';
  }

  protected resolveRowClass(row: TRow, rowIndex: number): string {
    const rowClass = this.rowClass();
    return rowClass ? normalizeClassValue(rowClass(row, rowIndex)) : '';
  }

  protected resolveCellClass(
    column: TngTableLeafColumn<TRow>,
    row: TRow,
    rowIndex: number,
  ): string {
    const cellClass = column.cellClass;
    if (cellClass === undefined || cellClass === null) {
      return '';
    }

    if (typeof cellClass === 'function') {
      return normalizeClassValue(cellClass(row, this.getCellValue(row, column, rowIndex), rowIndex));
    }

    return normalizeClassValue(cellClass);
  }

  protected resolveHeaderClass(node: TngTableHeaderCellNode<TRow>): string {
    return normalizeClassValue(
      (node.column as { headerClass?: TngTableClassInput }).headerClass,
    );
  }

  protected resolveRowStyle(row: TRow, rowIndex: number): TngTableStyleInput {
    const rowStyle = this.rowStyle();
    return rowStyle ? rowStyle(row, rowIndex) : null;
  }

  protected resolveCellStyle(
    column: TngTableLeafColumn<TRow>,
    row: TRow,
    rowIndex: number,
  ): TngTableStyleInput {
    const cellStyle = column.cellStyle;
    if (cellStyle === undefined || cellStyle === null) {
      return null;
    }

    if (typeof cellStyle === 'function') {
      return cellStyle(row, this.getCellValue(row, column, rowIndex), rowIndex);
    }

    return cellStyle;
  }

  protected resolveHeaderStyle(node: TngTableHeaderCellNode<TRow>): TngTableStyleInput {
    return (node.column as { headerStyle?: TngTableStyleInput }).headerStyle ?? null;
  }

  protected getNodeKey(node: TngTableHeaderCellNode<TRow>): string {
    return `${node.depth}:${node.id}`;
  }

  protected isSortableLeaf(node: TngTableHeaderCellNode<TRow>): boolean {
    return !node.isGroup && (node.column as TngTableLeafColumn<TRow>).sortable === true;
  }

  protected onSortChange(event: TngTableSortChange): void {
    this.sortChange.emit(event);
  }

  private buildHeaderTreeModel(columns: readonly TngTableColumn<TRow>[]): HeaderTreeModel<TRow> {
    const filtered = columns.filter((column) => hasValidId(column) && !isHidden(column));

    const maxDepth = this.computeMaxDepth(filtered);
    const headerRows: TngTableHeaderCellNode<TRow>[][] = Array.from(
      { length: Math.max(1, maxDepth) },
      () => [],
    );
    const leafColumns: TngTableLeafColumn<TRow>[] = [];

    for (const column of filtered) {
      this.walkColumn(column, 0, { maxDepth, headerRows, leafColumns });
    }

    if (isDevMode()) {
      this.validateColumnTree(columns);
    }

    return Object.freeze({
      headerRows: headerRows.map((row) => Object.freeze(row.slice())) as readonly (readonly TngTableHeaderCellNode<TRow>[])[],
      leafColumns: Object.freeze(leafColumns.slice()),
      maxDepth: Math.max(1, maxDepth),
    });
  }

  private buildColumnSpanRuns(
    column: TngTableLeafColumn<TRow>,
    boundaries: readonly TngTableBodySpanRun[],
    state: BodySpanGridState<TRow>,
  ): readonly TngTableBodySpanRun[] {
    const nextBoundaries: TngTableBodySpanRun[] = [];
  
    for (const boundary of boundaries) {
      let runStart = boundary.start;
  
      while (runStart < boundary.end) {
        const runValue = this.getCellValue(state.items[runStart], column, runStart);
  
        let runEnd = runStart + 1;
  
        while (
          runEnd < boundary.end &&
          areGroupValuesEqual(runValue, this.getCellValue(state.items[runEnd], column, runEnd))
        ) {
          runEnd += 1;
        }
  
        const run = Object.freeze({ start: runStart, end: runEnd });
  
        this.applyBodySpanRun(state.rows, column.id, run);
  
        nextBoundaries.push(run);
        runStart = runEnd;
      }
    }
  
    return Object.freeze(nextBoundaries.slice());
  }

  private applyBodySpanRun(
    rows: Record<string, TngTableBodyCellSpan>[],
    columnId: string,
    run: TngTableBodySpanRun,
  ): void {
    const groupSize = run.end - run.start;
  
    rows[run.start][columnId] = Object.freeze({
      groupSize,
      isGroupLeader: true,
      render: true,
      rowspan: groupSize,
    });
  
    for (let rowIndex = run.start + 1; rowIndex < run.end; rowIndex += 1) {
      rows[rowIndex][columnId] = Object.freeze({
        groupSize,
        isGroupLeader: false,
        render: false,
        rowspan: 1,
      });
    }
  }

  private buildBodySpanGrid(
    items: readonly TRow[],
    leafColumns: readonly TngTableLeafColumn<TRow>[],
  ): readonly Readonly<Record<string, TngTableBodyCellSpan>>[] {
    const rows = items.map(() => Object.create(null) as Record<string, TngTableBodyCellSpan>);
  
    for (const row of rows) {
      for (const column of leafColumns) {
        row[column.id] = defaultBodyCellSpan;
      }
    }
  
    if (items.length === 0) {
      return Object.freeze([]);
    }
  
    const state: BodySpanGridState<TRow> = { items, rows };
  
    let boundaries: readonly TngTableBodySpanRun[] = [
      Object.freeze({ start: 0, end: items.length }),
    ];
  
    for (const column of leafColumns) {
      if (column.groupBy !== true) continue;
  
      boundaries = this.buildColumnSpanRuns(column, boundaries, state);
    }
  
    return Object.freeze(rows.map((row) => Object.freeze({ ...row })));
  }

  private walkLeafColumn(
  leaf: TngTableLeafColumn<TRow>,
  depth: number,
  context: TableColumnWalkContext<TRow>,
): number {
  context.leafColumns.push(leaf);

  const rowspan = Math.max(1, context.maxDepth - depth);

  context.headerRows[depth].push(
    Object.freeze({
      column: leaf,
      id: leaf.id,
      label: getColumnLabelText(leaf),
      isGroup: false,
      depth,
      colspan: 1,
      rowspan,
    }),
  );

  return 1;
}

  private walkColumn(
    column: TngTableColumn<TRow>,
    depth: number,
    context: TableColumnWalkContext<TRow>,
  ): number {
    if (!isGroupColumn(column)) {
      return this.walkLeafColumn(column, depth, context);
    }
  
    const visibleChildren = column.children.filter(
      (child) => hasValidId(child) && !isHidden(child),
    );
  
    // Empty group after filtering: skip entirely.
    if (visibleChildren.length === 0) return 0;
  
    let colspan = 0;
  
    for (const child of visibleChildren) {
      colspan += this.walkColumn(child, depth + 1, context);
    }
  
    if (colspan === 0) return 0;
  
    context.headerRows[depth].push(
      Object.freeze({
        column,
        id: column.id,
        label: getColumnLabelText(column),
        isGroup: true,
        depth,
        colspan,
        rowspan: 1,
      }),
    );
  
    return colspan;
  }

  private computeMaxDepth(columns: readonly TngTableColumn<TRow>[]): number {
    let max = 0;
    const walk = (column: TngTableColumn<TRow>, depth: number): void => {
      if (isGroupColumn(column)) {
        const visibleChildren = column.children.filter(
          (child) => hasValidId(child) && !isHidden(child),
        );
        if (visibleChildren.length === 0) {
          return;
        }
        for (const child of visibleChildren) {
          walk(child, depth + 1);
        }
      } else {
        max = Math.max(max, depth + 1);
      }
    };
    for (const column of columns) {
      if (hasValidId(column) && !isHidden(column)) {
        walk(column, 0);
      }
    }
    return max;
  }

  private validateLeafColumn(column: TngTableLeafColumn<TRow>): void {
    if (column.groupBy === true && column.sticky !== null && column.sticky !== undefined) {
      console.warn(
        `[tng-table] Column "${column.id}" combines "groupBy" and "sticky"; sticky offsets may not align with merged body cells.`,
      );
    }
  }

  private validateGroupColumnProperties(column: TngTableColumn<TRow>): void {
    const groupExtras = column as unknown as Record<string, unknown>;
  
    const leafOnlyProps = [
      'accessor',
      'cellClass',
      'cellStyle',
      'groupBy',
      'groupByAlign',
      'sortable',
      'sticky',
      'truncate',
      'width',
      'align',
    ];
  
    for (const leafOnlyProp of leafOnlyProps) {
      if (groupExtras[leafOnlyProp] !== undefined) {
        console.warn(
          `[tng-table] Group column "${column.id}" defines leaf-only property "${leafOnlyProp}"; it will be ignored.`,
        );
      }
    }
  }

  private validateColumn(
    column: TngTableColumn<TRow>,
    seenIds: Set<string>,
  ): void {
    if (!hasValidId(column)) return;
  
    if (seenIds.has(column.id)) {
      console.warn(`[tng-table] Duplicate column id "${column.id}" detected in column tree.`);
    } else {
      seenIds.add(column.id);
    }
  
    if ('children' in column && column.children !== undefined && !Array.isArray(column.children)) {
      console.warn(`[tng-table] Column "${column.id}" declares "children" but it is not an array.`);
    }
  
    if (isGroupColumn(column)) {
      this.validateGroupColumnProperties(column);
  
      for (const child of column.children) {
        this.validateColumn(child, seenIds);
      }
  
      return;
    }
  
    this.validateLeafColumn(column);
  }

  private validateColumnTree(columns: readonly TngTableColumn<TRow>[]): void {
    const seenIds = new Set<string>();
  
    for (const column of columns) {
      this.validateColumn(column, seenIds);
    }
  }
}

export { TngTableComponent as TngTable };
export { TngTableCellTemplate as TngTableCellTpl };
export { TngTableHeaderTemplate as TngTableHeaderTpl };
