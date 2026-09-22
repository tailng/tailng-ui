import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { describe, expect, it } from 'vitest';

import { TngCheckboxAngularFormsAdapter } from '../../angular-forms-adapters';
import { TngCheckboxComponent, type TngCheckboxModelValue } from '../tng-checkbox.component';

@Component({
  imports: [ReactiveFormsModule, TngCheckboxComponent, TngCheckboxAngularFormsAdapter],
  template: `
    <tng-checkbox tngAngularForms data-testid="reactive-control" [formControl]="control">
      Reactive checkbox
    </tng-checkbox>
  `,
})
class ReactiveFormControlHostComponent {
  public readonly control = new FormControl<TngCheckboxModelValue>(false, { nonNullable: true });
}

@Component({
  imports: [ReactiveFormsModule, TngCheckboxComponent, TngCheckboxAngularFormsAdapter],
  template: `
    <form [formGroup]="form">
      <tng-checkbox tngAngularForms data-testid="reactive-name" formControlName="consent">
        Reactive name checkbox
      </tng-checkbox>
    </form>
  `,
})
class ReactiveFormControlNameHostComponent {
  public readonly form = new FormGroup({
    consent: new FormControl<TngCheckboxModelValue>(false, { nonNullable: true }),
  });
}

@Component({
  imports: [FormsModule, TngCheckboxComponent, TngCheckboxAngularFormsAdapter],
  template: `
    <tng-checkbox tngAngularForms data-testid="ng-model" name="consent" [(ngModel)]="value">
      NgModel checkbox
    </tng-checkbox>
  `,
})
class NgModelHostComponent {
  public value: TngCheckboxModelValue = false;
}

function queryInputByTestId(
  fixture: ReturnType<typeof TestBed.createComponent>,
  testId: string,
): HTMLInputElement {
  const input = fixture.nativeElement.querySelector(
    `[data-testid="${testId}"] input[type="checkbox"]`,
  );
  if (!(input instanceof HTMLInputElement)) {
    throw new Error(`Expected checkbox input for data-testid="${testId}".`);
  }

  return input;
}

describe('tng-checkbox component forms integration', () => {
  it('works with formControl for writeValue, user changes, touched, and disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ReactiveFormControlHostComponent],
    }).createComponent(ReactiveFormControlHostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const input = queryInputByTestId(fixture, 'reactive-control');

    host.control.setValue(true);
    fixture.detectChanges();
    expect(input.checked).toBe(true);
    expect(input.indeterminate).toBe(false);

    host.control.setValue('mixed');
    fixture.detectChanges();
    expect(input.checked).toBe(false);
    expect(input.indeterminate).toBe(true);

    input.checked = true;
    input.indeterminate = false;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(host.control.value).toBe(true);

    input.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    expect(host.control.touched).toBe(true);

    host.control.disable();
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
  });

  it('works with formControlName', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ReactiveFormControlNameHostComponent],
    }).createComponent(ReactiveFormControlNameHostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const input = queryInputByTestId(fixture, 'reactive-name');

    host.form.controls.consent.setValue(true);
    fixture.detectChanges();
    expect(input.checked).toBe(true);

    input.checked = false;
    input.indeterminate = false;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(host.form.controls.consent.value).toBe(false);
  });

  it('works with ngModel', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [NgModelHostComponent],
    }).createComponent(NgModelHostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const input = queryInputByTestId(fixture, 'ng-model');

    expect(host.value).toBe(false);
    expect(input.checked).toBe(false);

    input.checked = true;
    input.indeterminate = false;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(host.value).toBe(true);
  });
});
