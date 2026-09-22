
import { Component, computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { TngTableScrollAxis, TngTableSortChange } from '@tailng-ui/primitives';
import { existsSync, readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  TngTable,
  TngTableCellTemplate,
  type TngTableClassInput,
  type TngTableColumn,
  TngTableComponent,
  TngTableHeaderTemplate,
  type TngTableRowClassFn,
  type TngTableRowStyleFn,
  type TngTableStyleInput,
} from './tng-table.component';

const tableComponentStylesPath = existsSync(
  'libs/tailng-ui/components/src/lib/layout/table/tng-table.component.css',
)
  ? 'libs/tailng-ui/components/src/lib/layout/table/tng-table.component.css'
  : 'src/lib/layout/table/tng-table.component.css';
const tableComponentStyles = readFileSync(tableComponentStylesPath, 'utf8');

type TableRow = Readonly<{
  id: string;
  name: string;
  status: string;
  total: number;
}>;

type PersonRow = Readonly<{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  anniversary: string;
  notes: string;
}>;

type DepartmentRow = Readonly<{
  id: string;
  department: string;
  region: string;
  employee: string;
  salary: number;
}>;

@Component({
  imports: [TngTableComponent, TngTableCellTemplate, TngTableHeaderTemplate],
  template: `
    <tng-table
      [ariaLabel]="ariaLabel()"
      [columns]="columns()"
      [density]="density()"
      [error]="error()"
      [items]="items()"
      [loading]="loading()"
      [scrollAxis]="scrollAxis()"
      [sortActive]="sortActive()"
      [sortDirection]="sortDirection()"
      [stickyHeader]="stickyHeader()"
      (sortChange)="onSortChange($event)"
    >
      <ng-template tngTableHeaderTemplate="status" let-label="label">{{ label }} label</ng-template>
      <ng-template tngTableCellTemplate="status" let-row="row">
        <strong data-testid="status-cell">{{ row.status }}</strong>
      </ng-template>
    </tng-table>
  `,
})
class TableHostComponent {
  public readonly ariaLabel = signal('Orders');
  public readonly columns = signal<readonly TngTableColumn<TableRow>[]>([
    { id: 'name', label: 'Name', sortable: true },
    { id: 'status', label: 'Status' },
    { id: 'total', label: 'Total', align: 'end', accessor: (row) => row.total },
  ]);
  public readonly density = signal<'compact' | 'comfortable'>('comfortable');
  public readonly error = signal(false);
  public readonly items = signal<readonly TableRow[]>([
    { id: 'a', name: 'Alpha', status: 'Ready', total: 12 },
    { id: 'b', name: 'Beta', status: 'Draft', total: 7 },
  ]);
  public readonly loading = signal(false);
  public readonly scrollAxis = signal<TngTableScrollAxis>('x');
  public readonly sortActive = signal<string | null | undefined>(undefined);
  public readonly sortDirection = signal<'asc' | 'desc' | null | undefined>(undefined);
  public readonly stickyHeader = signal(false);
  public readonly sortChanges: TngTableSortChange[] = [];

  public onSortChange(event: TngTableSortChange): void {
    this.sortChanges.push(event);
  }
}

@Component({
  imports: [TngTableComponent, TngTableCellTemplate, TngTableHeaderTemplate],
  template: `
    <tng-table [columns]="columns()" [items]="items()" (sortChange)="onSortChange($event)">
      <ng-template
        tngTableHeaderTemplate="person"
        let-isGroup="isGroup"
        let-depth="depth"
        let-colspan="colspan"
        let-rowspan="rowspan"
        let-label="label"
      >
        <span
          data-testid="person-group-header"
          [attr.data-is-group]="isGroup"
          [attr.data-depth]="depth"
          [attr.data-colspan]="colspan"
          [attr.data-rowspan]="rowspan"
          >{{ label }}</span
        >
      </ng-template>
      <ng-template
        tngTableHeaderTemplate="firstName"
        let-isGroup="isGroup"
        let-depth="depth"
        let-colspan="colspan"
        let-rowspan="rowspan"
        let-label="label"
      >
        <span
          data-testid="first-name-leaf-header"
          [attr.data-is-group]="isGroup"
          [attr.data-depth]="depth"
          [attr.data-colspan]="colspan"
          [attr.data-rowspan]="rowspan"
          >{{ label }}</span
        >
      </ng-template>
    </tng-table>
  `,
})
class GroupedTableHostComponent {
  public readonly columns = signal<readonly TngTableColumn<PersonRow>[]>([
    {
      id: 'person',
      label: 'Person',
      children: [
        { id: 'firstName', label: 'First Name', sortable: true },
        { id: 'lastName', label: 'Last Name' },
        { id: 'email', label: 'Email' },
      ],
    },
    {
      id: 'dates',
      label: 'Dates',
      children: [
        { id: 'dob', label: 'Date of Birth' },
        { id: 'anniversary', label: 'Anniversary' },
      ],
    },
    { id: 'notes', label: 'Notes' },
  ]);

  public readonly items = signal<readonly PersonRow[]>([
    {
      id: '1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      dob: '1815-12-10',
      anniversary: '1835-07-08',
      notes: 'mathematician',
    },
    {
      id: '2',
      firstName: 'Alan',
      lastName: 'Turing',
      email: 'alan@example.com',
      dob: '1912-06-23',
      anniversary: '—',
      notes: 'computer scientist',
    },
  ]);

  public readonly sortChanges: TngTableSortChange[] = [];

  public onSortChange(event: TngTableSortChange): void {
    this.sortChanges.push(event);
  }
}

@Component({
  imports: [TngTableComponent, TngTableCellTemplate],
  template: `
    <tng-table [columns]="columns()" [items]="items()">
      <ng-template
        tngTableCellTemplate="department"
        let-value
        let-groupSize="groupSize"
        let-isGroupLeader="isGroupLeader"
      >
        <span
          data-testid="department-template"
          [attr.data-group-size]="groupSize"
          [attr.data-group-leader]="isGroupLeader"
          >{{ value }}</span
        >
      </ng-template>
    </tng-table>
  `,
})
class GroupedBodyTableHostComponent {
  public readonly columns = signal<readonly TngTableColumn<DepartmentRow>[]>([
    { id: 'department', label: 'Department', groupBy: true },
    { id: 'employee', label: 'Employee' },
    { id: 'salary', label: 'Salary', align: 'end' },
  ]);

  public readonly items = signal<readonly DepartmentRow[]>([
    { id: '1', department: 'Engineering', region: 'NA', employee: 'Alice', salary: 90_000 },
    { id: '2', department: 'Engineering', region: 'NA', employee: 'Bob', salary: 85_000 },
    { id: '3', department: 'Engineering', region: 'EU', employee: 'Carol', salary: 95_000 },
    { id: '4', department: 'Sales', region: 'NA', employee: 'Dave', salary: 70_000 },
    { id: '5', department: 'Sales', region: 'EU', employee: 'Eve', salary: 72_000 },
    { id: '6', department: 'HR', region: 'NA', employee: 'Frank', salary: 60_000 },
  ]);
}

@Component({
  imports: [TngTableComponent],
  template: `
    <tng-table
      [columns]="columns()"
      [items]="items()"
      [rowClass]="rowClass()"
      [rowStyle]="rowStyle()"
    ></tng-table>
  `,
})
class ClassHookTableHostComponent {
  public readonly rowClass = signal<TngTableRowClassFn<TableRow> | null>(null);
  public readonly rowStyle = signal<TngTableRowStyleFn<TableRow> | null>(null);
  public readonly cellClass = signal<
    TngTableClassInput | ((row: TableRow, value: unknown, index: number) => TngTableClassInput)
  >('money-cell');
  public readonly cellStyle = signal<
    TngTableStyleInput | ((row: TableRow, value: unknown, index: number) => TngTableStyleInput)
  >(null);
  public readonly headerClass = signal<TngTableClassInput>('name-head');
  public readonly headerStyle = signal<TngTableStyleInput>(null);

  // Columns derive from the class signals so updating a hook re-renders the table.
  public readonly columns = computed<readonly TngTableColumn<TableRow>[]>(() => [
    {
      id: 'name',
      label: 'Name',
      headerClass: this.headerClass(),
      headerStyle: this.headerStyle(),
    },
    { id: 'status', label: 'Status' },
    {
      id: 'total',
      label: 'Total',
      align: 'end',
      cellClass: this.cellClass(),
      cellStyle: this.cellStyle(),
    },
  ]);

  public readonly items = signal<readonly TableRow[]>([
    { id: 'a', name: 'Alpha', status: 'Ready', total: 12 },
    { id: 'b', name: 'Beta', status: 'Draft', total: 7 },
  ]);
}

function createClassHookFixture() {
  const fixture = TestBed.configureTestingModule({
    imports: [ClassHookTableHostComponent],
  }).createComponent(ClassHookTableHostComponent);

  fixture.detectChanges();
  return fixture;
}

function createFixture() {
  const fixture = TestBed.configureTestingModule({
    imports: [TableHostComponent],
  }).createComponent(TableHostComponent);

  fixture.detectChanges();
  return fixture;
}

function createGroupedFixture() {
  const fixture = TestBed.configureTestingModule({
    imports: [GroupedTableHostComponent],
  }).createComponent(GroupedTableHostComponent);

  fixture.detectChanges();
  return fixture;
}

function createGroupedBodyFixture() {
  const fixture = TestBed.configureTestingModule({
    imports: [GroupedBodyTableHostComponent],
  }).createComponent(GroupedBodyTableHostComponent);

  fixture.detectChanges();
  return fixture;
}

function resolveHost(source: { nativeElement: unknown } | Element): Element {
  return 'nativeElement' in source ? (source.nativeElement as Element) : source;
}

function query<TElement extends Element>(
  source: { nativeElement: unknown } | Element,
  selector: string,
): TElement {
  const host = resolveHost(source);
  const element = host.querySelector(selector);
  if (element === null) {
    throw new Error(`Expected element for selector "${selector}".`);
  }

  return element as TElement;
}

function queryAll<TElement extends Element>(
  source: { nativeElement: unknown } | Element,
  selector: string,
): readonly TElement[] {
  const host = resolveHost(source);
  return Array.from(host.querySelectorAll(selector)) as readonly TElement[];
}

function click(element: HTMLElement): void {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function findStyleBlock(selectorPattern: RegExp): string {
  const match = selectorPattern.exec(tableComponentStyles);
  if (match?.[1] === undefined) {
    throw new Error(`Expected style block matching ${selectorPattern}.`);
  }

  return match[1];
}

function expectDeclaration(styleBlock: string, property: string, value: string): void {
  expect(styleBlock).toMatch(new RegExp(`${property}\\s*:\\s*${value}\\s*;`));
}

describe('tng-table component', () => {
  it('exports the component alias', () => {
    expect(TngTable).toBe(TngTableComponent);
  });

  it('renders a native primitive table with headers and rows', () => {
    const fixture = createFixture();

    expect(query<HTMLDivElement>(fixture, '[data-slot="table-scroll"]')).toBeTruthy();
    const table = query<HTMLTableElement>(fixture, 'table.tng-table');
    expect(table.getAttribute('data-slot')).toBe('table');
    expect(table.getAttribute('aria-label')).toBe('Orders');
    expect(table.getAttribute('data-has-header')).toBe('');
    expect(queryAll<HTMLTableCellElement>(fixture, 'tbody td')).toHaveLength(6);
    expect(
      query<HTMLTableCellElement>(fixture, 'td[data-column-id="name"]').textContent?.trim(),
    ).toBe('Alpha');
    expect(
      query<HTMLTableCellElement>(fixture, 'td[data-column-id="total"]').textContent?.trim(),
    ).toBe('12');
  });

  it('exposes stable data slots for table structure and states', () => {
    const fixture = createFixture();

    expect(query<HTMLTableSectionElement>(fixture, 'thead').getAttribute('data-slot')).toBe(
      'table-header',
    );
    expect(query<HTMLTableSectionElement>(fixture, 'tbody').getAttribute('data-slot')).toBe(
      'table-body',
    );
    expect(query<HTMLTableRowElement>(fixture, 'thead tr').getAttribute('data-slot')).toBe(
      'table-header-row',
    );
    expect(query<HTMLTableRowElement>(fixture, 'tbody tr').getAttribute('data-slot')).toBe(
      'table-row',
    );
    expect(query<HTMLTableCellElement>(fixture, 'thead th').getAttribute('data-slot')).toBe(
      'table-header-cell',
    );
    expect(query<HTMLTableCellElement>(fixture, 'tbody td').getAttribute('data-slot')).toBe(
      'table-cell',
    );

    fixture.componentInstance.items.set([]);
    fixture.detectChanges();

    expect(query<HTMLTableCellElement>(fixture, 'tbody td').getAttribute('data-slot')).toBe(
      'table-state-cell',
    );
  });

  it('uses projected header and cell templates', () => {
    const fixture = createFixture();

    expect(
      query<HTMLTableCellElement>(fixture, 'th[data-column-id="status"]').textContent?.trim(),
    ).toBe('Status label');
    expect(query<HTMLElement>(fixture, '[data-testid="status-cell"]').textContent?.trim()).toBe(
      'Ready',
    );
  });

  it('emits sort changes from sortable headers', () => {
    const fixture = createFixture();

    click(query<HTMLTableCellElement>(fixture, 'th[data-column-id="name"]'));
    fixture.detectChanges();

    expect(fixture.componentInstance.sortChanges).toEqual([
      {
        activeColumnId: 'name',
        direction: 'asc',
      },
    ]);
  });

  it('renders empty, loading, and error states', () => {
    const fixture = createFixture();

    fixture.componentInstance.items.set([]);
    fixture.detectChanges();
    expect(query<HTMLTableCellElement>(fixture, 'tbody td').textContent?.trim()).toBe('No results');
    expect(query<HTMLTableElement>(fixture, 'table').hasAttribute('data-empty')).toBe(true);

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(query<HTMLTableCellElement>(fixture, 'tbody td').textContent?.trim()).toBe('Loading');
    expect(query<HTMLTableElement>(fixture, 'table').hasAttribute('data-loading')).toBe(true);

    fixture.componentInstance.loading.set(false);
    fixture.componentInstance.error.set(true);
    fixture.detectChanges();
    expect(query<HTMLTableCellElement>(fixture, 'tbody td').textContent?.trim()).toBe('Error');
    expect(query<HTMLTableElement>(fixture, 'table').hasAttribute('data-error')).toBe(true);
  });

  it('reflects scroll axis and sticky header state on the scroll wrapper', () => {
    const fixture = createFixture();
    const scroll = query<HTMLDivElement>(fixture, '[data-slot="table-scroll"]');

    expect(scroll.getAttribute('data-scroll-axis')).toBe('x');
    expect(scroll.style.overflowX).toBe('var(--tng-table-scroll-overflow-x, auto)');
    expect(scroll.style.overflowY).toBe('hidden');
    expect(scroll.hasAttribute('data-sticky-header')).toBe(false);

    fixture.componentInstance.scrollAxis.set('both');
    fixture.componentInstance.stickyHeader.set(true);
    fixture.detectChanges();

    expect(scroll.getAttribute('data-scroll-axis')).toBe('both');
    expect(scroll.getAttribute('data-sticky-header')).toBe('');
    expect(scroll.style.overflowX).toBe('var(--tng-table-scroll-overflow-x, auto)');
    expect(scroll.style.overflowY).toBe('var(--tng-table-scroll-overflow-y, auto)');
  });

  it('defines top body alignment while preserving header, state, and horizontal alignment styles', () => {
    const sharedCellStyle = findStyleBlock(
      /\.tng-table__header-cell,\s*\.tng-table__cell,\s*\.tng-table__state-cell\s*\{([^}]*)\}/,
    );
    expectDeclaration(sharedCellStyle, 'text-align', 'start');
    expect(sharedCellStyle).not.toMatch(/vertical-align\s*:/);

    const headerStateStyle = findStyleBlock(
      /\.tng-table__header-cell,\s*\.tng-table__state-cell\s*\{([^}]*)\}/,
    );
    expectDeclaration(headerStateStyle, 'vertical-align', 'middle');

    const bodyCellStyle = findStyleBlock(/\.tng-table__cell\s*\{([^}]*)\}/);
    expectDeclaration(bodyCellStyle, 'vertical-align', 'top');

    const groupTopStyle = findStyleBlock(
      /\.tng-table__cell\[data-group-align='top'\]\s*\{([^}]*)\}/,
    );
    expectDeclaration(groupTopStyle, 'vertical-align', 'top');

    const groupMiddleStyle = findStyleBlock(
      /\.tng-table__cell\[data-group-align='middle'\]\s*\{([^}]*)\}/,
    );
    expectDeclaration(groupMiddleStyle, 'vertical-align', 'middle');

    const centerAlignStyle = findStyleBlock(
      /\.tng-table__header-cell\[data-align='center'\],\s*\.tng-table__cell\[data-align='center'\]\s*\{([^}]*)\}/,
    );
    expectDeclaration(centerAlignStyle, 'text-align', 'center');

    const endAlignStyle = findStyleBlock(
      /\.tng-table__header-cell\[data-align='end'\],\s*\.tng-table__cell\[data-align='end'\]\s*\{([^}]*)\}/,
    );
    expectDeclaration(endAlignStyle, 'text-align', 'end');

    const stateCellStyle = findStyleBlock(/(?<!,)\n\.tng-table__state-cell\s*\{([^}]*)\}/);
    expectDeclaration(stateCellStyle, 'text-align', 'center');
  });

  it('defines scroll, table sizing, and sticky header CSS variable hooks', () => {
    const hostStyle = findStyleBlock(/:host\s*\{([^}]*)\}/);
    expectDeclaration(hostStyle, '--tng-table-scroll-max-height', 'none');
    expectDeclaration(hostStyle, '--tng-table-scroll-overflow-x', 'auto');
    expectDeclaration(hostStyle, '--tng-table-scroll-overflow-y', 'auto');
    expectDeclaration(hostStyle, '--tng-table-min-width', '100%');
    expectDeclaration(hostStyle, '--tng-table-header-z-index', '2');

    const scrollStyle = findStyleBlock(
      /\.tng-table__scroll,\s*\[data-slot='table-scroll'\]\s*\{([^}]*)\}/,
    );
    expectDeclaration(scrollStyle, 'max-height', 'var\\(--tng-table-scroll-max-height\\)');
    expectDeclaration(scrollStyle, 'min-width', '0');
    expectDeclaration(scrollStyle, 'overflow-x', 'var\\(--tng-table-scroll-overflow-x\\)');
    expectDeclaration(scrollStyle, 'overflow-y', 'var\\(--tng-table-scroll-overflow-y\\)');

    const tableStyle = findStyleBlock(/\.tng-table,\s*\[data-slot='table'\]\s*\{([^}]*)\}/);
    expectDeclaration(tableStyle, 'min-width', 'var\\(--tng-table-min-width\\)');

    const stickyHeaderStyle = findStyleBlock(
      /\[data-slot='table-scroll'\]\[data-sticky-header\]\s*\[data-slot='table-header-cell'\]\s*\{([^}]*)\}/,
    );
    expect(stickyHeaderStyle).toMatch(/background\s*:\s*var\(/);
    expectDeclaration(stickyHeaderStyle, 'position', 'sticky');
    expectDeclaration(stickyHeaderStyle, 'top', '0');
    expectDeclaration(stickyHeaderStyle, 'z-index', 'var\\(--tng-table-header-z-index\\)');

    const stickyCellStyle = findStyleBlock(
      /\.tng-table\s*\[data-sticky\]:not\(\[data-sticky-header\]\)\s*\{([^}]*)\}/,
    );
    expectDeclaration(stickyCellStyle, 'background', 'inherit');
  });

  it('applies density and sticky header configuration', () => {
    const fixture = createFixture();

    fixture.componentInstance.density.set('compact');
    fixture.componentInstance.stickyHeader.set(true);
    fixture.detectChanges();

    expect(query<HTMLTableElement>(fixture, 'table').getAttribute('data-density')).toBe('compact');
    expect(query<HTMLTableSectionElement>(fixture, 'thead').hasAttribute('data-sticky')).toBe(true);
  });
});

describe('tng-table grouped headers', () => {
  describe('column tree parsing', () => {
    it('supports existing flat column configuration without breaking current behavior', () => {
      const fixture = createFixture();

      expect(queryAll(fixture, 'thead tr')).toHaveLength(1);
      expect(queryAll(fixture, 'thead th')).toHaveLength(3);
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(3);
    });

    it('flattens only leaf columns for body rendering', () => {
      const fixture = createGroupedFixture();

      const bodyRows = queryAll(fixture, 'tbody tr');
      expect(bodyRows).toHaveLength(2);
      expect(queryAll(bodyRows[0], 'td')).toHaveLength(6);
      const ids = queryAll<HTMLTableCellElement>(bodyRows[0], 'td').map((cell) =>
        cell.getAttribute('data-column-id'),
      );
      expect(ids).toEqual(['firstName', 'lastName', 'email', 'dob', 'anniversary', 'notes']);
    });

    it('excludes group columns from body rendering', () => {
      const fixture = createGroupedFixture();

      expect(query(fixture, 'tbody').querySelector('td[data-column-id="person"]')).toBeNull();
      expect(query(fixture, 'tbody').querySelector('td[data-column-id="dates"]')).toBeNull();
    });

    it('preserves leaf column order from the nested column tree', () => {
      const fixture = createGroupedFixture();

      const cols = queryAll<HTMLTableColElement>(fixture, 'colgroup col');
      expect(cols).toHaveLength(6);

      const bottomLeafIds = queryAll<HTMLTableCellElement>(fixture, 'thead tr:last-child th').map(
        (th) => th.getAttribute('data-column-id'),
      );
      expect(bottomLeafIds).toEqual(['firstName', 'lastName', 'email', 'dob', 'anniversary']);
    });

    it('supports deeply nested column groups', () => {
      @Component({
        imports: [TngTableComponent],
        template: `<tng-table [columns]="columns()" [items]="[]"></tng-table>`,
      })
      class DeepHost {
        public readonly columns = signal<readonly TngTableColumn<{ a: number }>[]>([
          {
            id: 'outer',
            label: 'Outer',
            children: [
              {
                id: 'mid',
                label: 'Mid',
                children: [
                  { id: 'leaf1', label: 'Leaf 1' },
                  { id: 'leaf2', label: 'Leaf 2' },
                ],
              },
            ],
          },
        ]);
      }

      const fixture = TestBed.configureTestingModule({
        imports: [DeepHost],
      }).createComponent(DeepHost);
      fixture.detectChanges();

      expect(queryAll(fixture, 'thead tr')).toHaveLength(3);
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(2);
    });

    it('ignores hidden columns when building leaf columns', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        { id: 'visible', label: 'Visible' },
        { id: 'hidden', label: 'Hidden', hidden: true },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      expect(queryAll(fixture, 'colgroup col')).toHaveLength(1);
      expect(queryAll(fixture, 'thead th')).toHaveLength(1);
    });

    it('excludes empty group columns from rendered header rows', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        { id: 'empty-group', label: 'Empty', children: [] } as TngTableColumn<PersonRow>,
        { id: 'visible', label: 'Visible' },
      ]);
      fixture.detectChanges();

      // children: [] is treated as a leaf per the design rule, so it renders as a single column.
      const headerIds = queryAll<HTMLTableCellElement>(fixture, 'thead th').map((th) =>
        th.getAttribute('data-column-id'),
      );
      expect(headerIds).toContain('empty-group');
      expect(headerIds).toContain('visible');
    });

    it('calculates table colspan using visible leaf column count', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.items.set([]);
      fixture.detectChanges();

      const stateCell = query<HTMLTableCellElement>(fixture, 'tbody td.tng-table__state-cell');
      expect(stateCell.getAttribute('colspan')).toBe('6');
    });
  });

  describe('header rows', () => {
    it('renders a single header row for flat columns', () => {
      const fixture = createFixture();
      expect(queryAll(fixture, 'thead tr')).toHaveLength(1);
    });

    it('renders multiple header rows for nested grouped columns', () => {
      const fixture = createGroupedFixture();
      expect(queryAll(fixture, 'thead tr')).toHaveLength(2);
    });

    it('calculates correct `colspan` for group header cells', () => {
      const fixture = createGroupedFixture();
      const personHeader = query<HTMLTableCellElement>(
        fixture,
        'thead th[data-column-id="person"]',
      );
      const datesHeader = query<HTMLTableCellElement>(fixture, 'thead th[data-column-id="dates"]');
      expect(personHeader.getAttribute('colspan')).toBe('3');
      expect(datesHeader.getAttribute('colspan')).toBe('2');
    });

    it('calculates correct `rowspan` for leaf header cells', () => {
      const fixture = createGroupedFixture();
      const notesHeader = query<HTMLTableCellElement>(fixture, 'thead th[data-column-id="notes"]');
      // Notes is a top-level leaf in a 2-deep tree → should rowspan 2.
      expect(notesHeader.getAttribute('rowspan')).toBe('2');

      const firstNameHeader = query<HTMLTableCellElement>(
        fixture,
        'thead th[data-column-id="firstName"]',
      );
      expect(firstNameHeader.getAttribute('rowspan')).toBeNull();
    });

    it('renders group headers above their leaf columns', () => {
      const fixture = createGroupedFixture();
      const firstRowIds = queryAll<HTMLTableCellElement>(fixture, 'thead tr:first-child th').map(
        (th) => th.getAttribute('data-column-id'),
      );
      expect(firstRowIds).toEqual(['person', 'dates', 'notes']);
    });

    it('renders mixed grouped and non-grouped columns in the same table', () => {
      const fixture = createGroupedFixture();
      const topRow = queryAll<HTMLTableCellElement>(fixture, 'thead tr:first-child th');
      const groupCount = topRow.filter((th) => th.hasAttribute('data-header-group')).length;
      const leafCount = topRow.filter((th) => !th.hasAttribute('data-header-group')).length;
      expect(groupCount).toBe(2);
      expect(leafCount).toBe(1);
    });

    it('keeps standalone leaf headers stretched across remaining header depth', () => {
      const fixture = createGroupedFixture();
      const notesHeader = query<HTMLTableCellElement>(fixture, 'thead th[data-column-id="notes"]');
      expect(notesHeader.getAttribute('rowspan')).toBe('2');
    });

    it('does not render body cells for group headers', () => {
      const fixture = createGroupedFixture();
      expect(query(fixture, 'tbody').querySelector('td[data-column-id="person"]')).toBeNull();
    });

    it('renders exactly maxDepth header rows', () => {
      const fixture = createGroupedFixture();
      expect(queryAll(fixture, 'thead tr')).toHaveLength(2);
    });
  });

  describe('sorting', () => {
    it('allows sorting only on leaf columns', () => {
      const fixture = createGroupedFixture();

      click(query<HTMLTableCellElement>(fixture, 'th[data-column-id="firstName"]'));
      fixture.detectChanges();

      expect(fixture.componentInstance.sortChanges).toEqual([
        { activeColumnId: 'firstName', direction: 'asc' },
      ]);
    });

    it('does not attach sort behavior to group header cells', () => {
      const fixture = createGroupedFixture();
      const groupHeader = query<HTMLTableCellElement>(fixture, 'th[data-column-id="person"]');
      expect(groupHeader.getAttribute('data-slot')).not.toBe('table-sort-header');
      expect(groupHeader.hasAttribute('aria-sort')).toBe(false);
    });

    it('does not trigger sort when clicking a group header', () => {
      const fixture = createGroupedFixture();
      click(query<HTMLTableCellElement>(fixture, 'th[data-column-id="person"]'));
      fixture.detectChanges();
      expect(fixture.componentInstance.sortChanges).toHaveLength(0);
    });

    it('preserves existing sort behavior for flat columns', () => {
      const fixture = createFixture();
      click(query<HTMLTableCellElement>(fixture, 'th[data-column-id="name"]'));
      fixture.detectChanges();
      expect(fixture.componentInstance.sortChanges).toHaveLength(1);
    });

    it('renders sort indicator only for sortable leaf headers', () => {
      const fixture = createGroupedFixture();
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="firstName"]').getAttribute(
          'data-slot',
        ),
      ).toBe('table-header-cell');
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="firstName"]').hasAttribute(
          'data-sort-active',
        ),
      ).toBe(false);
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="email"]').getAttribute(
          'data-slot',
        ),
      ).toBe('table-header-cell');
    });

    it('ignores `sortable` on group columns', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'grp',
          label: 'Group',
          sortable: true,
          children: [{ id: 'leaf', label: 'Leaf' }],
        } as unknown as TngTableColumn<PersonRow>,
      ]);
      fixture.detectChanges();

      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="grp"]').getAttribute('data-slot'),
      ).not.toBe('table-sort-header');
    });
  });

  describe('sticky columns', () => {
    it('applies sticky behavior only to visible leaf columns', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'person',
          label: 'Person',
          children: [
            { id: 'firstName', label: 'First', sticky: 'start' },
            { id: 'lastName', label: 'Last' },
          ],
        },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="firstName"]').getAttribute(
          'data-sticky-side',
        ),
      ).toBe('start');
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="person"]').hasAttribute(
          'data-sticky-side',
        ),
      ).toBe(false);
    });

    it('preserves sticky left behavior for flat columns', () => {
      const fixture = createFixture();
      fixture.componentInstance.columns.set([
        { id: 'name', label: 'Name', sticky: 'start' },
        { id: 'status', label: 'Status' },
      ]);
      fixture.detectChanges();

      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="name"]').getAttribute(
          'data-sticky-side',
        ),
      ).toBe('start');
    });

    it('preserves sticky right behavior for flat columns', () => {
      const fixture = createFixture();
      fixture.componentInstance.columns.set([
        { id: 'name', label: 'Name' },
        { id: 'status', label: 'Status', sticky: 'end' },
      ]);
      fixture.detectChanges();

      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="status"]').getAttribute(
          'data-sticky-side',
        ),
      ).toBe('end');
    });

    it('does not apply sticky directive to group header cells', () => {
      const fixture = createGroupedFixture();
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="person"]').hasAttribute(
          'data-sticky',
        ),
      ).toBe(false);
    });

    it('keeps grouped header layout valid when leaf columns are sticky', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'person',
          label: 'Person',
          children: [
            { id: 'firstName', label: 'First', sticky: 'start' },
            { id: 'lastName', label: 'Last' },
          ],
        },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      const personHeader = query<HTMLTableCellElement>(fixture, 'th[data-column-id="person"]');
      expect(personHeader.getAttribute('colspan')).toBe('2');
    });
  });

  describe('colgroup and width', () => {
    it('renders one <col> per visible leaf column', () => {
      const fixture = createGroupedFixture();
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(6);
    });

    it('does not render <col> for group columns', () => {
      const fixture = createGroupedFixture();
      // 2 groups + 5 grouped leaves + 1 standalone leaf = 8 columns conceptually,
      // but colgroup should only carry the 6 leaves.
      const cols = queryAll(fixture, 'colgroup col');
      expect(cols).toHaveLength(6);
    });

    it('applies width settings from leaf columns only', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'person',
          label: 'Person',
          children: [
            { id: 'firstName', label: 'First', width: 200 },
            { id: 'lastName', label: 'Last', width: '12rem' },
          ],
        },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      const cols = queryAll<HTMLTableColElement>(fixture, 'colgroup col');
      expect(cols[0].style.width).toBe('200px');
      expect(cols[1].style.width).toBe('12rem');
    });

    it('preserves column width order after flattening nested columns', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'a',
          label: 'A',
          children: [
            { id: 'a1', label: 'A1', width: 100 },
            { id: 'a2', label: 'A2', width: 110 },
          ],
        },
        { id: 'b', label: 'B', width: 300 },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      const widths = queryAll<HTMLTableColElement>(fixture, 'colgroup col').map(
        (col) => col.style.width,
      );
      expect(widths).toEqual(['100px', '110px', '300px']);
    });

    it('keeps grouped header colspan aligned with colgroup leaf count', () => {
      const fixture = createGroupedFixture();
      const personHeader = query<HTMLTableCellElement>(fixture, 'th[data-column-id="person"]');
      const datesHeader = query<HTMLTableCellElement>(fixture, 'th[data-column-id="dates"]');
      const personColspan = Number(personHeader.getAttribute('colspan') ?? '1');
      const datesColspan = Number(datesHeader.getAttribute('colspan') ?? '1');
      const standaloneLeafCount = 1; // notes
      const totalCols = personColspan + datesColspan + standaloneLeafCount;
      expect(totalCols).toBe(queryAll(fixture, 'colgroup col').length);
    });
  });

  describe('empty / loading / error state colspan', () => {
    it('sets loading row colspan to visible leaf column count', () => {
      const fixture = createFixture();
      fixture.componentInstance.loading.set(true);
      fixture.detectChanges();
      expect(query(fixture, 'tbody td').getAttribute('colspan')).toBe('3');
    });

    it('sets empty row colspan to visible leaf column count', () => {
      const fixture = createFixture();
      fixture.componentInstance.items.set([]);
      fixture.detectChanges();
      expect(query(fixture, 'tbody td').getAttribute('colspan')).toBe('3');
    });

    it('sets error row colspan to visible leaf column count', () => {
      const fixture = createFixture();
      fixture.componentInstance.error.set(true);
      fixture.detectChanges();
      expect(query(fixture, 'tbody td').getAttribute('colspan')).toBe('3');
    });

    it('updates fallback row colspan when visible leaf columns change', () => {
      const fixture = createFixture();
      fixture.componentInstance.items.set([]);
      fixture.detectChanges();
      expect(query(fixture, 'tbody td').getAttribute('colspan')).toBe('3');

      fixture.componentInstance.columns.set([{ id: 'name', label: 'Name' }]);
      fixture.detectChanges();
      expect(query(fixture, 'tbody td').getAttribute('colspan')).toBe('1');
    });

    it('does not count group headers in fallback colspan', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.items.set([]);
      fixture.detectChanges();
      // 6 leaves total in default tree.
      expect(query(fixture, 'tbody td.tng-table__state-cell').getAttribute('colspan')).toBe('6');
    });
  });

  describe('header templates and classes', () => {
    it('supports custom header template for leaf columns', () => {
      const fixture = createGroupedFixture();
      expect(query(fixture, '[data-testid="first-name-leaf-header"]')).toBeTruthy();
    });

    it('supports custom header template for group columns', () => {
      const fixture = createGroupedFixture();
      expect(query(fixture, '[data-testid="person-group-header"]')).toBeTruthy();
    });

    it('provides `isGroup` in header template context', () => {
      const fixture = createGroupedFixture();
      expect(
        query(fixture, '[data-testid="person-group-header"]').getAttribute('data-is-group'),
      ).toBe('true');
      expect(
        query(fixture, '[data-testid="first-name-leaf-header"]').getAttribute('data-is-group'),
      ).toBe('false');
    });

    it('provides `depth` in header template context', () => {
      const fixture = createGroupedFixture();
      expect(query(fixture, '[data-testid="person-group-header"]').getAttribute('data-depth')).toBe(
        '0',
      );
      expect(
        query(fixture, '[data-testid="first-name-leaf-header"]').getAttribute('data-depth'),
      ).toBe('1');
    });

    it('provides `colspan` in header template context', () => {
      const fixture = createGroupedFixture();
      expect(
        query(fixture, '[data-testid="person-group-header"]').getAttribute('data-colspan'),
      ).toBe('3');
      expect(
        query(fixture, '[data-testid="first-name-leaf-header"]').getAttribute('data-colspan'),
      ).toBe('1');
    });

    it('provides `rowspan` in header template context', () => {
      const fixture = createGroupedFixture();
      expect(
        query(fixture, '[data-testid="person-group-header"]').getAttribute('data-rowspan'),
      ).toBe('1');
      expect(
        query(fixture, '[data-testid="first-name-leaf-header"]').getAttribute('data-rowspan'),
      ).toBe('1');
    });

    it('applies group header classes independently from leaf header classes', () => {
      const fixture = createGroupedFixture();
      const groupHeader = query<HTMLTableCellElement>(fixture, 'th[data-column-id="person"]');
      const leafHeader = query<HTMLTableCellElement>(fixture, 'th[data-column-id="firstName"]');
      expect(groupHeader.hasAttribute('data-header-group')).toBe(true);
      expect(leafHeader.hasAttribute('data-header-group')).toBe(false);
    });

    it('defaults group header alignment to center', () => {
      const fixture = createGroupedFixture();
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="person"]').getAttribute(
          'data-align',
        ),
      ).toBe('center');
    });

    it('preserves leaf header alignment behavior', () => {
      const fixture = createFixture();
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="total"]').getAttribute(
          'data-align',
        ),
      ).toBe('end');
    });
  });

  describe('accessibility', () => {
    it('renders group headers as <th scope="colgroup">', () => {
      const fixture = createGroupedFixture();
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="person"]').getAttribute('scope'),
      ).toBe('colgroup');
    });

    it('renders leaf headers as <th scope="col">', () => {
      const fixture = createGroupedFixture();
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="firstName"]').getAttribute(
          'scope',
        ),
      ).toBe('col');
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="notes"]').getAttribute('scope'),
      ).toBe('col');
    });

    it('preserves accessible column labels for flat tables', () => {
      const fixture = createFixture();
      const labels = queryAll<HTMLTableCellElement>(fixture, 'thead th').map((th) =>
        th.textContent?.trim(),
      );
      expect(labels).toContain('Name');
      expect(labels).toContain('Total');
    });

    it('preserves accessible column labels for grouped tables', () => {
      const fixture = createGroupedFixture();
      const groupLabels = queryAll<HTMLTableCellElement>(fixture, 'thead tr:first-child th').map(
        (th) => th.textContent?.trim(),
      );
      expect(groupLabels[0]).toContain('Person');
      expect(groupLabels[1]).toContain('Dates');
    });

    it('avoids invalid ARIA sort attributes on group headers', () => {
      const fixture = createGroupedFixture();
      const personHeader = query<HTMLTableCellElement>(fixture, 'th[data-column-id="person"]');
      expect(personHeader.hasAttribute('aria-sort')).toBe(false);
    });

    it('applies `aria-sort` only to sortable leaf headers', () => {
      const fixture = createGroupedFixture();
      const sortableLeaf = query<HTMLTableCellElement>(fixture, 'th[data-column-id="firstName"]');
      const nonSortableLeaf = query<HTMLTableCellElement>(fixture, 'th[data-column-id="lastName"]');
      // The sortable leaf carries aria-sort via the sort directive (defaults to "none").
      expect(sortableLeaf.hasAttribute('aria-sort')).toBe(true);
      expect(nonSortableLeaf.hasAttribute('aria-sort')).toBe(false);
    });
  });

  describe('validation and edge cases', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    afterEach(() => {
      warnSpy.mockRestore();
    });

    it('warns in dev mode when duplicate column ids exist in nested columns', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'group',
          label: 'Group',
          children: [
            { id: 'dup', label: 'A' },
            { id: 'dup', label: 'B' },
          ],
        },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      expect(warnSpy).toHaveBeenCalled();
      expect(
        (warnSpy.mock.calls as readonly unknown[][]).some((call) =>
          String(call[0]).includes('Duplicate column id "dup"'),
        ),
      ).toBe(true);
    });

    it('warns in dev mode when a group column defines an accessor', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'grp',
          label: 'Grp',
          accessor: (row: PersonRow) => row.firstName,
          children: [{ id: 'leaf', label: 'L' }],
        } as unknown as TngTableColumn<PersonRow>,
      ]);
      fixture.detectChanges();

      expect(
        (warnSpy.mock.calls as readonly unknown[][]).some((call) =>
          String(call[0]).includes('accessor'),
        ),
      ).toBe(true);
    });

    it('warns in dev mode when a group column is marked sortable', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'grp',
          label: 'Grp',
          sortable: true,
          children: [{ id: 'leaf', label: 'L' }],
        } as unknown as TngTableColumn<PersonRow>,
      ]);
      fixture.detectChanges();

      expect(
        (warnSpy.mock.calls as readonly unknown[][]).some((call) =>
          String(call[0]).includes('sortable'),
        ),
      ).toBe(true);
    });

    it('warns in dev mode when a group-by leaf column is sticky', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        { id: 'firstName', label: 'First', groupBy: true, sticky: 'start' },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      expect(
        (warnSpy.mock.calls as readonly unknown[][]).some((call) =>
          String(call[0]).includes('combines "groupBy" and "sticky"'),
        ),
      ).toBe(true);
    });

    it('handles single-child group columns', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'grp',
          label: 'Grp',
          children: [{ id: 'only', label: 'Only' }],
        },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      const grp = query<HTMLTableCellElement>(fixture, 'th[data-column-id="grp"]');
      expect(grp.getAttribute('colspan')).toBeNull(); // colspan=1, suppressed.
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(1);
    });

    it('handles columns nested at different depths', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        {
          id: 'outer',
          label: 'Outer',
          children: [
            { id: 'shallow', label: 'Shallow' },
            {
              id: 'mid',
              label: 'Mid',
              children: [{ id: 'deep', label: 'Deep' }],
            },
          ],
        },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();

      expect(queryAll(fixture, 'thead tr')).toHaveLength(3);
      expect(
        query<HTMLTableCellElement>(fixture, 'th[data-column-id="shallow"]').getAttribute(
          'rowspan',
        ),
      ).toBe('2');
    });

    it('handles all columns hidden', () => {
      const fixture = createGroupedFixture();
      fixture.componentInstance.columns.set([
        { id: 'a', label: 'A', hidden: true },
        { id: 'b', label: 'B', hidden: true },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.componentInstance.items.set([]);
      fixture.detectChanges();

      expect(queryAll(fixture, 'colgroup col')).toHaveLength(0);
      // State cell colspan should fall back to 1.
      expect(query(fixture, 'tbody td.tng-table__state-cell').getAttribute('colspan')).toBe('1');
    });

    it('handles dynamic column updates', () => {
      const fixture = createGroupedFixture();
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(6);

      fixture.componentInstance.columns.set([{ id: 'only', label: 'Only' }]);
      fixture.detectChanges();
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(1);
    });

    it('recomputes header rows when column tree changes', () => {
      const fixture = createGroupedFixture();
      expect(queryAll(fixture, 'thead tr')).toHaveLength(2);

      fixture.componentInstance.columns.set([{ id: 'flat', label: 'Flat' }]);
      fixture.detectChanges();
      expect(queryAll(fixture, 'thead tr')).toHaveLength(1);
    });

    it('recomputes leaf columns when column visibility changes', () => {
      const fixture = createGroupedFixture();
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(6);

      fixture.componentInstance.columns.set([
        {
          id: 'person',
          label: 'Person',
          children: [
            { id: 'firstName', label: 'First' },
            { id: 'lastName', label: 'Last', hidden: true },
          ],
        },
      ] as readonly TngTableColumn<PersonRow>[]);
      fixture.detectChanges();
      expect(queryAll(fixture, 'colgroup col')).toHaveLength(1);
    });
  });
});

describe('tng-table body group-by rows', () => {
  it('merges consecutive equal values in a group-by leaf column', () => {
    const fixture = createGroupedBodyFixture();

    const rows = queryAll<HTMLTableRowElement>(fixture, 'tbody tr');
    expect(rows).toHaveLength(6);
    expect(queryAll(rows[0], 'td')).toHaveLength(3);
    expect(queryAll(rows[1], 'td')).toHaveLength(2);
    expect(queryAll(rows[2], 'td')).toHaveLength(2);
    expect(queryAll(rows[3], 'td')).toHaveLength(3);
    expect(queryAll(rows[4], 'td')).toHaveLength(2);
    expect(queryAll(rows[5], 'td')).toHaveLength(3);

    const departmentCells = queryAll<HTMLTableCellElement>(
      fixture,
      'tbody td[data-column-id="department"]',
    );
    expect(departmentCells.map((cell) => cell.textContent?.trim())).toEqual([
      'Engineering',
      'Sales',
      'HR',
    ]);
    expect(departmentCells.map((cell) => cell.getAttribute('rowspan'))).toEqual(['3', '2', null]);
  });

  it('does not merge non-consecutive equal values', () => {
    const fixture = createGroupedBodyFixture();
    fixture.componentInstance.items.set([
      { id: '1', department: 'Engineering', region: 'NA', employee: 'Alice', salary: 90_000 },
      { id: '2', department: 'Sales', region: 'NA', employee: 'Dave', salary: 70_000 },
      { id: '3', department: 'Engineering', region: 'EU', employee: 'Carol', salary: 95_000 },
    ]);
    fixture.detectChanges();

    const departmentCells = queryAll<HTMLTableCellElement>(
      fixture,
      'tbody td[data-column-id="department"]',
    );
    expect(departmentCells).toHaveLength(3);
    expect(departmentCells.map((cell) => cell.getAttribute('rowspan'))).toEqual([null, null, null]);
  });

  it('supports nested group-by columns left-to-right', () => {
    const fixture = createGroupedBodyFixture();
    fixture.componentInstance.columns.set([
      { id: 'department', label: 'Department', groupBy: true },
      { id: 'region', label: 'Region', groupBy: true },
      { id: 'employee', label: 'Employee' },
    ]);
    fixture.componentInstance.items.set([
      { id: '1', department: 'Engineering', region: 'NA', employee: 'Alice', salary: 90_000 },
      { id: '2', department: 'Engineering', region: 'NA', employee: 'Bob', salary: 85_000 },
      { id: '3', department: 'Engineering', region: 'EU', employee: 'Carol', salary: 95_000 },
      { id: '4', department: 'Sales', region: 'NA', employee: 'Dave', salary: 70_000 },
      { id: '5', department: 'Sales', region: 'NA', employee: 'Eve', salary: 72_000 },
    ]);
    fixture.detectChanges();

    const departmentCells = queryAll<HTMLTableCellElement>(
      fixture,
      'tbody td[data-column-id="department"]',
    );
    const regionCells = queryAll<HTMLTableCellElement>(
      fixture,
      'tbody td[data-column-id="region"]',
    );

    expect(departmentCells.map((cell) => cell.getAttribute('rowspan'))).toEqual(['3', '2']);
    expect(regionCells.map((cell) => cell.textContent?.trim())).toEqual(['NA', 'EU', 'NA']);
    expect(regionCells.map((cell) => cell.getAttribute('rowspan'))).toEqual(['2', null, '2']);
  });

  it('passes group metadata into cell templates for the leader cell', () => {
    const fixture = createGroupedBodyFixture();

    const templates = queryAll<HTMLElement>(fixture, '[data-testid="department-template"]');
    expect(templates[0]?.getAttribute('data-group-size')).toBe('3');
    expect(templates[0]?.getAttribute('data-group-leader')).toBe('true');
    expect(templates[2]?.getAttribute('data-group-size')).toBe('1');
    expect(templates[2]?.getAttribute('data-group-leader')).toBe('true');
  });

  it('uses top vertical alignment for merged group cells by default and allows middle alignment', () => {
    const fixture = createGroupedBodyFixture();
    const defaultGroupCell = query<HTMLTableCellElement>(
      fixture,
      'tbody td[data-column-id="department"]',
    );
    expect(defaultGroupCell.getAttribute('data-group-align')).toBe('top');

    fixture.componentInstance.columns.set([
      { id: 'department', label: 'Department', groupBy: true, groupByAlign: 'middle' },
      { id: 'employee', label: 'Employee' },
    ]);
    fixture.detectChanges();

    const middleGroupCell = query<HTMLTableCellElement>(
      fixture,
      'tbody td[data-column-id="department"]',
    );
    expect(middleGroupCell.getAttribute('data-group-align')).toBe('middle');
  });
});

describe('tng-table row/cell/header class hooks', () => {
  function rowClasses(fixture: { nativeElement: unknown }): readonly string[][] {
    return queryAll<HTMLTableRowElement>(fixture, 'tbody tr').map((tr) =>
      Array.from(tr.classList),
    );
  }

  describe('rowClass', () => {
    it('does not add any class when rowClass is null', () => {
      const fixture = createClassHookFixture();
      for (const classes of rowClasses(fixture)) {
        expect(classes).toHaveLength(0);
      }
    });

    it('applies a static string class to every body row', () => {
      const fixture = createClassHookFixture();
      fixture.componentInstance.rowClass.set(() => 'row-base');
      fixture.detectChanges();

      for (const classes of rowClasses(fixture)) {
        expect(classes).toContain('row-base');
      }
    });

    it('passes the row and index to the predicate for conditional classes', () => {
      const fixture = createClassHookFixture();
      fixture.componentInstance.rowClass.set((row, index) =>
        row.status === 'Draft' ? `draft-${index}` : `ready-${index}`,
      );
      fixture.detectChanges();

      const rows = rowClasses(fixture);
      expect(rows[0]).toContain('ready-0');
      expect(rows[1]).toContain('draft-1');
    });

    it('supports the array form', () => {
      const fixture = createClassHookFixture();
      fixture.componentInstance.rowClass.set(() => ['a', 'b']);
      fixture.detectChanges();

      expect(rowClasses(fixture)[0]).toEqual(expect.arrayContaining(['a', 'b']));
    });

    it('supports the object form and only applies truthy keys', () => {
      const fixture = createClassHookFixture();
      fixture.componentInstance.rowClass.set((row) => ({
        'is-draft': row.status === 'Draft',
        'is-ready': row.status === 'Ready',
      }));
      fixture.detectChanges();

      const rows = rowClasses(fixture);
      expect(rows[0]).toContain('is-ready');
      expect(rows[0]).not.toContain('is-draft');
      expect(rows[1]).toContain('is-draft');
      expect(rows[1]).not.toContain('is-ready');
    });

    it('reacts to predicate changes', () => {
      const fixture = createClassHookFixture();
      fixture.componentInstance.rowClass.set(() => 'first');
      fixture.detectChanges();
      expect(rowClasses(fixture)[0]).toContain('first');

      fixture.componentInstance.rowClass.set(() => 'second');
      fixture.detectChanges();
      const updated = rowClasses(fixture)[0];
      expect(updated).toContain('second');
      expect(updated).not.toContain('first');
    });

    it('keeps the primitive row slot attribute intact alongside custom classes', () => {
      const fixture = createClassHookFixture();
      fixture.componentInstance.rowClass.set(() => 'row-base');
      fixture.detectChanges();

      const row = query<HTMLTableRowElement>(fixture, 'tbody tr');
      expect(row.getAttribute('data-slot')).toBe('table-row');
      expect(row.classList.contains('row-base')).toBe(true);
    });
  });

  describe('cellClass', () => {
    it('applies a static class to the configured column only and preserves the base cell class', () => {
      const fixture = createClassHookFixture();

      const totalCell = query<HTMLTableCellElement>(fixture, 'td[data-column-id="total"]');
      expect(totalCell.classList.contains('tng-table__cell')).toBe(true);
      expect(totalCell.classList.contains('money-cell')).toBe(true);

      const nameCell = query<HTMLTableCellElement>(fixture, 'td[data-column-id="name"]');
      expect(nameCell.classList.contains('money-cell')).toBe(false);
      expect(nameCell.classList.contains('tng-table__cell')).toBe(true);
    });

    it('passes row, value, and index into the predicate form', () => {
      const fixture = createClassHookFixture();
      fixture.componentInstance.cellClass.set((_row, value, index) =>
        Number(value) > 10 ? `high-${index}` : `low-${index}`,
      );
      fixture.detectChanges();

      const cells = queryAll<HTMLTableCellElement>(fixture, 'td[data-column-id="total"]');
      expect(cells[0].classList.contains('high-0')).toBe(true);
      expect(cells[1].classList.contains('low-1')).toBe(true);
    });

    it('supports multi-class strings on a single column', () => {
      const fixture = createClassHookFixture();
      fixture.componentInstance.cellClass.set('a b');
      fixture.detectChanges();

      const totalCell = query<HTMLTableCellElement>(fixture, 'td[data-column-id="total"]');
      expect(totalCell.classList.contains('a')).toBe(true);
      expect(totalCell.classList.contains('b')).toBe(true);
    });

    it('supports the object form on a single column', () => {
      const fixture = createClassHookFixture();
      fixture.componentInstance.cellClass.set({ negative: false, positive: true });
      fixture.detectChanges();

      const totalCell = query<HTMLTableCellElement>(fixture, 'td[data-column-id="total"]');
      expect(totalCell.classList.contains('positive')).toBe(true);
      expect(totalCell.classList.contains('negative')).toBe(false);
    });
  });

  describe('headerClass', () => {
    it('applies a class to the configured header cell while keeping the base header class', () => {
      const fixture = createClassHookFixture();

      const nameHeader = query<HTMLTableCellElement>(fixture, 'th[data-column-id="name"]');
      expect(nameHeader.classList.contains('tng-table__header-cell')).toBe(true);
      expect(nameHeader.classList.contains('name-head')).toBe(true);

      const statusHeader = query<HTMLTableCellElement>(fixture, 'th[data-column-id="status"]');
      expect(statusHeader.classList.contains('name-head')).toBe(false);
    });

    it('supports headerClass on group columns', () => {
      @Component({
        imports: [TngTableComponent],
        template: `<tng-table [columns]="columns()" [items]="[]"></tng-table>`,
      })
      class GroupHeaderClassHost {
        public readonly columns = signal<readonly TngTableColumn<{ a: string }>[]>([
          {
            id: 'group',
            label: 'Group',
            headerClass: 'group-head',
            children: [{ id: 'a', label: 'A' }],
          },
        ]);
      }

      const fixture = TestBed.configureTestingModule({
        imports: [GroupHeaderClassHost],
      }).createComponent(GroupHeaderClassHost);
      fixture.detectChanges();

      const groupHeader = query<HTMLTableCellElement>(fixture, 'th[data-column-id="group"]');
      expect(groupHeader.classList.contains('group-head')).toBe(true);
      expect(groupHeader.classList.contains('tng-table__header-cell')).toBe(true);
    });
  });
});

describe('tng-table row/cell/header style hooks', () => {
  describe('rowStyle', () => {
    it('applies custom properties to body rows for component-scoped row styling', () => {
      const fixture = createClassHookFixture();
      fixture.componentInstance.rowStyle.set((row) =>
        row.status === 'Draft' ? { '--tng-table-row-bg': 'rgb(255, 230, 230)' } : null,
      );
      fixture.detectChanges();

      const rows = queryAll<HTMLTableRowElement>(fixture, 'tbody tr');
      expect(rows[0]?.style.getPropertyValue('--tng-table-row-bg')).toBe('');
      expect(rows[1]?.style.getPropertyValue('--tng-table-row-bg')).toBe('rgb(255, 230, 230)');
    });

    it('updates row styles when the predicate changes', () => {
      const fixture = createClassHookFixture();
      fixture.componentInstance.rowStyle.set(() => ({ '--tng-table-row-bg': 'red' }));
      fixture.detectChanges();

      const row = query<HTMLTableRowElement>(fixture, 'tbody tr');
      expect(row.style.getPropertyValue('--tng-table-row-bg')).toBe('red');

      fixture.componentInstance.rowStyle.set(() => ({ '--tng-table-row-bg': 'blue' }));
      fixture.detectChanges();

      expect(row.style.getPropertyValue('--tng-table-row-bg')).toBe('blue');
    });
  });

  describe('cellStyle', () => {
    it('applies a static style object to the configured column only', () => {
      const fixture = createClassHookFixture();
      fixture.componentInstance.cellStyle.set({ color: 'rgb(180, 35, 24)', 'font-weight': 650 });
      fixture.detectChanges();

      const totalCell = query<HTMLTableCellElement>(fixture, 'td[data-column-id="total"]');
      expect(totalCell.style.color).toBe('rgb(180, 35, 24)');
      expect(totalCell.style.fontWeight).toBe('650');

      const nameCell = query<HTMLTableCellElement>(fixture, 'td[data-column-id="name"]');
      expect(nameCell.style.color).toBe('');
      expect(nameCell.style.fontWeight).toBe('');
    });

    it('passes row, value, and index into the predicate form', () => {
      const fixture = createClassHookFixture();
      fixture.componentInstance.cellStyle.set((row, value, index) =>
        row.status === 'Draft' && Number(value) === 7 && index === 1
          ? { color: 'rgb(180, 35, 24)' }
          : null,
      );
      fixture.detectChanges();

      const cells = queryAll<HTMLTableCellElement>(fixture, 'td[data-column-id="total"]');
      expect(cells[0]?.style.color).toBe('');
      expect(cells[1]?.style.color).toBe('rgb(180, 35, 24)');
    });
  });

  describe('headerStyle', () => {
    it('applies a style object to the configured header cell', () => {
      const fixture = createClassHookFixture();
      fixture.componentInstance.headerStyle.set({ color: 'rgb(20, 83, 45)' });
      fixture.detectChanges();

      const nameHeader = query<HTMLTableCellElement>(fixture, 'th[data-column-id="name"]');
      expect(nameHeader.style.color).toBe('rgb(20, 83, 45)');

      const statusHeader = query<HTMLTableCellElement>(fixture, 'th[data-column-id="status"]');
      expect(statusHeader.style.color).toBe('');
    });

    it('supports headerStyle on group columns', () => {
      @Component({
        imports: [TngTableComponent],
        template: `<tng-table [columns]="columns()" [items]="[]"></tng-table>`,
      })
      class GroupHeaderStyleHost {
        public readonly columns = signal<readonly TngTableColumn<{ a: string }>[]>([
          {
            id: 'group',
            label: 'Group',
            headerStyle: { color: 'rgb(20, 83, 45)' },
            children: [{ id: 'a', label: 'A' }],
          },
        ]);
      }

      const fixture = TestBed.configureTestingModule({
        imports: [GroupHeaderStyleHost],
      }).createComponent(GroupHeaderStyleHost);
      fixture.detectChanges();

      const groupHeader = query<HTMLTableCellElement>(fixture, 'th[data-column-id="group"]');
      expect(groupHeader.style.color).toBe('rgb(20, 83, 45)');
    });
  });
});

describe('tng-table grouped row styling hooks', () => {
  it('annotates body rows with data-group-position based on the primary group', () => {
    const fixture = createGroupedBodyFixture();

    const positions = queryAll<HTMLTableRowElement>(fixture, 'tbody tr').map((tr) =>
      tr.getAttribute('data-group-position'),
    );
    // Engineering x3, Sales x2, HR x1.
    expect(positions).toEqual(['first', 'middle', 'last', 'first', 'last', 'single']);
  });

  it('omits data-group-position when no column is grouped', () => {
    const fixture = createFixture();
    for (const tr of queryAll<HTMLTableRowElement>(fixture, 'tbody tr')) {
      expect(tr.hasAttribute('data-group-position')).toBe(false);
    }
  });

  it('defaults hover mode to row and reflects the group hover mode attribute', () => {
    const fixture = createGroupedBodyFixture();
    expect(query<HTMLTableElement>(fixture, 'table').getAttribute('data-hover-mode')).toBe('row');
  });
});
