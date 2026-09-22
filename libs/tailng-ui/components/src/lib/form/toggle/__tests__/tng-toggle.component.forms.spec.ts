import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { describe, expect, it } from 'vitest';

import { TngToggleAngularFormsAdapter } from '../../angular-forms-adapters';
import { TngToggleComponent } from '../tng-toggle.component';

@Component({
  imports: [ReactiveFormsModule, TngToggleComponent, TngToggleAngularFormsAdapter],
  template: `
    <tng-toggle tngAngularForms data-testid="reactive-control" [formControl]="control">
      Reactive toggle
    </tng-toggle>
  `,
})
class ReactiveFormControlHostComponent {
  public readonly control = new FormControl<boolean>(false, { nonNullable: true });
}

@Component({
  imports: [ReactiveFormsModule, TngToggleComponent, TngToggleAngularFormsAdapter],
  template: `
    <form [formGroup]="form">
      <tng-toggle tngAngularForms data-testid="reactive-name" formControlName="mode">
        Reactive named toggle
      </tng-toggle>
    </form>
  `,
})
class ReactiveFormControlNameHostComponent {
  public readonly form = new FormGroup({
    mode: new FormControl<boolean>(false, { nonNullable: true }),
  });
}

@Component({
  imports: [ReactiveFormsModule, TngToggleComponent, TngToggleAngularFormsAdapter],
  template: `
    <tng-toggle tngAngularForms data-testid="validated-control" [formControl]="control">
      Validated toggle
    </tng-toggle>
  `,
})
class ReactiveValidationHostComponent {
  public readonly control = new FormControl<boolean>(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  });
}

@Component({
  imports: [FormsModule, TngToggleComponent, TngToggleAngularFormsAdapter],
  template: `
    <tng-toggle tngAngularForms data-testid="ng-model" name="pin" [(ngModel)]="value">
      NgModel toggle
    </tng-toggle>
  `,
})
class NgModelHostComponent {
  public value = false;
}

function queryButtonByTestId(
  fixture: ReturnType<typeof TestBed.createComponent>,
  testId: string,
): HTMLButtonElement {
  const button = fixture.nativeElement.querySelector(`[data-testid="${testId}"] button`);
  if (!(button instanceof HTMLButtonElement)) {
    throw new Error(`Expected toggle button for data-testid="${testId}".`);
  }

  return button;
}

function click(button: HTMLButtonElement): void {
  button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
}

describe('tng-toggle component forms integration', () => {
  it('works with formControl (value + touched + disabled sync)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ReactiveFormControlHostComponent],
    }).createComponent(ReactiveFormControlHostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const button = queryButtonByTestId(fixture, 'reactive-control');

    host.control.setValue(true);
    fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('true');

    click(button);
    fixture.detectChanges();
    expect(host.control.value).toBe(false);

    button.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();
    expect(host.control.touched).toBe(true);

    host.control.disable();
    fixture.detectChanges();
    expect(button.disabled).toBe(true);
  });

  it('works with formControlName', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ReactiveFormControlNameHostComponent],
    }).createComponent(ReactiveFormControlNameHostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const button = queryButtonByTestId(fixture, 'reactive-name');

    host.form.controls.mode.setValue(true);
    fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('true');

    click(button);
    fixture.detectChanges();
    expect(host.form.controls.mode.value).toBe(false);
  });

  it('works with ngModel', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [NgModelHostComponent],
    }).createComponent(NgModelHostComponent);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const button = queryButtonByTestId(fixture, 'ng-model');

    expect(host.value).toBe(false);
    click(button);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.value).toBe(true);
  });

  it('preserves dirty/pristine behavior correctly', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ReactiveFormControlHostComponent],
    }).createComponent(ReactiveFormControlHostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const button = queryButtonByTestId(fixture, 'reactive-control');

    expect(host.control.pristine).toBe(true);
    expect(host.control.dirty).toBe(false);

    click(button);
    fixture.detectChanges();

    expect(host.control.pristine).toBe(false);
    expect(host.control.dirty).toBe(true);
  });

  it('exposes validation state through control validity changes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ReactiveValidationHostComponent],
    }).createComponent(ReactiveValidationHostComponent);

    fixture.detectChanges();
    const host = fixture.componentInstance;
    const button = queryButtonByTestId(fixture, 'validated-control');

    expect(host.control.invalid).toBe(true);
    expect(host.control.hasError('required')).toBe(true);

    click(button);
    fixture.detectChanges();

    expect(host.control.valid).toBe(true);
    expect(host.control.value).toBe(true);
  });
});
