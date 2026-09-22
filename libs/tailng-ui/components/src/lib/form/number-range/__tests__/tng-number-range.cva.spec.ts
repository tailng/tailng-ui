import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import type { TngNumberRangeValue } from '@tailng-ui/primitives';
import { describe, expect, it } from 'vitest';


import { TngNumberRangeAngularFormsAdapter } from '../../angular-forms-adapters';
import { TngNumberRangeComponent } from '../tng-number-range.component';

// ── Hosts ────────────────────────────────────────────────────────────────────

@Component({
  imports: [ReactiveFormsModule, TngNumberRangeComponent, TngNumberRangeAngularFormsAdapter],
  template: `
    <tng-number-range tngAngularForms [formControl]="control" />
  `,
})
class ReactiveFormControlHostComponent {
  public readonly control = new FormControl<TngNumberRangeValue | null>(null);
}

@Component({
  imports: [ReactiveFormsModule, TngNumberRangeComponent, TngNumberRangeAngularFormsAdapter],
  template: `
    <form [formGroup]="form">
      <tng-number-range tngAngularForms formControlName="range" />
    </form>
  `,
})
class ReactiveFormGroupHostComponent {
  public readonly form = new FormGroup({
    range: new FormControl<TngNumberRangeValue | null>(null),
  });
}

@Component({
  imports: [FormsModule, TngNumberRangeComponent, TngNumberRangeAngularFormsAdapter],
  template: `
    <tng-number-range tngAngularForms [(ngModel)]="value" name="priceRange" />
  `,
})
class NgModelHostComponent {
  public value: TngNumberRangeValue | null = null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function setup<T>(hostType: new () => T) {
  const fixture = TestBed.configureTestingModule({
    imports: [hostType],
  }).createComponent(hostType);
  fixture.detectChanges();
  return fixture;
}

function getMinInput(el: HTMLElement): HTMLInputElement {
  return el.querySelector('.tng-number-range__input--min')!;
}

function getMaxInput(el: HTMLElement): HTMLInputElement {
  return el.querySelector('.tng-number-range__input--max')!;
}

function dispatchInput(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function dispatchBlur(input: HTMLInputElement): void {
  input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('tng-number-range: legacy Angular forms adapter', () => {
  it('keeps ControlValueAccessor methods out of the component class', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    const component = fixture.debugElement.children[0].componentInstance as TngNumberRangeComponent & {
      registerOnChange?: unknown;
      registerOnTouched?: unknown;
      setDisabledState?: unknown;
      writeValue?: unknown;
    };
    expect(component.writeValue).toBeUndefined();
    expect(component.registerOnChange).toBeUndefined();
    expect(component.registerOnTouched).toBeUndefined();
    expect(component.setDisabledState).toBeUndefined();
  });

  it('should write min and max values from form control', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue({ min: 20, max: 80 });
    fixture.detectChanges();

    expect(getMinInput(fixture.nativeElement).value).toBe('20');
    expect(getMaxInput(fixture.nativeElement).value).toBe('80');
  });

  it('should write null form value as { min: null, max: null }', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue(null);
    fixture.detectChanges();

    expect(getMinInput(fixture.nativeElement).value).toBe('');
    expect(getMaxInput(fixture.nativeElement).value).toBe('');
  });

  it('should normalize missing min to null in writeValue', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue({ max: 100 } as unknown as TngNumberRangeValue);
    fixture.detectChanges();
    expect(getMinInput(fixture.nativeElement).value).toBe('');
  });

  it('should normalize missing max to null in writeValue', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue({ min: 10 } as unknown as TngNumberRangeValue);
    fixture.detectChanges();
    expect(getMaxInput(fixture.nativeElement).value).toBe('');
  });

  it('should call registered onChange when min changes', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue({ min: 10, max: 100 });
    fixture.detectChanges();

    dispatchInput(getMinInput(fixture.nativeElement), '20');

    expect(fixture.componentInstance.control.value).toEqual({ min: 20, max: 100 });
  });

  it('should call registered onChange when max changes', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue({ min: 10, max: 100 });
    fixture.detectChanges();

    dispatchInput(getMaxInput(fixture.nativeElement), '200');

    expect(fixture.componentInstance.control.value).toEqual({ min: 10, max: 200 });
  });

  it('should call registered onTouched when min blurs', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.detectChanges();

    dispatchBlur(getMinInput(fixture.nativeElement));

    expect(fixture.componentInstance.control.touched).toBe(true);
  });

  it('should call registered onTouched when max blurs', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.detectChanges();

    dispatchBlur(getMaxInput(fixture.nativeElement));

    expect(fixture.componentInstance.control.touched).toBe(true);
  });

  it('should disable both inputs when form control is disabled', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    expect(getMinInput(fixture.nativeElement).disabled).toBe(true);
    expect(getMaxInput(fixture.nativeElement).disabled).toBe(true);
  });

  it('should enable both inputs when form control is enabled', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    fixture.componentInstance.control.enable();
    fixture.detectChanges();

    expect(getMinInput(fixture.nativeElement).disabled).toBe(false);
    expect(getMaxInput(fixture.nativeElement).disabled).toBe(false);
  });

  it('should update form control value with full range object', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue({ min: 10, max: 100 });
    fixture.detectChanges();

    dispatchInput(getMinInput(fixture.nativeElement), '30');

    expect(fixture.componentInstance.control.value).toEqual({ min: 30, max: 100 });
  });
});

describe('tng-number-range: Reactive forms integration', () => {
  it('should initialize from a reactive form control value', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ReactiveFormControlHostComponent],
    }).createComponent(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue({ min: 5, max: 50 });
    fixture.detectChanges();

    expect(getMinInput(fixture.nativeElement).value).toBe('5');
    expect(getMaxInput(fixture.nativeElement).value).toBe('50');
  });

  it('should update the form control when min changes', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue({ min: 10, max: 100 });
    fixture.detectChanges();

    dispatchInput(getMinInput(fixture.nativeElement), '20');
    expect(fixture.componentInstance.control.value?.min).toBe(20);
  });

  it('should update the form control when max changes', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue({ min: 10, max: 100 });
    fixture.detectChanges();

    dispatchInput(getMaxInput(fixture.nativeElement), '200');
    expect(fixture.componentInstance.control.value?.max).toBe(200);
  });

  it('should mark form control as dirty after user change', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue({ min: 10, max: 100 });
    fixture.detectChanges();

    dispatchInput(getMinInput(fixture.nativeElement), '20');
    expect(fixture.componentInstance.control.dirty).toBe(true);
  });

  it('should mark form control as touched after blur', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.detectChanges();

    dispatchBlur(getMinInput(fixture.nativeElement));
    expect(fixture.componentInstance.control.touched).toBe(true);
  });

  it('should respect disabled form control state', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    expect(getMinInput(fixture.nativeElement).disabled).toBe(true);
  });

  it('should reset inputs when form control resets to null', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue({ min: 10, max: 100 });
    fixture.detectChanges();

    fixture.componentInstance.control.reset(null);
    fixture.detectChanges();

    expect(getMinInput(fixture.nativeElement).value).toBe('');
    expect(getMaxInput(fixture.nativeElement).value).toBe('');
  });

  it('should reset inputs when form control resets to { min: null, max: null }', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue({ min: 10, max: 100 });
    fixture.detectChanges();

    fixture.componentInstance.control.reset({ min: null, max: null });
    fixture.detectChanges();

    expect(getMinInput(fixture.nativeElement).value).toBe('');
    expect(getMaxInput(fixture.nativeElement).value).toBe('');
  });

  it('should preserve partial form values', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue({ min: 10, max: null });
    fixture.detectChanges();

    expect(getMinInput(fixture.nativeElement).value).toBe('10');
    expect(getMaxInput(fixture.nativeElement).value).toBe('');
  });

  it('should work with formControlName in a formGroup', () => {
    const fixture = setup(ReactiveFormGroupHostComponent);
    fixture.componentInstance.form.patchValue({ range: { min: 5, max: 50 } });
    fixture.detectChanges();

    expect(getMinInput(fixture.nativeElement).value).toBe('5');
    expect(getMaxInput(fixture.nativeElement).value).toBe('50');
  });
});

describe('tng-number-range: Focus and blur behavior', () => {
  it('should call touched callback when min input blurs', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    dispatchBlur(getMinInput(fixture.nativeElement));
    expect(fixture.componentInstance.control.touched).toBe(true);
  });

  it('should call touched callback when max input blurs', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    dispatchBlur(getMaxInput(fixture.nativeElement));
    expect(fixture.componentInstance.control.touched).toBe(true);
  });

  it('should preserve value when focus moves from min to max', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue({ min: 10, max: 100 });
    fixture.detectChanges();

    dispatchBlur(getMinInput(fixture.nativeElement));

    expect(getMaxInput(fixture.nativeElement).value).toBe('100');
  });

  it('should preserve value when focus leaves the component', () => {
    const fixture = setup(ReactiveFormControlHostComponent);
    fixture.componentInstance.control.setValue({ min: 10, max: 100 });
    fixture.detectChanges();

    dispatchBlur(getMaxInput(fixture.nativeElement));

    expect(getMinInput(fixture.nativeElement).value).toBe('10');
    expect(getMaxInput(fixture.nativeElement).value).toBe('100');
  });
});
