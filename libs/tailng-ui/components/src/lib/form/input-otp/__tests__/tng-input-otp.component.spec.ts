import { Component, signal } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { afterEach, describe, expect, it } from 'vitest';
import { TngInputOtpAngularFormsAdapter } from '../../angular-forms-adapters';
import {
  applyTngOtpCharacters,
  removeTngOtpCharacter,
  resolveTngOtpEndIndex,
  resolveTngOtpEntryIndex,
  sanitizeTngOtpCharacters,
  toTngOtpSlots,
  TngInputOtpComponent,
} from '../tng-input-otp.component';

function queryOtpHost(fixture: ComponentFixture<unknown>): HTMLElement {
  const host = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="otp"]');
  if (!(host instanceof HTMLElement)) {
    throw new Error('Expected OTP host element.');
  }

  return host;
}

function queryOtpRoot(host: HTMLElement): HTMLElement {
  const root = host.querySelector('.tng-input-otp-root');
  if (!(root instanceof HTMLElement)) {
    throw new Error('Expected OTP root element.');
  }

  return root;
}

function querySlots(host: HTMLElement): HTMLInputElement[] {
  return Array.from(host.querySelectorAll<HTMLInputElement>('.tng-input-otp-slot'));
}

function queryHiddenInput(host: HTMLElement): HTMLInputElement {
  const input = host.querySelector('.tng-input-otp-hidden-input');
  if (!(input instanceof HTMLInputElement)) {
    throw new Error('Expected hidden input.');
  }

  return input;
}

function inputText(target: HTMLInputElement, value: string): void {
  target.value = value;
  target.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
}

function pressKey(target: HTMLInputElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
  target.dispatchEvent(event);
  return event;
}

function pasteText(target: HTMLInputElement, value: string): ClipboardEvent {
  const event = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent;
  Object.defineProperty(event, 'clipboardData', {
    configurable: true,
    value: {
      getData: () => value,
    },
  });
  target.dispatchEvent(event);
  return event;
}

@Component({
  imports: [TngInputOtpComponent],
  template: `
    <tng-input-otp
      data-testid="otp"
      [length]="length()"
      [defaultValue]="defaultValue()"
      [type]="type()"
      [pattern]="pattern()"
      [readonly]="readonly()"
      [disabled]="disabled()"
      [required]="required()"
      [invalid]="invalid()"
      [name]="name()"
      [placeholderChar]="placeholderChar()"
      [ariaLabel]="ariaLabel()"
      [ariaDescribedby]="ariaDescribedby()"
      (valueChange)="onValueChange($event)"
      (complete)="onComplete($event)"
    ></tng-input-otp>
  `,
})
class UncontrolledOtpHostComponent {
  public readonly length = signal(6);
  public readonly defaultValue = signal('');
  public readonly type = signal<'numeric' | 'alphanumeric' | 'custom'>('numeric');
  public readonly pattern = signal<string | RegExp | readonly RegExp[] | null>(null);
  public readonly readonly = signal(false);
  public readonly disabled = signal(false);
  public readonly required = signal(false);
  public readonly invalid = signal(false);
  public readonly name = signal<string | null>('otp');
  public readonly placeholderChar = signal('-');
  public readonly ariaLabel = signal<string | null>(null);
  public readonly ariaDescribedby = signal<string | null>(null);

  public readonly valueChanges: string[] = [];
  public readonly completeValues: string[] = [];

  public onValueChange(value: string): void {
    this.valueChanges.push(value);
  }

  public onComplete(value: string): void {
    this.completeValues.push(value);
  }
}

@Component({
  imports: [TngInputOtpComponent],
  template: `
    <tng-input-otp
      data-testid="otp"
      [length]="length()"
      [value]="value()"
      (valueChange)="onValueChange($event)"
    ></tng-input-otp>
  `,
})
class ControlledOtpHostComponent {
  public readonly length = signal(6);
  public readonly value = signal('');
  public readonly emitted: string[] = [];
  public autoSync = false;

  public onValueChange(nextValue: string): void {
    this.emitted.push(nextValue);
    if (this.autoSync) {
      this.value.set(nextValue);
    }
  }
}

@Component({
  imports: [ReactiveFormsModule, TngInputOtpComponent, TngInputOtpAngularFormsAdapter],
  template: `
    <form [formGroup]="form">
      <tng-input-otp tngAngularForms data-testid="otp" formControlName="otp" [length]="6"></tng-input-otp>
    </form>
  `,
})
class ReactiveFormsOtpHostComponent {
  public readonly form = new FormGroup({
    otp: new FormControl('12', { nonNullable: true }),
  });
}

@Component({
  imports: [FormsModule, TngInputOtpComponent, TngInputOtpAngularFormsAdapter],
  template: `<tng-input-otp tngAngularForms data-testid="otp" name="otp" [(ngModel)]="value"></tng-input-otp>`,
})
class NgModelOtpHostComponent {
  public value = '8';
}

@Component({
  imports: [TngInputOtpComponent],
  template: `
    <form data-testid="form">
      <tng-input-otp data-testid="otp" [length]="4" [defaultValue]="'1357'" name="otp"></tng-input-otp>
    </form>
  `,
})
class ResetOtpHostComponent {}

@Component({
  imports: [TngInputOtpComponent],
  template: `
    <form data-testid="form">
      <tng-input-otp
        data-testid="otp"
        [length]="6"
        [defaultValue]="defaultValue()"
        [name]="'otpCode'"
      ></tng-input-otp>
    </form>
  `,
})
class FormSubmitOtpHostComponent {
  public readonly defaultValue = signal('1234');
}

describe('tng-input-otp component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the input-otp component', () => {
    expect(typeof TngInputOtpComponent).toBe('function');
  });

  it('sanitizes and applies OTP characters through helper functions', () => {
    expect(sanitizeTngOtpCharacters('1a2b', 'numeric', null)).toEqual(['1', '2']);
    expect(sanitizeTngOtpCharacters('A!9', 'alphanumeric', null)).toEqual(['A', '9']);
    expect(sanitizeTngOtpCharacters('AB12', 'custom', '[A-Z]')).toEqual(['A', 'B']);

    expect(toTngOtpSlots(4, '12')).toEqual(['1', '2', '', '']);
    expect(applyTngOtpCharacters('12', 2, ['3', '4'], 6)).toBe('1234');
    expect(removeTngOtpCharacter('1234', 1)).toBe('134');
    expect(resolveTngOtpEntryIndex('123', 6)).toBe(3);
    expect(resolveTngOtpEndIndex('123', 6)).toBe(2);
  });

  it('renders configured OTP slots and root semantics', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledOtpHostComponent],
    }).createComponent(UncontrolledOtpHostComponent);

    fixture.componentInstance.length.set(4);
    fixture.detectChanges();

    const host = queryOtpHost(fixture);
    const root = queryOtpRoot(host);
    expect(querySlots(host)).toHaveLength(4);
    expect(querySlots(host)[2].placeholder).not.toBe('null');
    expect(root.getAttribute('data-slot')).toBe('input-otp');
    expect(root.getAttribute('role')).toBe('group');
    expect(root.getAttribute('data-empty')).toBe('');
  });

  it('forwards aria label/description and required/invalid state attributes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledOtpHostComponent],
    }).createComponent(UncontrolledOtpHostComponent);

    fixture.componentInstance.ariaLabel.set('Verification code');
    fixture.componentInstance.ariaDescribedby.set('otp-help otp-error');
    fixture.componentInstance.required.set(true);
    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();

    const root = queryOtpRoot(queryOtpHost(fixture));
    expect(root.getAttribute('aria-label')).toBe('Verification code');
    expect(root.getAttribute('aria-describedby')).toBe('otp-help otp-error');
    expect(root.getAttribute('aria-required')).toBe('true');
    expect(root.getAttribute('aria-invalid')).toBe('true');
  });

  it('hydrates uncontrolled slots from defaultValue', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledOtpHostComponent],
    }).createComponent(UncontrolledOtpHostComponent);

    fixture.componentInstance.length.set(4);
    fixture.componentInstance.type.set('alphanumeric');
    fixture.componentInstance.defaultValue.set('1A2B');
    fixture.detectChanges();

    const values = querySlots(queryOtpHost(fixture)).map((slot) => slot.value);
    expect(values).toEqual(['1', 'A', '2', 'B']);
    expect(queryHiddenInput(queryOtpHost(fixture)).value).toBe('1A2B');
  });

  it('types into uncontrolled slots, auto-advances, and emits complete value', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledOtpHostComponent],
    }).createComponent(UncontrolledOtpHostComponent);

    fixture.componentInstance.length.set(4);
    fixture.detectChanges();

    const host = queryOtpHost(fixture);
    const slots = querySlots(host);

    inputText(slots[0], '1');
    fixture.detectChanges();
    inputText(slots[1], '2');
    fixture.detectChanges();
    inputText(slots[2], '3');
    fixture.detectChanges();
    inputText(slots[3], '4');
    fixture.detectChanges();

    expect(fixture.componentInstance.valueChanges.at(-1)).toBe('1234');
    expect(fixture.componentInstance.completeValues).toContain('1234');
    expect(queryHiddenInput(host).value).toBe('1234');
    expect(queryOtpRoot(host).getAttribute('data-complete')).toBe('');
  });

  it('moves focus to the next slot after typing one character', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledOtpHostComponent],
    }).createComponent(UncontrolledOtpHostComponent);

    fixture.componentInstance.length.set(4);
    fixture.detectChanges();

    const host = queryOtpHost(fixture);
    const slots = querySlots(host);

    slots[0].focus();
    fixture.detectChanges();

    inputText(slots[0], '1');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(document.activeElement).toBe(slots[1]);
  });

  it('keeps a single tab stop by exposing tabindex=0 only on the active slot', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledOtpHostComponent],
    }).createComponent(UncontrolledOtpHostComponent);

    fixture.detectChanges();
    const host = queryOtpHost(fixture);
    const slots = querySlots(host);
    const tabbableCount = slots.filter((slot) => slot.tabIndex === 0).length;
    expect(tabbableCount).toBe(1);
    expect(slots[0].tabIndex).toBe(0);

    inputText(slots[0], '1');
    fixture.detectChanges();
    const nextTabbableCount = slots.filter((slot) => slot.tabIndex === 0).length;
    expect(nextTabbableCount).toBe(1);
    expect(slots[1].tabIndex).toBe(0);
  });

  it('ignores non-numeric characters in numeric mode', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledOtpHostComponent],
    }).createComponent(UncontrolledOtpHostComponent);

    fixture.detectChanges();
    const host = queryOtpHost(fixture);

    inputText(querySlots(host)[0], 'A');
    fixture.detectChanges();

    expect(queryHiddenInput(host).value).toBe('');
    expect(querySlots(host)[0].value).toBe('');
  });

  it('replaces an existing character when typing on a focused filled slot', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledOtpHostComponent],
    }).createComponent(UncontrolledOtpHostComponent);

    fixture.componentInstance.defaultValue.set('123');
    fixture.detectChanges();
    const host = queryOtpHost(fixture);
    const slots = querySlots(host);

    slots[1].focus();
    fixture.detectChanges();
    inputText(slots[1], '9');
    fixture.detectChanges();

    expect(queryHiddenInput(host).value).toBe('193');
  });

  it('moves to the second slot when replacing the first character in a complete 4-digit OTP', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledOtpHostComponent],
    }).createComponent(UncontrolledOtpHostComponent);

    fixture.componentInstance.length.set(4);
    fixture.componentInstance.defaultValue.set('1234');
    fixture.detectChanges();

    const host = queryOtpHost(fixture);
    const slots = querySlots(host);

    slots[0].focus();
    fixture.detectChanges();
    inputText(slots[0], '5');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(queryHiddenInput(host).value).toBe('5234');
    expect(document.activeElement).toBe(slots[1]);
  });

  it('moves to the second slot when replacing the first character in a partially filled 6-digit OTP', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledOtpHostComponent],
    }).createComponent(UncontrolledOtpHostComponent);

    fixture.componentInstance.length.set(6);
    fixture.componentInstance.defaultValue.set('123');
    fixture.detectChanges();

    const host = queryOtpHost(fixture);
    const slots = querySlots(host);

    slots[0].focus();
    fixture.detectChanges();
    inputText(slots[0], '9');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(queryHiddenInput(host).value).toBe('923');
    expect(document.activeElement).toBe(slots[1]);
  });

  it('updates the model-backed visual state and emits valueChange on user input', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ControlledOtpHostComponent],
    }).createComponent(ControlledOtpHostComponent);

    fixture.componentInstance.value.set('');
    fixture.componentInstance.autoSync = false;
    fixture.detectChanges();

    const host = queryOtpHost(fixture);
    inputText(querySlots(host)[0], '7');
    fixture.detectChanges();

    expect(fixture.componentInstance.emitted).toEqual(['7']);
    expect(querySlots(host)[0].value).toBe('7');
  });

  it('distributes pasted characters from the active slot and marks complete', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledOtpHostComponent],
    }).createComponent(UncontrolledOtpHostComponent);

    fixture.componentInstance.length.set(6);
    fixture.componentInstance.defaultValue.set('12');
    fixture.detectChanges();

    const host = queryOtpHost(fixture);
    const slots = querySlots(host);
    slots[2].focus();
    fixture.detectChanges();

    const pasteEvent = pasteText(slots[2], '3456');
    fixture.detectChanges();

    expect(pasteEvent.defaultPrevented).toBe(true);
    expect(queryHiddenInput(host).value).toBe('123456');
    expect(queryOtpRoot(host).getAttribute('data-complete')).toBe('');
  });

  it('supports full code paste from the first slot', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledOtpHostComponent],
    }).createComponent(UncontrolledOtpHostComponent);

    fixture.componentInstance.length.set(6);
    fixture.detectChanges();

    const host = queryOtpHost(fixture);
    const firstSlot = querySlots(host)[0];
    const event = pasteText(firstSlot, '654321');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(queryHiddenInput(host).value).toBe('654321');
  });

  it('supports Arrow/Home/End navigation between slots', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledOtpHostComponent],
    }).createComponent(UncontrolledOtpHostComponent);

    fixture.componentInstance.defaultValue.set('1234');
    fixture.componentInstance.length.set(4);
    fixture.detectChanges();

    const host = queryOtpHost(fixture);
    const slots = querySlots(host);

    slots[2].focus();
    fixture.detectChanges();
    pressKey(slots[2], 'ArrowLeft');
    fixture.detectChanges();
    expect(document.activeElement).toBe(slots[1]);

    pressKey(slots[1], 'ArrowRight');
    fixture.detectChanges();
    expect(document.activeElement).toBe(slots[2]);

    pressKey(slots[2], 'Home');
    fixture.detectChanges();
    expect(document.activeElement).toBe(slots[0]);

    pressKey(slots[0], 'End');
    fixture.detectChanges();
    expect(document.activeElement).toBe(slots[3]);
  });

  it('clears with Backspace/Delete and moves focus backward after removal', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledOtpHostComponent],
    }).createComponent(UncontrolledOtpHostComponent);

    fixture.componentInstance.defaultValue.set('123');
    fixture.componentInstance.length.set(4);
    fixture.detectChanges();

    const host = queryOtpHost(fixture);
    const slots = querySlots(host);

    slots[2].focus();
    fixture.detectChanges();
    pressKey(slots[2], 'Backspace');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
    expect(queryHiddenInput(host).value).toBe('12');
    expect(document.activeElement).toBe(slots[1]);

    slots[2].focus();
    fixture.detectChanges();
    pressKey(slots[2], 'Backspace');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
    expect(queryHiddenInput(host).value).toBe('1');
    expect(document.activeElement).toBe(slots[1]);

    slots[0].focus();
    fixture.detectChanges();
    pressKey(slots[0], 'Delete');
    fixture.detectChanges();
    expect(queryHiddenInput(host).value).toBe('');
  });

  it('prevents edits in readonly or disabled mode', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [UncontrolledOtpHostComponent],
    }).createComponent(UncontrolledOtpHostComponent);

    fixture.componentInstance.defaultValue.set('12');
    fixture.componentInstance.readonly.set(true);
    fixture.detectChanges();

    const host = queryOtpHost(fixture);
    const firstSlot = querySlots(host)[0];

    inputText(firstSlot, '9');
    fixture.detectChanges();
    expect(queryHiddenInput(host).value).toBe('12');

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(queryOtpRoot(host).getAttribute('data-disabled')).toBe('');
    expect(firstSlot.disabled).toBe(true);
    expect(queryHiddenInput(host).disabled).toBe(true);
  });

  it('works with the explicit Reactive Forms adapter', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ReactiveFormsOtpHostComponent],
    }).createComponent(ReactiveFormsOtpHostComponent);

    fixture.detectChanges();

    const host = queryOtpHost(fixture);
    const slots = querySlots(host);

    inputText(slots[2], '3');
    fixture.detectChanges();

    const control = fixture.componentInstance.form.controls.otp;
    expect(control.value).toBe('123');

    control.disable();
    fixture.detectChanges();
    expect(querySlots(host)[0].disabled).toBe(true);

    control.enable();
    control.setValue('987');
    fixture.detectChanges();
    expect(querySlots(host).map((slot) => slot.value)).toEqual(['9', '8', '7', '', '', '']);
  });

  it('marks reactive form control as touched on blur', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ReactiveFormsOtpHostComponent],
    }).createComponent(ReactiveFormsOtpHostComponent);

    fixture.detectChanges();

    const control = fixture.componentInstance.form.controls.otp;
    const firstSlot = querySlots(queryOtpHost(fixture))[0];
    const externalFocusTarget = document.createElement('button');
    (fixture.nativeElement as HTMLElement).appendChild(externalFocusTarget);

    firstSlot.focus();
    fixture.detectChanges();

    externalFocusTarget.focus();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(control.touched).toBe(true);
  });

  it('works with ngModel binding', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [NgModelOtpHostComponent],
    }).createComponent(NgModelOtpHostComponent);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const host = queryOtpHost(fixture);
    expect(querySlots(host)[0].value).toBe('8');

    inputText(querySlots(host)[1], '1');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('81');
  });

  it('resets to defaultValue on native form reset in uncontrolled mode', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ResetOtpHostComponent],
    }).createComponent(ResetOtpHostComponent);

    fixture.detectChanges();

    const host = queryOtpHost(fixture);
    const form = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="form"]');
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('Expected form element.');
    }

    inputText(querySlots(host)[0], '9');
    fixture.detectChanges();
    expect(queryHiddenInput(host).value).toBe('9357');

    form.reset();
    fixture.detectChanges();
    expect(queryHiddenInput(host).value).toBe('1357');
  });

  it('submits partial and complete values through the hidden native input', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [FormSubmitOtpHostComponent],
    }).createComponent(FormSubmitOtpHostComponent);

    fixture.componentInstance.defaultValue.set('1234');
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const form = root.querySelector('[data-testid="form"]');
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('Expected form element.');
    }

    const partialData = new FormData(form);
    expect(partialData.get('otpCode')).toBe('1234');

    const otpHost = queryOtpHost(fixture);
    const slots = querySlots(otpHost);
    pasteText(slots[0], '987654');
    fixture.detectChanges();

    const completeData = new FormData(form);
    expect(completeData.get('otpCode')).toBe('987654');
  });
});
