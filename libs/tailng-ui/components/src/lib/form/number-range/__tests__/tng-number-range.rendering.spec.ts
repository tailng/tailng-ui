import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngNumberRangeComponent } from '../tng-number-range.component';

@Component({
  imports: [TngNumberRangeComponent],
  template: `<tng-number-range />`,
})
class DefaultHostComponent {}

@Component({
  imports: [TngNumberRangeComponent],
  template: `<tng-number-range [separator]="separator" />`,
})
class SeparatorHostComponent {
  public separator = 'to';
}

function setup<T>(hostType: new () => T) {
  const fixture = TestBed.configureTestingModule({
    imports: [hostType],
  }).createComponent(hostType);
  fixture.detectChanges();
  return fixture;
}

describe('tng-number-range: Rendering', () => {
  it('should create the tng-number-range component', () => {
    const fixture = setup(DefaultHostComponent);
    const el = fixture.nativeElement.querySelector('tng-number-range');
    expect(el).toBeTruthy();
  });

  it('should render a root range container', () => {
    const fixture = setup(DefaultHostComponent);
    const container = fixture.nativeElement.querySelector('.tng-number-range');
    expect(container).toBeTruthy();
  });

  it('should render exactly two native number inputs', () => {
    const fixture = setup(DefaultHostComponent);
    const inputs = fixture.nativeElement.querySelectorAll('input[type="number"]');
    expect(inputs.length).toBe(2);
  });

  it('should render the first input as the min input', () => {
    const fixture = setup(DefaultHostComponent);
    const minInput = fixture.nativeElement.querySelector('.tng-number-range__input--min');
    expect(minInput).toBeTruthy();
    expect(minInput.getAttribute('type')).toBe('number');
  });

  it('should render the second input as the max input', () => {
    const fixture = setup(DefaultHostComponent);
    const maxInput = fixture.nativeElement.querySelector('.tng-number-range__input--max');
    expect(maxInput).toBeTruthy();
    expect(maxInput.getAttribute('type')).toBe('number');
  });

  it('should render the default separator between both inputs', () => {
    const fixture = setup(DefaultHostComponent);
    const sep = fixture.nativeElement.querySelector('.tng-number-range__separator');
    expect(sep).toBeTruthy();
    expect(sep.textContent.trim()).toBe('—');
  });

  it('should render a custom separator when separator is provided', () => {
    const fixture = setup(SeparatorHostComponent);
    const sep = fixture.nativeElement.querySelector('.tng-number-range__separator');
    expect(sep.textContent.trim()).toBe('to');
  });

  it('should keep the separator hidden from assistive technologies', () => {
    const fixture = setup(DefaultHostComponent);
    const sep = fixture.nativeElement.querySelector('.tng-number-range__separator');
    expect(sep.getAttribute('aria-hidden')).toBe('true');
  });

  it('should apply the expected root CSS class', () => {
    const fixture = setup(DefaultHostComponent);
    const container = fixture.nativeElement.querySelector('.tng-number-range');
    expect(container).toBeTruthy();
  });

  it('should apply the expected min input CSS class', () => {
    const fixture = setup(DefaultHostComponent);
    const minInput = fixture.nativeElement.querySelector('.tng-number-range__input--min');
    expect(minInput.classList.contains('tng-number-range__input')).toBe(true);
  });

  it('should apply the expected max input CSS class', () => {
    const fixture = setup(DefaultHostComponent);
    const maxInput = fixture.nativeElement.querySelector('.tng-number-range__input--max');
    expect(maxInput.classList.contains('tng-number-range__input')).toBe(true);
  });

  it('should apply the expected separator CSS class', () => {
    const fixture = setup(DefaultHostComponent);
    const sep = fixture.nativeElement.querySelector('.tng-number-range__separator');
    expect(sep).toBeTruthy();
  });

  it('should be usable through the tng-number-range selector', () => {
    const fixture = setup(DefaultHostComponent);
    const el = fixture.nativeElement.querySelector('tng-number-range');
    expect(el.tagName.toLowerCase()).toBe('tng-number-range');
  });

  it('should be importable as a standalone Angular component', () => {
    expect(TngNumberRangeComponent).toBeDefined();
  });

  it('should compile inside a host test component', () => {
    expect(() => setup(DefaultHostComponent)).not.toThrow();
  });

  it('should compile without requiring Angular modules', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TngNumberRangeComponent],
    }).createComponent(TngNumberRangeComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
