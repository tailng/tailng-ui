import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { TngTreeTableKey } from '@tailng-ui/primitives';
import { existsSync, readFileSync } from 'node:fs';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TngTreeTableColumn } from './tng-tree-table-column.type';
import { TngTreeTableComponent } from './tng-tree-table.component';

const treeTableComponentStylesPath = existsSync(
  'libs/tailng-ui/components/src/lib/layout/tree-table/tng-tree-table.component.css',
)
  ? 'libs/tailng-ui/components/src/lib/layout/tree-table/tng-tree-table.component.css'
  : 'src/lib/layout/tree-table/tng-tree-table.component.css';
const treeTableComponentStyles = readFileSync(treeTableComponentStylesPath, 'utf8');

type AccountRow = {
  id: string;
  name: string;
  type: string;
  balance: number;
  children?: AccountRow[];
}

const COLUMNS: TngTreeTableColumn<AccountRow>[] = [
  { key: 'name', label: 'Name', treeToggle: true, accessor: (row) => row.name },
  { key: 'type', label: 'Type', accessor: (row) => row.type },
  { key: 'balance', label: 'Balance', align: 'end', accessor: (row) => row.balance },
];

const DATA: AccountRow[] = [
  {
    id: 'assets',
    name: 'Assets',
    type: 'Group',
    balance: 10000,
    children: [
      { id: 'cash', name: 'Cash', type: 'Ledger', balance: 3000 },
      {
        id: 'investments',
        name: 'Investments',
        type: 'Group',
        balance: 7000,
        children: [{ id: 'stocks', name: 'Stocks', type: 'Ledger', balance: 7000 }],
      },
    ],
  },
  { id: 'liabilities', name: 'Liabilities', type: 'Group', balance: 2000 },
];

@Component({
  imports: [TngTreeTableComponent],
  template: `
    <tng-tree-table
      [data]="data()"
      [columns]="columns()"
      [getKey]="getKey"
      [getChildren]="getChildren"
      [expandedKeys]="expandedKeys()"
      [selectedKeys]="selectedKeys()"
      [loading]="loading()"
      [selectable]="selectable()"
      [expandOnRowClick]="expandOnRowClick()"
      [emptyText]="emptyText()"
      [loadingText]="loadingText()"
      (expandedKeysChange)="onExpandedChange($event)"
      (selectedKeysChange)="onSelectedChange($event)"
      (rowClick)="onRowClick($event)"
      (rowExpand)="onRowExpand($event)"
      (rowCollapse)="onRowCollapse($event)"
    />
  `,
})
class HostComponent {
  public readonly data = signal<readonly AccountRow[]>(DATA);
  public readonly columns = signal<readonly TngTreeTableColumn<AccountRow>[]>(COLUMNS);
  public readonly expandedKeys = signal<readonly TngTreeTableKey[]>([]);
  public readonly selectedKeys = signal<readonly TngTreeTableKey[]>([]);
  public readonly loading = signal(false);
  public readonly selectable = signal(false);
  public readonly expandOnRowClick = signal(false);
  public readonly emptyText = signal('No records found');
  public readonly loadingText = signal('Loading...');

  public readonly getKey = (row: AccountRow) => row.id;
  public readonly getChildren = (row: AccountRow) => row.children;

  public onExpandedChange = vi.fn();
  public onSelectedChange = vi.fn();
  public onRowClick = vi.fn();
  public onRowExpand = vi.fn();
  public onRowCollapse = vi.fn();
}

function getTable(fixture: ReturnType<typeof TestBed.createComponent<HostComponent>>) {
  return fixture.nativeElement.querySelector('table') as HTMLTableElement;
}

function getRows(fixture: ReturnType<typeof TestBed.createComponent<HostComponent>>) {
  return Array.from(
    fixture.nativeElement.querySelectorAll('.tng-tree-table__row') as NodeListOf<HTMLTableRowElement>,
  );
}

function getHeaderCells(fixture: ReturnType<typeof TestBed.createComponent<HostComponent>>) {
  return Array.from(
    fixture.nativeElement.querySelectorAll('.tng-tree-table__header-cell') as NodeListOf<HTMLTableCellElement>,
  );
}

function getToggleButton(row: HTMLTableRowElement): HTMLButtonElement | null {
  return row.querySelector('.tng-tree-table__toggle');
}

function findStyleBlock(pattern: RegExp): string {
  const match = treeTableComponentStyles.match(pattern);
  expect(match).not.toBeNull();
  return match?.[1] ?? '';
}

function expectDeclaration(styleBlock: string, property: string, value: string): void {
  expect(styleBlock).toMatch(new RegExp(`${property}\\s*:\\s*${value}\\s*;`));
}

describe('TngTreeTableComponent', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<HostComponent>>;
  let host: HostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
    });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  describe('rendering', () => {
    it('should render table with role="treegrid"', () => {
      expect(getTable(fixture).getAttribute('role')).toBe('treegrid');
    });

    it('should render header cells from column definitions', () => {
      const headers = getHeaderCells(fixture);
      expect(headers).toHaveLength(3);
      expect(headers[0]?.textContent?.trim()).toBe('Name');
      expect(headers[1]?.textContent?.trim()).toBe('Type');
      expect(headers[2]?.textContent?.trim()).toBe('Balance');
    });

    it('should render root rows only when nothing is expanded', () => {
      expect(getRows(fixture)).toHaveLength(2);
    });

    it('should render expanded child rows', () => {
      host.expandedKeys.set(['assets']);
      fixture.detectChanges();
      const rows = getRows(fixture);
      expect(rows.length).toBeGreaterThan(2);
    });

    it('should not render collapsed child rows', () => {
      host.expandedKeys.set([]);
      fixture.detectChanges();
      const rows = getRows(fixture);
      expect(rows).toHaveLength(2);
    });

    it('should render correct cell values', () => {
      const rows = getRows(fixture);
      const firstCells = rows[0].querySelectorAll('.tng-tree-table__cell');
      const nameCell = firstCells[0];
      expect(nameCell?.textContent).toContain('Assets');
    });

    it('should wrap regular cell text in cell content span', () => {
      const rows = getRows(fixture);
      const firstCells = rows[0].querySelectorAll('.tng-tree-table__cell');
      const typeCell = firstCells[1];
      const content = typeCell?.querySelector('.tng-tree-table__cell-content');
      expect(content?.textContent).toContain('Group');
    });

    it('should render tree toggle button for expandable rows', () => {
      const rows = getRows(fixture);
      const btn = getToggleButton(rows[0]);
      expect(btn).not.toBeNull();
    });

    it('should not render expand button for non-expandable rows', () => {
      host.data.set([{ id: 'leaf', name: 'Leaf', type: 'L', balance: 0 }]);
      fixture.detectChanges();
      const rows = getRows(fixture);
      const btn = getToggleButton(rows[0]);
      expect(btn).toBeNull();
    });

    it('should use the first column as tree column fallback', () => {
      const cols: TngTreeTableColumn<AccountRow>[] = [
        { key: 'name', label: 'Name', accessor: (r) => r.name }, // no treeToggle
        { key: 'type', label: 'Type', accessor: (r) => r.type },
      ];
      host.columns.set(cols);
      fixture.detectChanges();

      const rows = getRows(fixture);
      const firstCell = rows[0]?.querySelectorAll('.tng-tree-table__tree-cell');
      expect(firstCell?.length).toBeGreaterThan(0);
    });

    it('should apply column alignment via data-align attribute', () => {
      host.expandedKeys.set(['assets']);
      fixture.detectChanges();
      const rows = getRows(fixture);
      const cells = rows[0].querySelectorAll('.tng-tree-table__cell');
      expect(cells[2]?.getAttribute('data-align')).toBe('end');
    });
  });

  // ── Expansion events ───────────────────────────────────────────────────────

  describe('expansion events', () => {
    it('should expand row when expand button is clicked', () => {
      const rows = getRows(fixture);
      const btn = getToggleButton(rows[0])!;
      btn.click();
      fixture.detectChanges();
      expect(host.onExpandedChange).toHaveBeenCalledWith(expect.arrayContaining(['assets']));
    });

    it('should emit rowExpand when row expands', () => {
      const rows = getRows(fixture);
      const btn = getToggleButton(rows[0])!;
      btn.click();
      fixture.detectChanges();
      expect(host.onRowExpand).toHaveBeenCalledOnce();
    });

    it('should collapse row when collapse button is clicked on an expanded row', () => {
      host.expandedKeys.set(['assets']);
      fixture.detectChanges();
      const rows = getRows(fixture);
      const btn = getToggleButton(rows[0])!;
      btn.click();
      fixture.detectChanges();
      expect(host.onExpandedChange).toHaveBeenCalledWith(
        expect.not.arrayContaining(['assets']),
      );
    });

    it('should emit rowCollapse when row collapses', () => {
      host.expandedKeys.set(['assets']);
      fixture.detectChanges();
      const rows = getRows(fixture);
      const btn = getToggleButton(rows[0])!;
      btn.click();
      fixture.detectChanges();
      expect(host.onRowCollapse).toHaveBeenCalledOnce();
    });

    it('should expand row on row click when expandOnRowClick is true', () => {
      host.expandOnRowClick.set(true);
      fixture.detectChanges();
      const rows = getRows(fixture);
      rows[0].click();
      fixture.detectChanges();
      expect(host.onExpandedChange).toHaveBeenCalledWith(expect.arrayContaining(['assets']));
    });

    it('should not expand row on row click when expandOnRowClick is false', () => {
      host.expandOnRowClick.set(false);
      fixture.detectChanges();
      const rows = getRows(fixture);
      rows[0].click();
      fixture.detectChanges();
      // rowClick emitted but NOT expandedKeysChange
      expect(host.onRowClick).toHaveBeenCalledOnce();
      expect(host.onExpandedChange).not.toHaveBeenCalled();
    });
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  describe('accessibility', () => {
    it('should set aria-level="1" for root rows', () => {
      const rows = getRows(fixture);
      expect(rows[0]?.getAttribute('aria-level')).toBe('1');
    });

    it('should set aria-level for child rows based on depth', () => {
      host.expandedKeys.set(['assets']);
      fixture.detectChanges();
      const rows = getRows(fixture);
      const childRow = rows.find((r) => r.getAttribute('data-level') === '1');
      expect(childRow?.getAttribute('aria-level')).toBe('2');
    });

    it('should set aria-expanded="true" for expanded expandable rows', () => {
      host.expandedKeys.set(['assets']);
      fixture.detectChanges();
      const rows = getRows(fixture);
      expect(rows[0]?.getAttribute('aria-expanded')).toBe('true');
    });

    it('should set aria-expanded="false" for collapsed expandable rows', () => {
      expect(getRows(fixture)[0]?.getAttribute('aria-expanded')).toBe('false');
    });

    it('should not set aria-expanded for non-expandable rows', () => {
      const rows = getRows(fixture);
      // liabilities row has no children
      const liabilities = rows.find(
        (r) => r.textContent?.includes('Liabilities'),
      );
      expect(liabilities?.getAttribute('aria-expanded')).toBeNull();
    });

    it('should set meaningful aria-label for expand button', () => {
      const rows = getRows(fixture);
      const btn = getToggleButton(rows[0]);
      expect(btn?.getAttribute('aria-label')).toBe('Expand row');
    });

    it('should set meaningful aria-label for collapse button', () => {
      host.expandedKeys.set(['assets']);
      fixture.detectChanges();
      const rows = getRows(fixture);
      const btn = getToggleButton(rows[0]);
      expect(btn?.getAttribute('aria-label')).toBe('Collapse row');
    });

    it('should apply aria-selected when selectable', () => {
      host.selectable.set(true);
      fixture.detectChanges();
      const rows = getRows(fixture);
      expect(rows[0]?.getAttribute('aria-selected')).toBe('false');
    });

    it('should not set aria-selected when not selectable', () => {
      expect(getRows(fixture)[0]?.getAttribute('aria-selected')).toBeNull();
    });

    it('should support keyboard expansion with ArrowRight', () => {
      const rows = getRows(fixture);
      rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      fixture.detectChanges();
      expect(host.onExpandedChange).toHaveBeenCalledWith(expect.arrayContaining(['assets']));
    });

    it('should support keyboard collapse with ArrowLeft', () => {
      host.expandedKeys.set(['assets']);
      fixture.detectChanges();
      const rows = getRows(fixture);
      rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      fixture.detectChanges();
      expect(host.onExpandedChange).toHaveBeenCalledWith(
        expect.not.arrayContaining(['assets']),
      );
    });

    it('should support keyboard toggle with Enter', () => {
      const rows = getRows(fixture);
      rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();
      expect(host.onExpandedChange).toHaveBeenCalled();
    });

    it('should support keyboard selection with Space when selectable', () => {
      host.selectable.set(true);
      fixture.detectChanges();
      const rows = getRows(fixture);
      rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      fixture.detectChanges();
      expect(host.onSelectedChange).toHaveBeenCalled();
    });

    it('should prevent page scroll on Space key', () => {
      host.selectable.set(true);
      fixture.detectChanges();
      const rows = getRows(fixture);
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
      rows[0].dispatchEvent(event);
      fixture.detectChanges();
      expect(event.defaultPrevented).toBe(true);
    });
  });

  // ── Selection ──────────────────────────────────────────────────────────────

  describe('selection', () => {
    it('should not select rows when selectable is false', () => {
      const rows = getRows(fixture);
      rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      fixture.detectChanges();
      expect(host.onSelectedChange).not.toHaveBeenCalled();
    });

    it('should select row when selectable is true and Space is pressed', () => {
      host.selectable.set(true);
      fixture.detectChanges();
      const rows = getRows(fixture);
      rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      fixture.detectChanges();
      expect(host.onSelectedChange).toHaveBeenCalledWith(expect.arrayContaining(['assets']));
    });

    it('should emit selectedKeysChange on selection', () => {
      host.selectable.set(true);
      fixture.detectChanges();
      const rows = getRows(fixture);
      rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      fixture.detectChanges();
      expect(host.onSelectedChange).toHaveBeenCalledOnce();
    });
  });

  // ── Loading and empty states ───────────────────────────────────────────────

  describe('loading and empty states', () => {
    it('should render loading row when loading is true', () => {
      host.loading.set(true);
      fixture.detectChanges();
      const loadingRow = fixture.nativeElement.querySelector('.tng-tree-table__loading-row');
      expect(loadingRow).not.toBeNull();
    });

    it('should render loading text', () => {
      host.loading.set(true);
      host.loadingText.set('Fetching...');
      fixture.detectChanges();
      const cell = fixture.nativeElement.querySelector('.tng-tree-table__loading-cell');
      expect(cell?.textContent?.trim()).toBe('Fetching...');
    });

    it('should render empty row when data is empty', () => {
      host.data.set([]);
      fixture.detectChanges();
      const emptyRow = fixture.nativeElement.querySelector('.tng-tree-table__empty-row');
      expect(emptyRow).not.toBeNull();
    });

    it('should render empty text', () => {
      host.data.set([]);
      host.emptyText.set('Nothing here');
      fixture.detectChanges();
      const cell = fixture.nativeElement.querySelector('.tng-tree-table__empty-cell');
      expect(cell?.textContent?.trim()).toBe('Nothing here');
    });

    it('should prioritize loading state over empty state', () => {
      host.data.set([]);
      host.loading.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.tng-tree-table__loading-row')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('.tng-tree-table__empty-row')).toBeNull();
    });

    it('should use correct colspan for loading row', () => {
      host.loading.set(true);
      fixture.detectChanges();
      const cell = fixture.nativeElement.querySelector('.tng-tree-table__loading-cell');
      expect(cell?.getAttribute('colspan')).toBe('3');
    });

    it('should use correct colspan for empty row', () => {
      host.data.set([]);
      fixture.detectChanges();
      const cell = fixture.nativeElement.querySelector('.tng-tree-table__empty-cell');
      expect(cell?.getAttribute('colspan')).toBe('3');
    });
  });

  // ── Input updates ──────────────────────────────────────────────────────────

  describe('input updates', () => {
    it('should update rows when data input changes', () => {
      host.data.set([{ id: 'x', name: 'X', type: 'T', balance: 0 }]);
      fixture.detectChanges();
      expect(getRows(fixture)).toHaveLength(1);
    });

    it('should update visible rows when expanded keys input changes', () => {
      host.expandedKeys.set(['assets']);
      fixture.detectChanges();
      expect(getRows(fixture).length).toBeGreaterThan(2);
    });

    it('should not mutate input expanded keys array', () => {
      const keys: TngTreeTableKey[] = [];
      host.expandedKeys.set(keys);
      fixture.detectChanges();
      const rows = getRows(fixture);
      const btn = getToggleButton(rows[0])!;
      btn.click();
      fixture.detectChanges();
      expect(keys).toHaveLength(0); // original array not mutated
    });

    it('should not mutate input selected keys array', () => {
      host.selectable.set(true);
      const keys: TngTreeTableKey[] = [];
      host.selectedKeys.set(keys);
      fixture.detectChanges();
      const rows = getRows(fixture);
      rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      fixture.detectChanges();
      expect(keys).toHaveLength(0);
    });
  });

  describe('styling', () => {
    it('constrains horizontal overflow inside the component root', () => {
      const hostStyle = findStyleBlock(/:host\s*\{([^}]*)\}/);
      expectDeclaration(hostStyle, 'display', 'block');
      expectDeclaration(hostStyle, 'box-sizing', 'border-box');
      expectDeclaration(hostStyle, 'max-width', '100%');
      expectDeclaration(hostStyle, 'min-width', '0');

      const rootStyle = findStyleBlock(/\.tng-tree-table__root\s*\{([^}]*)\}/);
      expectDeclaration(rootStyle, 'box-sizing', 'border-box');
      expectDeclaration(rootStyle, 'max-width', '100%');
      expectDeclaration(rootStyle, 'overflow-x', 'auto');
      expectDeclaration(rootStyle, 'width', '100%');
    });
  });
});
