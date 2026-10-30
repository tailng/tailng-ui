import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { TngInputComponent } from '../tng-input.component';

@Component({
  imports: [TngInputComponent],
  template: `
    <tng-input
      [appearance]="appearance"
      [size]="size"
      [tone]="tone"
      [fullWidth]="fullWidth"
      [placeholder]="placeholder"
      [value]="value"
      [type]="type"
      [ariaLabel]="ariaLabel"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class InputHostComponent {
  public appearance: 'outline' | 'solid' | 'ghost' = 'outline';
  public size: 'sm' | 'md' | 'lg' = 'md';
  public tone: 'neutral' | 'primary' | 'success' | 'danger' = 'neutral';
  public fullWidth = true;
  public placeholder = 'Search';
  public value = 'Nitrogen';
  public type: 'text' | 'search' | 'number' = 'text';
  public ariaLabel = 'Example input';
  public emittedValue: string | null = null;

  public onValueChange(value: string): void {
    this.emittedValue = value;
  }
}

@Component({
  imports: [TngInputComponent],
  styles: [
    `
      .host-styled-input {
        --tng-input-bg: rgb(255, 248, 220);
        --tng-input-border: rgb(203, 213, 225);
        --tng-input-font-size: 19px;
        --tng-input-font-weight: 600;
        --tng-input-line-height: 1.4;
        --tng-input-placeholder: rgb(148, 163, 184);
      }
    `,
  ],
  template: `
    <tng-input class="host-styled-input" placeholder="Search docs" ariaLabel="Search docs" />
  `,
})
class HostStyledInputComponent { }

@Component({
  imports: [TngInputComponent],
  template: `
    <tng-input
      type="number"
      [value]="value"
      [step]="step"
      [min]="min"
      [max]="max"
      [readonly]="readonly"
      [disabled]="disabled"
      (valueChange)="onValueChange($event)"
      (input)="onInputEvent($event)"
    />
  `,
})
class NumberInputHostComponent {
  public value = '1';
  public step: number | string | null = 0.5;
  public min: number | string | null = 0;
  public max: number | string | null = 2;
  public readonly = false;
  public disabled = false;
  public emittedValue: string | null = null;
  public inputEventCount = 0;
  public inputEventValue: string | null = null;

  public onValueChange(value: string): void {
    this.emittedValue = value;
    this.value = value;
  }

  public onInputEvent(event: Event): void {
    this.inputEventCount += 1;
    this.inputEventValue = event.target instanceof HTMLInputElement ? event.target.value : null;
  }
}

function dispatchKeyboardEvent(
  inputEl: HTMLInputElement,
  key: string,
  init: KeyboardEventInit = {},
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, ...init });
  inputEl.dispatchEvent(event);
  return event;
}

function dispatchBeforeInputEvent(inputEl: HTMLInputElement, data: string): InputEvent {
  const event = new InputEvent('beforeinput', {
    bubbles: true,
    cancelable: true,
    data,
    inputType: 'insertText',
  });
  inputEl.dispatchEvent(event);
  return event;
}

function dispatchPasteEvent(inputEl: HTMLInputElement, text: string): Event {
  const event = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'clipboardData', {
    configurable: true,
    value: {
      getData: (type: string) => (type === 'text/plain' || type === 'text' ? text : ''),
    },
  });
  inputEl.dispatchEvent(event);
  return event;
}

function dispatchKeyboardFocus(inputEl: HTMLInputElement): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Tab' }));
  inputEl.dispatchEvent(new FocusEvent('focus'));
}

function dispatchPointerFocus(inputEl: HTMLInputElement): void {
  inputEl.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  inputEl.dispatchEvent(new FocusEvent('focus'));
}

function dispatchPointerDoubleClickSelection(
  inputEl: HTMLInputElement,
  start: number,
  end: number,
): void {
  inputEl.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  inputEl.dispatchEvent(new FocusEvent('focus'));
  inputEl.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
  setSelectionRangeForTest(inputEl, start, end);
}

function setSelectionRangeForTest(inputEl: HTMLInputElement, start: number, end = start): void {
  Object.defineProperty(inputEl, 'selectionStart', {
    configurable: true,
    value: start,
  });
  Object.defineProperty(inputEl, 'selectionEnd', {
    configurable: true,
    value: end,
  });
}

function makeSelectionApiUnavailableForTest(inputEl: HTMLInputElement): void {
  Object.defineProperty(inputEl, 'selectionStart', {
    configurable: true,
    get: () => {
      throw new Error('selectionStart is unavailable for number input');
    },
  });
  Object.defineProperty(inputEl, 'selectionEnd', {
    configurable: true,
    get: () => {
      throw new Error('selectionEnd is unavailable for number input');
    },
  });
  Object.defineProperty(inputEl, 'setSelectionRange', {
    configurable: true,
    value: () => {
      throw new Error('setSelectionRange is unavailable for number input');
    },
  });
}

function makeSelectionApiCollapsedForTest(inputEl: HTMLInputElement, index: number): void {
  Object.defineProperty(inputEl, 'selectionStart', {
    configurable: true,
    value: index,
  });
  Object.defineProperty(inputEl, 'selectionEnd', {
    configurable: true,
    value: index,
  });
}

@Component({
  imports: [TngInputComponent],
  template: ` <tng-input type="number" [step]="step" [min]="min" [max]="max" /> `,
})
class OptionalNumberConstraintsHostComponent {
  public step: number | undefined = undefined;
  public min: number | undefined = undefined;
  public max: number | undefined = undefined;
}

@Component({
  imports: [TngInputComponent],
  template: `
    <tng-input
      [ariaErrormessage]="ariaErrormessage"
      [autocapitalize]="autocapitalize"
      [enterkeyhint]="enterkeyhint"
      [form]="form"
      [inputmode]="inputmode"
      [list]="list"
      [maxlength]="maxlength"
      [minlength]="minlength"
      [pattern]="pattern"
      [spellcheck]="spellcheck"
    />
  `,
})
class NativeInputAttributeHostComponent {
  public ariaErrormessage: string | null = 'input-error';
  public autocapitalize: string | null = 'words';
  public enterkeyhint: string | null = 'search';
  public form: string | null = 'customer-form';
  public inputmode: string | null = 'email';
  public list: string | null = 'email-suggestions';
  public maxlength: number | string | null | undefined = 64;
  public minlength: number | string | null = 3;
  public pattern: string | RegExp | readonly RegExp[] | null = '[^@]+@example\\.com';
  public spellcheck: boolean | null = false;
}

@Component({
  imports: [TngInputComponent],
  template: `
    <tng-input
      ariaLabel="Event facade"
      [value]="value"
      (input)="onInputEvent($event)"
      (change)="onChangeEvent($event)"
      (focus)="onFocusEvent($event)"
      (blur)="onBlurEvent($event)"
      (keydown)="onKeydownEvent($event)"
      (keyup)="onKeyupEvent($event)"
      (beforeinput)="onBeforeInputEvent($event)"
      (compositionstart)="onCompositionStartEvent($event)"
    />
  `,
})
class EventFacadeHostComponent {
  public value = 'Initial';
  public inputCount = 0;
  public changeCount = 0;
  public focusCount = 0;
  public blurCount = 0;
  public keydownCount = 0;
  public keyupCount = 0;
  public beforeInputCount = 0;
  public compositionStartCount = 0;
  public lastEventTarget: EventTarget | null = null;

  public onInputEvent(event: Event): void {
    this.inputCount += 1;
    this.lastEventTarget = event.target;
  }

  public onChangeEvent(event: Event): void {
    this.changeCount += 1;
    this.lastEventTarget = event.target;
  }

  public onFocusEvent(event: FocusEvent): void {
    this.focusCount += 1;
    this.lastEventTarget = event.target;
  }

  public onBlurEvent(event: FocusEvent): void {
    this.blurCount += 1;
    this.lastEventTarget = event.target;
  }

  public onKeydownEvent(event: KeyboardEvent): void {
    this.keydownCount += 1;
    this.lastEventTarget = event.target;
  }

  public onKeyupEvent(event: KeyboardEvent): void {
    this.keyupCount += 1;
    this.lastEventTarget = event.target;
  }

  public onBeforeInputEvent(event: Event): void {
    this.beforeInputCount += 1;
    this.lastEventTarget = event.target;
  }

  public onCompositionStartEvent(event: CompositionEvent): void {
    this.compositionStartCount += 1;
    this.lastEventTarget = event.target;
  }
}

const themeContractCss = [
  readFileSync(
    join(
      process.cwd(),
      'libs/tailng-ui/theme/src/lib/component-contracts/form/input-field/input-field.css',
    ),
    'utf8',
  ),
  readFileSync(
    join(process.cwd(), 'libs/tailng-ui/theme/src/lib/component-contracts/form/input/input.css'),
    'utf8',
  ),
].join('\n');

describe('<tng-input> component', () => {
  let themeStyleElement: HTMLStyleElement | null = null;

  beforeAll(() => {
    themeStyleElement = document.createElement('style');
    themeStyleElement.textContent = themeContractCss;
    document.head.appendChild(themeStyleElement);
  });

  afterAll(() => {
    themeStyleElement?.remove();
    themeStyleElement = null;
  });

  it('renders an internal native input with the provided value and placeholder', async () => {
    await TestBed.configureTestingModule({ imports: [InputHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(inputEl.value).toBe('Nitrogen');
    expect(inputEl.placeholder).toBe('Search');
    expect(inputEl.getAttribute('aria-label')).toBe('Example input');
    expect(inputEl.getAttribute('data-slot')).toBe('input');
  });

  it('keeps the native focus reset scoped to the input-group wrapper', async () => {
    await TestBed.configureTestingModule({ imports: [InputHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InputHostComponent);
    fixture.detectChanges();

    const inputGroup = fixture.debugElement.query(By.css('[data-slot="input-group"]'))
      .nativeElement as HTMLElement;
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    inputEl.focus();

    expect(inputGroup.contains(inputEl)).toBe(true);
    expect(getComputedStyle(inputEl).borderWidth).toBe('0px');
    expect(getComputedStyle(inputEl).boxShadow).toBe('none');
    expect(themeContractCss).toContain(
      ":where([data-slot='input-group']) :where([data-slot='input']:focus)",
    );
  });

  it('emits valueChange when the internal input changes', async () => {
    await TestBed.configureTestingModule({ imports: [InputHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    inputEl.value = 'Oxygen';
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.emittedValue).toBe('Oxygen');
  });

  it('emits one facade event for native input, change, focus, blur, keydown, and keyup', async () => {
    await TestBed.configureTestingModule({
      imports: [EventFacadeHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(EventFacadeHostComponent);
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input')).nativeElement as HTMLElement;
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    let hostInputBubbleCount = 0;
    let hostChangeBubbleCount = 0;
    let hostKeydownBubbleCount = 0;
    host.addEventListener('input', () => {
      hostInputBubbleCount += 1;
    });
    host.addEventListener('change', () => {
      hostChangeBubbleCount += 1;
    });
    host.addEventListener('keydown', () => {
      hostKeydownBubbleCount += 1;
    });

    inputEl.value = 'Updated';
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    inputEl.dispatchEvent(new Event('change', { bubbles: true }));
    inputEl.dispatchEvent(new FocusEvent('focus'));
    inputEl.dispatchEvent(new FocusEvent('blur'));
    inputEl.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'a' }));
    inputEl.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'a' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.inputCount).toBe(1);
    expect(fixture.componentInstance.changeCount).toBe(1);
    expect(fixture.componentInstance.focusCount).toBe(1);
    expect(fixture.componentInstance.blurCount).toBe(1);
    expect(fixture.componentInstance.keydownCount).toBe(1);
    expect(fixture.componentInstance.keyupCount).toBe(1);
    expect(fixture.componentInstance.lastEventTarget).toBe(inputEl);
    expect(hostInputBubbleCount).toBe(0);
    expect(hostChangeBubbleCount).toBe(0);
    expect(hostKeydownBubbleCount).toBe(0);
  });

  it('does not prevent default typing, beforeinput, or IME composition events', async () => {
    await TestBed.configureTestingModule({
      imports: [EventFacadeHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(EventFacadeHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    const beforeInputEvent = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      data: 'あ',
    });
    const compositionStartEvent = new CompositionEvent('compositionstart', {
      bubbles: true,
      cancelable: true,
    });

    inputEl.dispatchEvent(beforeInputEvent);
    inputEl.dispatchEvent(compositionStartEvent);
    fixture.detectChanges();

    expect(beforeInputEvent.defaultPrevented).toBe(false);
    expect(compositionStartEvent.defaultPrevented).toBe(false);
    expect(fixture.componentInstance.beforeInputCount).toBe(1);
    expect(fixture.componentInstance.compositionStartCount).toBe(1);
    expect(fixture.componentInstance.lastEventTarget).toBe(inputEl);
  });

  it('passes visual tokens through to the internal input field', async () => {
    await TestBed.configureTestingModule({ imports: [InputHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InputHostComponent);
    fixture.componentInstance.size = 'lg';
    fixture.componentInstance.appearance = 'solid';
    fixture.componentInstance.tone = 'primary';
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input')).nativeElement as HTMLElement;
    const inputField = fixture.debugElement.query(By.css('tng-input-field'))
      .nativeElement as HTMLElement;

    expect(host.getAttribute('data-size')).toBe('lg');
    expect(host.getAttribute('data-appearance')).toBe('solid');
    expect(host.getAttribute('data-tone')).toBe('primary');
    expect(inputField.getAttribute('data-size')).toBe('lg');
    expect(inputField.getAttribute('data-appearance')).toBe('solid');
    expect(inputField.getAttribute('data-tone')).toBe('primary');
  });

  it('surfaces host-level CSS variables for the theme contract to consume', async () => {
    await TestBed.configureTestingModule({
      imports: [HostStyledInputComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(HostStyledInputComponent);
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input')).nativeElement as HTMLElement;
    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    expect(getComputedStyle(host).getPropertyValue('--tng-input-bg').trim()).toBe(
      'rgb(255, 248, 220)',
    );
    expect(getComputedStyle(host).getPropertyValue('--tng-input-font-size').trim()).toBe('19px');
    expect(getComputedStyle(host).getPropertyValue('--tng-input-font-weight').trim()).toBe('600');
    expect(getComputedStyle(host).getPropertyValue('--tng-input-placeholder').trim()).toBe(
      'rgb(148, 163, 184)',
    );
    expect(themeContractCss).toContain(
      '--_tng-input-bg: var(--tng-input-bg, var(--_tng-input-bg-default));',
    );
    expect(themeContractCss).toContain(
      '--_tng-input-font-size: var(--tng-input-font-size, var(--_tng-input-font-size-default));',
    );
    expect(themeContractCss).toContain(
      'color: var(--_tng-input-placeholder, var(--tng-semantic-foreground-muted));',
    );
    expect(inputEl.placeholder).toBe('Search docs');
  });

  it('renders custom controls and passes number constraints to the native input', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const host = fixture.debugElement.query(By.css('tng-input')).nativeElement as HTMLElement;
    const controls = fixture.debugElement.query(By.css('.tng-input-number-controls'))
      .nativeElement as HTMLElement;
    const buttons = fixture.debugElement.queryAll(By.css('.tng-input-number-button'));

    expect(host.getAttribute('data-type')).toBe('number');
    expect(inputEl.type).toBe('text');
    expect(inputEl.getAttribute('inputmode')).toBe('decimal');
    expect(inputEl.getAttribute('min')).toBe('0');
    expect(inputEl.getAttribute('max')).toBe('2');
    expect(inputEl.getAttribute('step')).toBe('0.5');
    expect(controls).toBeInstanceOf(HTMLElement);
    expect(buttons).toHaveLength(2);
    expect(buttons[0].nativeElement.getAttribute('aria-label')).toBe('Increment value');
    expect(buttons[1].nativeElement.getAttribute('aria-label')).toBe('Decrement value');
  });

  it('blocks invalid beforeinput text on number inputs', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const blockedCases: readonly { current: string; data: string }[] = [
      { current: '1', data: 'e' },
      { current: '1', data: 'E' },
      { current: '1', data: '+' },
      { current: '1', data: 'a' },
      { current: '1.2', data: '.' },
      { current: '12', data: '-' },
    ];

    for (const { current, data } of blockedCases) {
      inputEl.value = current;
      setSelectionRangeForTest(inputEl, current.length);

      expect(dispatchBeforeInputEvent(inputEl, data).defaultPrevented).toBe(true);
    }
  });

  it('allows valid beforeinput text on number inputs', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const allowedCases: readonly { current: string; data: string }[] = [
      { current: '', data: '-' },
      { current: '', data: '.' },
      { current: '1', data: '.' },
      { current: '1.2', data: '3' },
    ];

    for (const { current, data } of allowedCases) {
      inputEl.value = current;
      setSelectionRangeForTest(inputEl, current.length);

      expect(dispatchBeforeInputEvent(inputEl, data).defaultPrevented).toBe(false);
    }
  });

  it('allows negative and zero number values to be entered', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();

    const values = ['-101', '-1', '0', '-.9', '-0.01'] as const;

    for (const value of values) {
      const fixture = TestBed.createComponent(NumberInputHostComponent);
      fixture.componentInstance.value = '';
      fixture.componentInstance.min = null;
      fixture.componentInstance.max = null;
      fixture.componentInstance.step = null;
      fixture.detectChanges();

      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
      let current = '';

      for (const character of value) {
        setSelectionRangeForTest(inputEl, current.length);

        const beforeInputEvent = dispatchBeforeInputEvent(inputEl, character);
        expect(beforeInputEvent.defaultPrevented).toBe(false);

        current += character;
        inputEl.value = current;
        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
        fixture.detectChanges();

        expect(inputEl.value).toBe(current);
      }

      fixture.detectChanges();

      const finalInputEl = fixture.debugElement.query(By.css('input'))
        .nativeElement as HTMLInputElement;

      expect(finalInputEl.value).toBe(value);
      expect(fixture.componentInstance.emittedValue).toBe(value);
      expect(fixture.componentInstance.inputEventCount).toBe(value.length);
      expect(fixture.componentInstance.inputEventValue).toBe(value);

      fixture.destroy();
    }
  });

  it('sanitizes messy pasted content for number inputs and emits one input event', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.componentInstance.value = '';
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    const pasteEvent = dispatchPasteEvent(inputEl, '$-1,234.50abc');
    fixture.detectChanges();

    expect(pasteEvent.defaultPrevented).toBe(true);
    expect(inputEl.value).toBe('-1234.50');
    expect(fixture.componentInstance.emittedValue).toBe('-1234.50');
    expect(fixture.componentInstance.inputEventCount).toBe(1);
    expect(fixture.componentInstance.inputEventValue).toBe('-1234.50');
  });

  it('normalizes pasted number edge cases into complete number strings', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();

    const cases: readonly {
      current?: string;
      expected: string;
      pasted: string;
      selection?: readonly [number, number];
    }[] = [
        { pasted: '.5', expected: '0.5' },
        { pasted: '-.5', expected: '-0.5' },
        { pasted: '12.', expected: '12' },
        { pasted: '12.3.4x', expected: '12.34' },
        { pasted: '1-2', expected: '12' },
        { current: '1', pasted: 'abc', expected: '', selection: [0, 1] },
      ];

    for (const { current = '', pasted, expected, selection } of cases) {
      const fixture = TestBed.createComponent(NumberInputHostComponent);
      fixture.componentInstance.value = current;
      fixture.detectChanges();

      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
      if (selection !== undefined) {
        setSelectionRangeForTest(inputEl, selection[0], selection[1]);
      }

      dispatchPasteEvent(inputEl, pasted);
      fixture.detectChanges();

      expect(inputEl.value).toBe(expected);
      expect(fixture.componentInstance.emittedValue).toBe(expected);

      fixture.destroy();
    }
  });

  it('replaces the selected number input range with sanitized pasted content', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.componentInstance.value = '12345';
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    setSelectionRangeForTest(inputEl, 1, 4);

    dispatchPasteEvent(inputEl, '9x.8');
    fixture.detectChanges();

    expect(inputEl.value).toBe('19.85');
    expect(fixture.componentInstance.emittedValue).toBe('19.85');
    expect(fixture.componentInstance.inputEventCount).toBe(1);
  });

  it('replaces a selected default number value with pasted numbers across scenarios', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();

    const cases: readonly { current: string; expected: string; pasted: string }[] = [
      { current: '42', pasted: '100', expected: '100' },
      { current: '12.5', pasted: '-98.75', expected: '-98.75' },
      { current: '-10', pasted: '.25', expected: '0.25' },
      { current: '5', pasted: '$1,234.50abc', expected: '1234.50' },
      { current: '99.9', pasted: '12.3.4x', expected: '12.34' },
    ];

    for (const { current, pasted, expected } of cases) {
      const fixture = TestBed.createComponent(NumberInputHostComponent);
      fixture.componentInstance.value = current;
      fixture.detectChanges();

      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
      expect(inputEl.value).toBe(current);

      setSelectionRangeForTest(inputEl, 0, inputEl.value.length);
      const pasteEvent = dispatchPasteEvent(inputEl, pasted);
      fixture.detectChanges();

      expect(pasteEvent.defaultPrevented).toBe(true);
      expect(inputEl.value).toBe(expected);
      expect(fixture.componentInstance.emittedValue).toBe(expected);
      expect(fixture.componentInstance.inputEventCount).toBe(1);
      expect(fixture.componentInstance.inputEventValue).toBe(expected);

      fixture.destroy();
    }
  });

  it('replaces a tab-focused number value on paste when native number selection APIs are unavailable', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.componentInstance.value = '100';
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    makeSelectionApiUnavailableForTest(inputEl);

    dispatchKeyboardFocus(inputEl);
    const pasteEvent = dispatchPasteEvent(inputEl, '50');
    fixture.detectChanges();

    expect(pasteEvent.defaultPrevented).toBe(true);
    expect(inputEl.value).toBe('50');
    expect(fixture.componentInstance.emittedValue).toBe('50');
    expect(fixture.componentInstance.inputEventCount).toBe(1);
    expect(fixture.componentInstance.inputEventValue).toBe('50');
  });

  it('replaces a tab-focused number value on paste when native number selection APIs report a collapsed end range', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.componentInstance.value = '100';
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    makeSelectionApiCollapsedForTest(inputEl, inputEl.value.length);

    dispatchKeyboardFocus(inputEl);
    const pasteEvent = dispatchPasteEvent(inputEl, '50');
    fixture.detectChanges();

    expect(pasteEvent.defaultPrevented).toBe(true);
    expect(inputEl.value).toBe('50');
    expect(fixture.componentInstance.emittedValue).toBe('50');
    expect(fixture.componentInstance.inputEventCount).toBe(1);
    expect(fixture.componentInstance.inputEventValue).toBe('50');
  });

  it('keeps pointer-focused number paste at the caret instead of assuming select-all', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.componentInstance.value = '100';
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    makeSelectionApiCollapsedForTest(inputEl, inputEl.value.length);

    dispatchPointerFocus(inputEl);
    const pasteEvent = dispatchPasteEvent(inputEl, '50');
    fixture.detectChanges();

    expect(pasteEvent.defaultPrevented).toBe(true);
    expect(inputEl.value).toBe('10050');
    expect(fixture.componentInstance.emittedValue).toBe('10050');
    expect(fixture.componentInstance.inputEventCount).toBe(1);
    expect(fixture.componentInstance.inputEventValue).toBe('10050');
  });

  it('replaces double-click selected number ranges with pasted numbers', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();

    const cases: readonly {
      current: string;
      expected: string;
      selection: readonly [number, number];
    }[] = [
        { current: '100', selection: [0, 3], expected: '50' },
        { current: '100.987', selection: [0, 3], expected: '50.987' },
        { current: '100.987', selection: [4, 7], expected: '100.50' },
      ];

    for (const { current, expected, selection } of cases) {
      const fixture = TestBed.createComponent(NumberInputHostComponent);
      fixture.componentInstance.value = current;
      fixture.detectChanges();

      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

      dispatchPointerDoubleClickSelection(inputEl, selection[0], selection[1]);
      const pasteEvent = dispatchPasteEvent(inputEl, '50');
      fixture.detectChanges();

      expect(pasteEvent.defaultPrevented).toBe(true);
      expect(inputEl.value).toBe(expected);
      expect(fixture.componentInstance.emittedValue).toBe(expected);
      expect(fixture.componentInstance.inputEventCount).toBe(1);
      expect(fixture.componentInstance.inputEventValue).toBe(expected);

      fixture.destroy();
    }
  });

  it('replaces Ctrl+A selected number values when native number selection APIs are unavailable', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();

    const cases: readonly {
      current: string;
      emittedValue: string | null;
      expected: string;
      pasted: string;
      shortcut: KeyboardEventInit;
    }[] = [
        {
          current: '34',
          pasted: '34',
          expected: '34',
          emittedValue: null,
          shortcut: { ctrlKey: true },
        },
        {
          current: '34',
          pasted: '56',
          expected: '56',
          emittedValue: '56',
          shortcut: { ctrlKey: true },
        },
        {
          current: '-12.5',
          pasted: '$98.00x',
          expected: '98.00',
          emittedValue: '98.00',
          shortcut: { metaKey: true },
        },
      ];

    for (const { current, pasted, expected, emittedValue, shortcut } of cases) {
      const fixture = TestBed.createComponent(NumberInputHostComponent);
      fixture.componentInstance.value = current;
      fixture.detectChanges();

      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
      makeSelectionApiUnavailableForTest(inputEl);

      dispatchKeyboardEvent(inputEl, 'a', shortcut);
      const pasteEvent = dispatchPasteEvent(inputEl, pasted);
      fixture.detectChanges();

      expect(pasteEvent.defaultPrevented).toBe(true);
      expect(inputEl.value).toBe(expected);
      expect(fixture.componentInstance.emittedValue).toBe(emittedValue);
      expect(fixture.componentInstance.inputEventCount).toBe(1);
      expect(fixture.componentInstance.inputEventValue).toBe(expected);

      fixture.destroy();
    }
  });

  it('preserves Ctrl+A selection through copy before replacing the number on paste', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.componentInstance.value = '34';
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    makeSelectionApiUnavailableForTest(inputEl);

    dispatchKeyboardEvent(inputEl, 'a', { ctrlKey: true });
    dispatchKeyboardEvent(inputEl, 'c', { ctrlKey: true });
    dispatchKeyboardEvent(inputEl, 'v', { ctrlKey: true });
    const pasteEvent = dispatchPasteEvent(inputEl, '34');
    fixture.detectChanges();

    expect(pasteEvent.defaultPrevented).toBe(true);
    expect(inputEl.value).toBe('34');
    expect(fixture.componentInstance.emittedValue).toBeNull();
    expect(fixture.componentInstance.inputEventCount).toBe(1);
    expect(fixture.componentInstance.inputEventValue).toBe('34');
  });

  it('does not sanitize paste events for readonly or disabled number inputs', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    fixture.componentInstance.readonly = true;
    fixture.changeDetectorRef.detectChanges();

    const readonlyPaste = dispatchPasteEvent(inputEl, '$99');
    fixture.detectChanges();

    expect(readonlyPaste.defaultPrevented).toBe(false);
    expect(inputEl.value).toBe('1');
    expect(fixture.componentInstance.emittedValue).toBeNull();
    expect(fixture.componentInstance.inputEventCount).toBe(0);

    fixture.componentInstance.readonly = false;
    fixture.componentInstance.disabled = true;
    fixture.changeDetectorRef.detectChanges();

    const disabledPaste = dispatchPasteEvent(inputEl, '$99');
    fixture.detectChanges();

    expect(disabledPaste.defaultPrevented).toBe(false);
    expect(inputEl.value).toBe('1');
    expect(fixture.componentInstance.emittedValue).toBeNull();
    expect(fixture.componentInstance.inputEventCount).toBe(0);
  });

  it('increments and decrements number values with the configured step', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const [incrementButton, decrementButton] = fixture.debugElement.queryAll(
      By.css('.tng-input-number-button'),
    );

    incrementButton.nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.emittedValue).toBe('1.5');
    expect(inputEl.value).toBe('1.5');

    decrementButton.nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.emittedValue).toBe('1');
    expect(inputEl.value).toBe('1');
  });

  it('emits the aliased input event when custom number controls change the value', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.detectChanges();

    const [incrementButton] = fixture.debugElement.queryAll(By.css('.tng-input-number-button'));

    incrementButton.nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.emittedValue).toBe('1.5');
    expect(fixture.componentInstance.inputEventCount).toBe(1);
    expect(fixture.componentInstance.inputEventValue).toBe('1.5');
  });

  it('steps number values from ArrowUp and ArrowDown key presses', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    const arrowUpEvent = dispatchKeyboardEvent(inputEl, 'ArrowUp');
    fixture.detectChanges();

    expect(arrowUpEvent.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.emittedValue).toBe('1.5');
    expect(fixture.componentInstance.inputEventValue).toBe('1.5');
    expect(inputEl.value).toBe('1.5');

    const arrowDownEvent = dispatchKeyboardEvent(inputEl, 'ArrowDown');
    fixture.detectChanges();

    expect(arrowDownEvent.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.emittedValue).toBe('1');
    expect(fixture.componentInstance.inputEventValue).toBe('1');
    expect(inputEl.value).toBe('1');
  });

  it('jumps number values from PageUp and PageDown key presses', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    const pageUpEvent = dispatchKeyboardEvent(inputEl, 'PageUp');
    fixture.detectChanges();

    expect(pageUpEvent.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.emittedValue).toBe('2');
    expect(inputEl.value).toBe('2');

    const pageDownEvent = dispatchKeyboardEvent(inputEl, 'PageDown');
    fixture.detectChanges();

    expect(pageDownEvent.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.emittedValue).toBe('0');
    expect(inputEl.value).toBe('0');
  });

  it('moves number values to min and max from Home and End key presses', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    const homeEvent = dispatchKeyboardEvent(inputEl, 'Home');
    fixture.detectChanges();

    expect(homeEvent.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.emittedValue).toBe('0');
    expect(inputEl.value).toBe('0');

    const endEvent = dispatchKeyboardEvent(inputEl, 'End');
    fixture.detectChanges();

    expect(endEvent.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.emittedValue).toBe('2');
    expect(inputEl.value).toBe('2');
  });

  it('does not intercept Enter or Space on number inputs', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    const enterEvent = dispatchKeyboardEvent(inputEl, 'Enter');
    const spaceEvent = dispatchKeyboardEvent(inputEl, ' ');
    fixture.detectChanges();

    expect(enterEvent.defaultPrevented).toBe(false);
    expect(spaceEvent.defaultPrevented).toBe(false);
    expect(fixture.componentInstance.emittedValue).toBeNull();
    expect(fixture.componentInstance.inputEventCount).toBe(0);
    expect(inputEl.value).toBe('1');
  });

  it('suppresses number key stepping when readonly or disabled', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    fixture.componentInstance.readonly = true;
    fixture.changeDetectorRef.detectChanges();

    const readonlyEvent = dispatchKeyboardEvent(inputEl, 'ArrowUp');
    fixture.detectChanges();

    expect(readonlyEvent.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.emittedValue).toBeNull();
    expect(fixture.componentInstance.inputEventCount).toBe(0);
    expect(inputEl.value).toBe('1');

    fixture.componentInstance.readonly = false;
    fixture.componentInstance.disabled = true;
    fixture.changeDetectorRef.detectChanges();

    const disabledEvent = dispatchKeyboardEvent(inputEl, 'ArrowUp');
    fixture.detectChanges();

    expect(disabledEvent.defaultPrevented).toBe(false);
    expect(fixture.componentInstance.emittedValue).toBeNull();
    expect(fixture.componentInstance.inputEventCount).toBe(0);
    expect(inputEl.value).toBe('1');
  });

  it('allows the custom number controls to be hidden with a CSS override', async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputHostComponent],
    }).compileComponents();
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      tng-input.hide-number-controls .tng-input-number-controls {
        display: none;
      }
    `;
    document.head.appendChild(styleElement);

    const fixture = TestBed.createComponent(NumberInputHostComponent);
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input')).nativeElement as HTMLElement;
    const controls = fixture.debugElement.query(By.css('.tng-input-number-controls'))
      .nativeElement as HTMLElement;

    host.classList.add('hide-number-controls');

    expect(getComputedStyle(controls).display).toBe('none');

    styleElement.remove();
  });

  it('accepts undefined number constraint bindings', async () => {
    await TestBed.configureTestingModule({
      imports: [OptionalNumberConstraintsHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(OptionalNumberConstraintsHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    expect(inputEl.hasAttribute('min')).toBe(false);
    expect(inputEl.hasAttribute('max')).toBe(false);
    expect(inputEl.hasAttribute('step')).toBe(false);
  });

  it('passes common native validation, mobile keyboard, form, and aria attributes to the internal input', async () => {
    await TestBed.configureTestingModule({
      imports: [NativeInputAttributeHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NativeInputAttributeHostComponent);
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    expect(inputEl.getAttribute('aria-errormessage')).toBe('input-error');
    expect(inputEl.getAttribute('autocapitalize')).toBe('words');
    expect(inputEl.getAttribute('enterkeyhint')).toBe('search');
    expect(inputEl.getAttribute('form')).toBe('customer-form');
    expect(inputEl.getAttribute('inputmode')).toBe('email');
    expect(inputEl.getAttribute('list')).toBe('email-suggestions');
    expect(inputEl.getAttribute('maxlength')).toBe('64');
    expect(inputEl.getAttribute('minlength')).toBe('3');
    expect(inputEl.getAttribute('pattern')).toBe('[^@]+@example\\.com');
    expect(inputEl.getAttribute('spellcheck')).toBe('false');
  });

  it('accepts RegExp arrays for signal forms pattern metadata', async () => {
    await TestBed.configureTestingModule({
      imports: [NativeInputAttributeHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NativeInputAttributeHostComponent);

    fixture.componentInstance.pattern = [/^[A-Z]+$/];
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    expect(inputEl.getAttribute('pattern')).toBe('^[A-Z]+$');
  });

  it('removes optional native input attributes when bindings are null or empty', async () => {
    await TestBed.configureTestingModule({
      imports: [NativeInputAttributeHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NativeInputAttributeHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.ariaErrormessage = ' ';
    fixture.componentInstance.autocapitalize = '';
    fixture.componentInstance.enterkeyhint = null;
    fixture.componentInstance.form = null;
    fixture.componentInstance.inputmode = '';
    fixture.componentInstance.list = null;
    fixture.componentInstance.maxlength = undefined;
    fixture.componentInstance.minlength = null;
    fixture.componentInstance.pattern = ' ';
    fixture.componentInstance.spellcheck = null;
    fixture.changeDetectorRef.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

    expect(inputEl.hasAttribute('aria-errormessage')).toBe(false);
    expect(inputEl.hasAttribute('autocapitalize')).toBe(false);
    expect(inputEl.hasAttribute('enterkeyhint')).toBe(false);
    expect(inputEl.hasAttribute('form')).toBe(false);
    expect(inputEl.hasAttribute('inputmode')).toBe(false);
    expect(inputEl.hasAttribute('list')).toBe(false);
    expect(inputEl.hasAttribute('maxlength')).toBe(false);
    expect(inputEl.hasAttribute('minlength')).toBe(false);
    expect(inputEl.hasAttribute('pattern')).toBe(false);
    expect(inputEl.hasAttribute('spellcheck')).toBe(false);
  });
});
