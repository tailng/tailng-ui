import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngMultiSelectComponent } from './tng-multiselect.component';

function pointerdown(element: HTMLElement): void {
  element.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
    }),
  );
}

function getOpenOption(): HTMLElement {
  const overlays = Array.from(
    document.querySelectorAll<HTMLElement>('[data-slot="select-overlay"]'),
  );
  const openOverlay = overlays.find((overlay) => !overlay.hasAttribute('hidden'));
  const option = openOverlay?.querySelector<HTMLElement>('[data-slot="multi-select-option"]');

  if (!option) {
    throw new Error('Expected an option in the open multiselect overlay');
  }

  return option;
}

@Component({
  imports: [TngMultiSelectComponent],
  template: `
    @if (showMultiselect()) {
      <tng-multiselect
        [options]="options"
        [value]="selected()"
        (valueChange)="handleValueChange($event)"
        [getOptionValue]="getOptionValue"
        [getOptionLabel]="getOptionLabel"
      />
    }
  `,
})
class ControlledMultiselectHost {
  readonly showMultiselect = signal(true);
  readonly selected = signal<readonly string[]>(['scope.read']);
  readonly options = [{ value: 'scope.read', label: 'scope.read' }];
  readonly valueChanges: string[][] = [];

  readonly getOptionValue = (option: { value: string }): string => option.value;
  readonly getOptionLabel = (option: { label: string }): string => option.label;

  handleValueChange(value: readonly string[]): void {
    this.valueChanges.push([...value]);
    this.selected.set(value);
  }
}

describe('tng-multiselect component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    document.querySelectorAll('[data-slot="select-overlay"]').forEach((overlay) => overlay.remove());
  });

  it('exports the multiselect component', () => {
    expect(typeof TngMultiSelectComponent).toBe('function');
  });

  it('does not emit a value change or clear the controlled value when destroyed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledMultiselectHost],
    }).createComponent(ControlledMultiselectHost);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    host.valueChanges.length = 0;

    host.showMultiselect.set(false);
    fixture.detectChanges();

    expect(host.valueChanges).toEqual([]);
    expect(host.selected()).toEqual(['scope.read']);
  });

  it('emits an empty value when the user deselects the selected option', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledMultiselectHost],
    }).createComponent(ControlledMultiselectHost);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    host.valueChanges.length = 0;

    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    pointerdown(trigger);
    fixture.detectChanges();

    pointerdown(getOpenOption());
    fixture.detectChanges();

    expect(host.valueChanges).toEqual([[]]);
    expect(host.selected()).toEqual([]);
  });
});
