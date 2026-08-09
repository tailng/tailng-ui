import { Component, signal } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';

import { TngRangeSliderComponent } from './tng-range-slider.component';
import {
  normalizeTngRangeSliderGap,
  normalizeTngRangeSliderValue,
  snapTngSliderValue,
  tngSliderValuePercent,
  type TngRangeSliderValue,
} from './tng-slider.utils';

@Component({
  imports: [TngRangeSliderComponent],
  template: `
    <tng-range-slider
      data-testid="range"
      [value]="range()"
      (valueChange)="range.set($event)"
      [min]="0"
      [max]="100"
      [step]="5"
      [minGap]="10"
      aria-label="Price range"
      minAriaLabel="Minimum price"
      maxAriaLabel="Maximum price"
    />
  `,
})
class RangeSliderHostComponent {
  public readonly range = signal<TngRangeSliderValue>({ min: 20, max: 80 });
}

function queryInputs(
  fixture: ComponentFixture<RangeSliderHostComponent>,
): readonly [HTMLInputElement, HTMLInputElement] {
  const inputs = Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>(
      'input[type="range"]',
    ),
  );
  if (inputs.length !== 2 || inputs[0] === undefined || inputs[1] === undefined) {
    throw new Error('Expected two range-slider inputs.');
  }
  return [inputs[0], inputs[1]];
}

describe('tng-range-slider value helpers', () => {
  it('snaps values relative to the lower bound', () => {
    expect(snapTngSliderValue(14, 2, 30, 5)).toBe(12);
    expect(snapTngSliderValue(15, 2, 30, 5)).toBe(17);
  });

  it('normalizes decimal values without floating-point drift', () => {
    expect(snapTngSliderValue(0.31, 0, 1, 0.1)).toBe(0.3);
  });

  it('aligns minGap to the configured step and available span', () => {
    expect(normalizeTngRangeSliderGap(6, 0, 100, 5)).toBe(10);
    expect(normalizeTngRangeSliderGap(200, 0, 100, 5)).toBe(100);
  });

  it('orders, clamps, and separates an external range value', () => {
    expect(normalizeTngRangeSliderValue({ min: 95, max: 15 }, 0, 100, 5, 10)).toEqual({
      min: 15,
      max: 95,
    });
    expect(normalizeTngRangeSliderValue({ min: 98, max: 100 }, 0, 100, 5, 10)).toEqual({
      min: 90,
      max: 100,
    });
  });

  it('calculates a bounded track percentage', () => {
    expect(tngSliderValuePercent(25, 0, 100)).toBe(25);
    expect(tngSliderValuePercent(200, 0, 100)).toBe(100);
    expect(tngSliderValuePercent(10, 10, 10)).toBe(0);
  });
});

describe('tng-range-slider component', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('renders two labelled native range inputs and the selected fill', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [RangeSliderHostComponent],
    }).createComponent(RangeSliderHostComponent);
    fixture.detectChanges();

    const [minInput, maxInput] = queryInputs(fixture);
    const host = fixture.nativeElement as HTMLElement;
    const fill = host.querySelector('[data-slot="range-slider-fill"]');

    expect(minInput.value).toBe('20');
    expect(minInput.max).toBe('70');
    expect(maxInput.value).toBe('80');
    expect(maxInput.min).toBe('30');
    expect(fill).toBeTruthy();
    expect(minInput.getAttribute('aria-labelledby')).toContain('-min-label');
    expect(maxInput.getAttribute('aria-labelledby')).toContain('-max-label');
  });

  it('updates either endpoint through the component value model', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [RangeSliderHostComponent],
    }).createComponent(RangeSliderHostComponent);
    fixture.detectChanges();

    const [minInput, maxInput] = queryInputs(fixture);
    minInput.value = '45';
    minInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.range()).toEqual({ min: 45, max: 80 });

    maxInput.value = '65';
    maxInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.range()).toEqual({ min: 45, max: 65 });
  });

  it('prevents either endpoint from crossing the configured gap', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [RangeSliderHostComponent],
    }).createComponent(RangeSliderHostComponent);
    fixture.detectChanges();

    const [minInput, maxInput] = queryInputs(fixture);
    minInput.value = '95';
    minInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.range()).toEqual({ min: 70, max: 80 });

    maxInput.value = '20';
    maxInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.range()).toEqual({ min: 70, max: 80 });
  });
});
