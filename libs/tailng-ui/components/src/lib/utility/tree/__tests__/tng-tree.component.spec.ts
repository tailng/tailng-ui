import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngTreeComponent, type TngTreeItem } from '../tng-tree.component';

const SAMPLE_NODES: readonly TngTreeItem[] = Object.freeze([
  { id: 'workspace', label: 'tailng-ui', description: 'Workspace root' },
  { id: 'libs', label: 'libs', parentId: 'workspace' },
  { id: 'components', label: 'components', parentId: 'libs' },
  { id: 'primitives', label: 'primitives', parentId: 'libs' },
  { id: 'apps', label: 'apps', parentId: 'workspace' },
  { id: 'docs', label: 'docs', parentId: 'apps' },
  { id: 'playground', label: 'playground', parentId: 'apps' },
  { id: 'disabled-node', label: 'disabled', parentId: 'workspace', disabled: true },
]);

const DEFAULT_EXPANDED: readonly string[] = Object.freeze(['workspace', 'libs', 'apps']);

function getRoot(fixture: { nativeElement: HTMLElement }): HTMLElement {
  const root = fixture.nativeElement.querySelector('.tng-tree-root');
  if (root === null) {
    throw new Error('Expected .tng-tree-root to exist.');
  }
  return root;
}

function getItems(fixture: { nativeElement: HTMLElement }): HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('[role="treeitem"]'));
}

function getItemById(fixture: { nativeElement: HTMLElement }, nodeId: string): HTMLElement {
  const items = getItems(fixture);
  const match = items.find((el) => el.id.endsWith(`-item-${nodeId}`));
  if (match === undefined) {
    throw new Error(`Expected tree item with id ending in "-item-${nodeId}" to exist.`);
  }
  return match;
}

function getToggleButton(item: HTMLElement): HTMLButtonElement | null {
  return item.querySelector('button.tng-tree-toggle');
}

function getLabelButton(item: HTMLElement): HTMLButtonElement {
  const btn = item.querySelector('button.tng-tree-node');
  if (btn === null) {
    throw new Error('Expected label button to exist.');
  }
  return btn;
}

function pressKey(element: HTMLElement, key: string): void {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
  });
  element.dispatchEvent(event);
}

function click(element: HTMLElement): void {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

@Component({
  imports: [TngTreeComponent],
  template: `
    <tng-tree
      data-testid="tree"
      [nodes]="nodes()"
      [defaultExpandedIds]="defaultExpandedIds()"
      [defaultSelectedId]="defaultSelectedId()"
      [ariaLabel]="ariaLabel()"
      (selectedIdChange)="onSelectedIdChange($event)"
    />
  `,
})
class TreeTestHost {
  public readonly nodes = signal<readonly TngTreeItem[]>(SAMPLE_NODES);
  public readonly defaultExpandedIds = signal<readonly string[]>(DEFAULT_EXPANDED);
  public readonly defaultSelectedId = signal<string | null>(null);
  public readonly ariaLabel = signal('Test tree');
  public readonly selectedIds: (string | null)[] = [];

  public onSelectedIdChange(id: string | null): void {
    this.selectedIds.push(id);
  }
}

@Component({
  imports: [TngTreeComponent],
  template: `<tng-tree data-testid="default-tree" />`,
})
class TreeDefaultHost {}

describe('tng-tree component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  // ── rendering ──

  it('exports the tree component', () => {
    expect(typeof TngTreeComponent).toBe('function');
  });

  it('renders with default inputs (empty tree)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeDefaultHost],
    }).createComponent(TreeDefaultHost);
    fixture.detectChanges();

    const root = getRoot(fixture);
    expect(root.getAttribute('aria-label')).toBe('Tree');
    expect(getItems(fixture).length).toBe(0);
  });

  it('renders visible rows for expanded nodes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const items = getItems(fixture);
    const labels = items.map((el) => el.querySelector('.tng-tree-label')?.textContent?.trim());

    expect(labels).toContain('tailng-ui');
    expect(labels).toContain('libs');
    expect(labels).toContain('components');
    expect(labels).toContain('primitives');
    expect(labels).toContain('apps');
    expect(labels).toContain('docs');
    expect(labels).toContain('playground');
    expect(labels).toContain('disabled');
  });

  it('forwards ariaLabel input to the tree root', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const root = getRoot(fixture);
    expect(root.getAttribute('aria-label')).toBe('Test tree');

    fixture.componentInstance.ariaLabel.set('File browser');
    fixture.detectChanges();
    expect(root.getAttribute('aria-label')).toBe('File browser');
  });

  // ── aria attributes ──

  it('sets role="treeitem" on each visible node', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    for (const item of getItems(fixture)) {
      expect(item.getAttribute('role')).toBe('treeitem');
    }
  });

  it('sets aria-expanded on branch nodes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const workspace = getItemById(fixture, 'workspace');
    expect(workspace.getAttribute('aria-expanded')).toBe('true');

    const libs = getItemById(fixture, 'libs');
    expect(libs.getAttribute('aria-expanded')).toBe('true');

    const components = getItemById(fixture, 'components');
    expect(components.getAttribute('aria-expanded')).toBeNull();
  });

  it('sets aria-level reflecting node depth', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const workspace = getItemById(fixture, 'workspace');
    expect(workspace.getAttribute('aria-level')).toBe('1');

    const libs = getItemById(fixture, 'libs');
    expect(libs.getAttribute('aria-level')).toBe('2');

    const components = getItemById(fixture, 'components');
    expect(components.getAttribute('aria-level')).toBe('3');
  });

  it('sets aria-disabled on disabled nodes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const disabledItem = getItemById(fixture, 'disabled-node');
    expect(disabledItem.getAttribute('aria-disabled')).toBe('true');

    const normalItem = getItemById(fixture, 'components');
    expect(normalItem.getAttribute('aria-disabled')).toBeNull();
  });

  // ── description ──

  it('renders description when provided', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const workspace = getItemById(fixture, 'workspace');
    const description = workspace.querySelector('.tng-tree-description');
    expect(description?.textContent?.trim()).toBe('Workspace root');
  });

  it('omits description element when not provided', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const components = getItemById(fixture, 'components');
    const description = components.querySelector('.tng-tree-description');
    expect(description).toBeNull();
  });

  // ── toggle buttons ──

  it('shows toggle button for branch nodes and placeholder for leaf nodes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const workspace = getItemById(fixture, 'workspace');
    expect(getToggleButton(workspace)).not.toBeNull();

    const components = getItemById(fixture, 'components');
    const placeholder = components.querySelector('.tng-tree-toggle-placeholder');
    expect(placeholder).not.toBeNull();
  });

  it('toggle button displays + for collapsed and - for expanded', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const workspace = getItemById(fixture, 'workspace');
    const toggle = getToggleButton(workspace)!;
    expect(toggle.textContent?.trim()).toBe('-');
  });

  // ── selection ──

  it('selects defaultSelectedId on initial render', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.componentInstance.defaultSelectedId.set('components');
    fixture.detectChanges();

    const components = getItemById(fixture, 'components');
    expect(components.getAttribute('aria-selected')).toBe('true');
    expect(components.classList.contains('tng-tree-item-selected')).toBe(true);
  });

  it('clicking a label button selects the node and emits selectedIdChange', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const root = getRoot(fixture);
    root.focus();
    fixture.detectChanges();

    const docsItem = getItemById(fixture, 'docs');
    const labelBtn = getLabelButton(docsItem);
    click(labelBtn);
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedIds).toContain('docs');
    expect(docsItem.classList.contains('tng-tree-item-selected')).toBe(true);
  });

  it('does not select disabled nodes on click', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const root = getRoot(fixture);
    root.focus();
    fixture.detectChanges();

    const disabledItem = getItemById(fixture, 'disabled-node');
    const labelBtn = getLabelButton(disabledItem);
    click(labelBtn);
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedIds).not.toContain('disabled-node');
  });

  // ── expand / collapse via toggle button ──

  it('clicking toggle button collapses an expanded branch', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const libsItem = getItemById(fixture, 'libs');
    const toggle = getToggleButton(libsItem)!;
    click(toggle);
    fixture.detectChanges();

    const items = getItems(fixture);
    const labels = items.map((el) => el.querySelector('.tng-tree-label')?.textContent?.trim());
    expect(labels).not.toContain('components');
    expect(labels).not.toContain('primitives');
  });

  it('clicking toggle button expands a collapsed branch', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.componentInstance.defaultExpandedIds.set(['workspace']);
    fixture.detectChanges();

    let items = getItems(fixture);
    let labels = items.map((el) => el.querySelector('.tng-tree-label')?.textContent?.trim());
    expect(labels).not.toContain('components');

    const libsItem = getItemById(fixture, 'libs');
    const toggle = getToggleButton(libsItem)!;
    click(toggle);
    fixture.detectChanges();

    items = getItems(fixture);
    labels = items.map((el) => el.querySelector('.tng-tree-label')?.textContent?.trim());
    expect(labels).toContain('components');
    expect(labels).toContain('primitives');
  });

  // ── keyboard navigation ──

  it('ArrowDown moves focus to the next visible item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const root = getRoot(fixture);
    root.focus();
    fixture.detectChanges();

    const workspace = getItemById(fixture, 'workspace');
    expect(root.getAttribute('aria-activedescendant')).toBe(workspace.id);

    pressKey(root, 'ArrowDown');
    fixture.detectChanges();

    const libs = getItemById(fixture, 'libs');
    expect(root.getAttribute('aria-activedescendant')).toBe(libs.id);

    pressKey(root, 'ArrowDown');
    fixture.detectChanges();

    const components = getItemById(fixture, 'components');
    expect(root.getAttribute('aria-activedescendant')).toBe(components.id);
  });

  it('ArrowUp moves focus to the previous visible item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.componentInstance.defaultSelectedId.set('libs');
    fixture.detectChanges();

    const root = getRoot(fixture);
    root.focus();
    fixture.detectChanges();

    pressKey(root, 'ArrowUp');
    fixture.detectChanges();

    const activedescendant = root.getAttribute('aria-activedescendant');
    const workspaceItem = getItemById(fixture, 'workspace');
    expect(activedescendant).toBe(workspaceItem.id);
  });

  it('Home moves to the first visible item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.componentInstance.defaultSelectedId.set('docs');
    fixture.detectChanges();

    const root = getRoot(fixture);
    root.focus();
    fixture.detectChanges();

    pressKey(root, 'Home');
    fixture.detectChanges();

    const activedescendant = root.getAttribute('aria-activedescendant');
    const firstItem = getItemById(fixture, 'workspace');
    expect(activedescendant).toBe(firstItem.id);
  });

  it('End moves to the last visible item', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const root = getRoot(fixture);
    root.focus();
    fixture.detectChanges();

    pressKey(root, 'End');
    fixture.detectChanges();

    const activedescendant = root.getAttribute('aria-activedescendant');
    const items = getItems(fixture);
    const lastEnabled = items.filter(
      (el) => el.getAttribute('aria-disabled') !== 'true',
    );
    expect(lastEnabled.length).toBeGreaterThan(0);
    expect(activedescendant).toBe(lastEnabled[lastEnabled.length - 1].id);
  });

  it('ArrowRight expands a collapsed branch node', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.componentInstance.defaultExpandedIds.set(['workspace']);
    fixture.detectChanges();

    const root = getRoot(fixture);
    root.focus();
    fixture.detectChanges();

    pressKey(root, 'ArrowDown');
    fixture.detectChanges();

    const libsItem = getItemById(fixture, 'libs');
    expect(root.getAttribute('aria-activedescendant')).toBe(libsItem.id);
    expect(libsItem.getAttribute('aria-expanded')).toBe('false');

    pressKey(root, 'ArrowRight');
    fixture.detectChanges();

    const updatedLibs = getItemById(fixture, 'libs');
    expect(updatedLibs.getAttribute('aria-expanded')).toBe('true');
  });

  it('ArrowLeft collapses an expanded branch node', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.componentInstance.defaultSelectedId.set('libs');
    fixture.detectChanges();

    const root = getRoot(fixture);
    root.focus();
    fixture.detectChanges();

    const libsItem = getItemById(fixture, 'libs');
    expect(libsItem.getAttribute('aria-expanded')).toBe('true');

    pressKey(root, 'ArrowLeft');
    fixture.detectChanges();

    const updatedLibs = getItemById(fixture, 'libs');
    expect(updatedLibs.getAttribute('aria-expanded')).toBe('false');
  });

  it('ArrowLeft on a leaf node moves to parent', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.componentInstance.defaultSelectedId.set('components');
    fixture.detectChanges();

    const root = getRoot(fixture);
    root.focus();
    fixture.detectChanges();

    pressKey(root, 'ArrowLeft');
    fixture.detectChanges();

    const activedescendant = root.getAttribute('aria-activedescendant');
    const libsItem = getItemById(fixture, 'libs');
    expect(activedescendant).toBe(libsItem.id);
  });

  it('Enter/Space selects the active node (does not expand/collapse)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const root = getRoot(fixture);
    root.focus();
    fixture.detectChanges();

    const workspace = getItemById(fixture, 'workspace');
    expect(root.getAttribute('aria-activedescendant')).toBe(workspace.id);

    pressKey(root, 'Enter');
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedIds).toContain('workspace');
    expect(workspace.classList.contains('tng-tree-item-selected')).toBe(true);
    expect(workspace.getAttribute('aria-expanded')).toBe('true');
  });

  it('Space selects without toggling expansion', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.componentInstance.defaultSelectedId.set('libs');
    fixture.detectChanges();

    const root = getRoot(fixture);
    root.focus();
    fixture.detectChanges();

    const libsBefore = getItemById(fixture, 'libs');
    expect(libsBefore.getAttribute('aria-expanded')).toBe('true');

    pressKey(root, ' ');
    fixture.detectChanges();

    const libsAfter = getItemById(fixture, 'libs');
    expect(libsAfter.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.componentInstance.selectedIds).toContain('libs');
  });

  // ── modifier keys ──

  it('ignores keydown when Alt or Meta is pressed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.componentInstance.defaultSelectedId.set('workspace');
    fixture.detectChanges();

    const root = getRoot(fixture);
    root.focus();
    fixture.detectChanges();

    const before = root.getAttribute('aria-activedescendant');

    root.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true, bubbles: true }),
    );
    fixture.detectChanges();
    expect(root.getAttribute('aria-activedescendant')).toBe(before);

    root.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', metaKey: true, bubbles: true }),
    );
    fixture.detectChanges();
    expect(root.getAttribute('aria-activedescendant')).toBe(before);
  });

  // ── disabled nodes ──

  it('disabled nodes have disabled buttons', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const disabledItem = getItemById(fixture, 'disabled-node');
    const labelBtn = getLabelButton(disabledItem);
    expect(labelBtn.disabled).toBe(true);
  });

  it('disabled item has tng-tree-item-disabled class', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const disabledItem = getItemById(fixture, 'disabled-node');
    expect(disabledItem.classList.contains('tng-tree-item-disabled')).toBe(true);

    const normalItem = getItemById(fixture, 'components');
    expect(normalItem.classList.contains('tng-tree-item-disabled')).toBe(false);
  });

  // ── depth indentation ──

  it('sets --tng-tree-level CSS variable based on depth', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const workspace = getItemById(fixture, 'workspace');
    expect(workspace.style.getPropertyValue('--tng-tree-level')).toBe('0');

    const libs = getItemById(fixture, 'libs');
    expect(libs.style.getPropertyValue('--tng-tree-level')).toBe('1');

    const components = getItemById(fixture, 'components');
    expect(components.style.getPropertyValue('--tng-tree-level')).toBe('2');
  });

  // ── focus on initial render ──

  it('sets activedescendant to first visible item on initialization', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.detectChanges();

    const root = getRoot(fixture);
    const workspace = getItemById(fixture, 'workspace');
    expect(root.getAttribute('aria-activedescendant')).toBe(workspace.id);
  });

  // ── active class ──

  it('applies tng-tree-item-active class to the active descendant', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TreeTestHost],
    }).createComponent(TreeTestHost);
    fixture.componentInstance.defaultSelectedId.set('docs');
    fixture.detectChanges();

    const docsItem = getItemById(fixture, 'docs');
    expect(docsItem.classList.contains('tng-tree-item-active')).toBe(true);

    const workspace = getItemById(fixture, 'workspace');
    expect(workspace.classList.contains('tng-tree-item-active')).toBe(false);
  });
});