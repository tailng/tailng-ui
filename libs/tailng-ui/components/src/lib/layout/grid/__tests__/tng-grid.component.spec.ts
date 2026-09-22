import { Component } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  TngGridCellComponent,
  TngGridComponent,
  TngGridRowComponent,
} from '../tng-grid.component';

@Component({
  standalone: true,
  imports: [TngGridComponent, TngGridRowComponent, TngGridCellComponent],
  template: `
    <tng-grid
      ariaLabel="Component grid"
      selectionMode="single"
      (valueChange)="valueChanges.push($event)"
      data-testid="grid"
    >
      <tng-grid-row>
        <tng-grid-cell data-testid="cell-0-0" [rowIndex]="0" [colIndex]="0">One</tng-grid-cell>
        <tng-grid-cell data-testid="cell-0-1" [rowIndex]="0" [colIndex]="1">Two</tng-grid-cell>
      </tng-grid-row>
      <tng-grid-row>
        <tng-grid-cell data-testid="cell-1-0" [rowIndex]="1" [colIndex]="0">Three</tng-grid-cell>
        <tng-grid-cell data-testid="cell-1-1" [rowIndex]="1" [colIndex]="1">Four</tng-grid-cell>
      </tng-grid-row>
    </tng-grid>
  `,
})
class GridComponentHarnessComponent {
  public readonly valueChanges: (Readonly<{ col: number; row: number }> | null)[] = [];
}

function getByTestId(
  fixture: ComponentFixture<GridComponentHarnessComponent>,
  testId: string,
): HTMLElement {
  const hostElement = fixture.nativeElement as HTMLElement;
  const element = hostElement.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
  if (element === null) {
    throw new Error(`Missing element with data-testid="${testId}"`);
  }

  return element;
}

function dispatchKeydown(element: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key,
  });
  element.dispatchEvent(event);
  return event;
}

describe('tng-grid component wrappers', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports grid wrapper components', () => {
    expect(typeof TngGridComponent).toBe('function');
    expect(typeof TngGridRowComponent).toBe('function');
    expect(typeof TngGridCellComponent).toBe('function');
  });

  it('forwards primitive roles and aria metadata through the wrapper host elements', async () => {
    await TestBed.configureTestingModule({
      imports: [GridComponentHarnessComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GridComponentHarnessComponent);
    fixture.detectChanges();

    const grid = getByTestId(fixture, 'grid');
    const cell00 = getByTestId(fixture, 'cell-0-0');

    expect(grid.tagName.toLowerCase()).toBe('tng-grid');
    expect(grid.getAttribute('role')).toBe('grid');
    expect(grid.getAttribute('aria-label')).toBe('Component grid');
    expect(cell00.getAttribute('role')).toBe('gridcell');
    expect(cell00.getAttribute('tabindex')).toBe('0');
  });

  it('keeps keyboard navigation and selection behavior when using wrapper components', async () => {
    await TestBed.configureTestingModule({
      imports: [GridComponentHarnessComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(GridComponentHarnessComponent);
    fixture.detectChanges();

    const cell00 = getByTestId(fixture, 'cell-0-0');
    cell00.focus();
    fixture.detectChanges();

    const moveEvent = dispatchKeydown(cell00, 'ArrowRight');
    fixture.detectChanges();
    expect(moveEvent.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(getByTestId(fixture, 'cell-0-1'));

    const activateEvent = dispatchKeydown(getByTestId(fixture, 'cell-0-1'), 'Enter');
    fixture.detectChanges();
    expect(activateEvent.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.valueChanges.at(-1)).toEqual({ col: 1, row: 0 });
    expect(getByTestId(fixture, 'cell-0-1').hasAttribute('data-selected')).toBe(true);
  });
});
