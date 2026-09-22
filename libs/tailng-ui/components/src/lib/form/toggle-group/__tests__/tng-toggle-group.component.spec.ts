import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TngToggle } from '@tailng-ui/primitives';
import { describe, expect, it } from 'vitest';

import { TngToggleGroupComponent } from '../tng-toggle-group.component';

@Component({
  imports: [TngToggleGroupComponent, TngToggle],
  template: `
    <tng-toggle-group
      data-testid="group"
      [ariaLabel]="ariaLabel()"
      [orientation]="orientation()"
      [selectionMode]="selectionMode()"
      [disabled]="disabled()"
      [value]="value()"
      [values]="values()"
      (valueChange)="onValueChange($event)"
      (valuesChange)="onValuesChange($event)"
    >
      <button tngToggle data-testid="grid" tngToggleValue="grid">Grid</button>
      <button tngToggle data-testid="list" tngToggleValue="list">List</button>
      <button tngToggle data-testid="detail" tngToggleValue="detail" [disabled]="detailDisabled()">
        Detail
      </button>
    </tng-toggle-group>
  `,
})
class ToggleGroupComponentHost {
  public readonly ariaLabel = signal('View options');
  public readonly orientation = signal<'horizontal' | 'vertical'>('vertical');
  public readonly selectionMode = signal<'multiple' | 'single'>('single');
  public readonly disabled = signal(false);
  public readonly detailDisabled = signal(false);
  public readonly value = signal<string | null | undefined>(undefined);
  public readonly values = signal<readonly string[] | undefined>(undefined);

  public readonly valueChanges: (string | null)[] = [];
  public readonly valuesChanges: (readonly string[])[] = [];

  public onValueChange(nextValue: string | null): void {
    this.valueChanges.push(nextValue);
    this.value.set(nextValue);
  }

  public onValuesChange(nextValues: readonly string[]): void {
    this.valuesChanges.push(nextValues);
    this.values.set([...nextValues]);
  }
}

function queryElement(
  fixture: ReturnType<typeof TestBed.createComponent>,
  selector: string,
): HTMLElement {
  const element = fixture.nativeElement.querySelector(selector);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Expected element for selector "${selector}".`);
  }

  return element;
}

function queryButton(
  fixture: ReturnType<typeof TestBed.createComponent>,
  testId: string,
): HTMLButtonElement {
  const button = queryElement(fixture, `[data-testid="${testId}"]`);
  if (!(button instanceof HTMLButtonElement)) {
    throw new Error(`Expected button for "${testId}".`);
  }

  return button;
}

function click(element: HTMLElement): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 });
  element.dispatchEvent(event);
  return event;
}

describe('tng-toggle-group component', () => {
  it('forwards group semantics to the primitive host', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleGroupComponentHost],
    }).createComponent(ToggleGroupComponentHost);

    fixture.detectChanges();
    const group = queryElement(fixture, '[data-testid="group"]');

    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-label')).toBe('View options');
    expect(group.getAttribute('data-orientation')).toBe('vertical');
    expect(group.getAttribute('data-selection-mode')).toBe('single');
  });

  it('updates selected value in single mode', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleGroupComponentHost],
    }).createComponent(ToggleGroupComponentHost);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const gridButton = queryButton(fixture, 'grid');
    const listButton = queryButton(fixture, 'list');

    click(gridButton);
    fixture.detectChanges();
    expect(host.valueChanges).toEqual(['grid']);
    expect(gridButton.getAttribute('aria-pressed')).toBe('true');
    expect(listButton.getAttribute('aria-pressed')).toBe('false');

    click(listButton);
    fixture.detectChanges();
    expect(host.valueChanges).toEqual(['grid', 'list']);
    expect(gridButton.getAttribute('aria-pressed')).toBe('false');
    expect(listButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('updates selected values in multiple mode', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleGroupComponentHost],
    }).createComponent(ToggleGroupComponentHost);

    const host = fixture.componentInstance;
    host.selectionMode.set('multiple');
    fixture.detectChanges();

    const gridButton = queryButton(fixture, 'grid');
    const listButton = queryButton(fixture, 'list');

    click(gridButton);
    fixture.detectChanges();
    click(listButton);
    fixture.detectChanges();
    expect(host.valuesChanges.at(-1)).toEqual(['grid', 'list']);

    click(gridButton);
    fixture.detectChanges();
    expect(host.valuesChanges.at(-1)).toEqual(['list']);
  });

  it('respects disabled group and disabled item states', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ToggleGroupComponentHost],
    }).createComponent(ToggleGroupComponentHost);

    const host = fixture.componentInstance;
    host.selectionMode.set('single');
    host.detailDisabled.set(true);
    fixture.detectChanges();

    const detailButton = queryButton(fixture, 'detail');
    click(detailButton);
    fixture.detectChanges();
    expect(host.valueChanges).toEqual([]);

    host.disabled.set(true);
    fixture.detectChanges();

    const gridButton = queryButton(fixture, 'grid');
    click(gridButton);
    fixture.detectChanges();
    expect(host.valueChanges).toEqual([]);
    expect(gridButton.disabled).toBe(true);
  });
});
