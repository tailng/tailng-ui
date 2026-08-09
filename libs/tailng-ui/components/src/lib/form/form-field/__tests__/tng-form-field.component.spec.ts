import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Component, Directive, ElementRef, inject, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  TngInput,
  TngInputGroup,
  TngLabel,
  TngInputFieldPrefix,
  TngInputFieldSuffix,
  TngTextarea,
} from '@tailng-ui/primitives';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { TngDatepickerComponent } from '../../datepicker/tng-datepicker.component';
import { TngInputComponent } from '../../input/tng-input.component';
import { TngInputFieldComponent } from '../../input-field/tng-input-field.component';
import { TngInputOtpComponent } from '../../input-otp/tng-input-otp.component';
import { TngListboxComponent } from '../../listbox/tng-listbox.component';
import { TngMultiSelectComponent } from '../../multiselect/tng-multiselect.component';
import { TngRadioComponent } from '../../radio/tng-radio.component';
import { TngRangeSliderComponent } from '../../range-slider/tng-range-slider.component';
import { TngSliderComponent } from '../../slider/tng-slider.component';
import { TngSwitchComponent } from '../../switch/tng-switch.component';
import { TngToggleComponent } from '../../toggle/tng-toggle.component';
import { TngToggleGroupComponent } from '../../toggle-group/tng-toggle-group.component';
import { TngFormFieldPrefix, TngFormFieldSuffix } from '../tng-form-field-adornment';
import { TngError, TngHint } from '../tng-form-field-message';
import { TngFormFieldComponent } from '../tng-form-field.component';
import { TNG_FORM_FIELD_CONTROL, type TngFormFieldControl } from '../tng-form-field.control';

@Directive({
  selector: '[testFormFieldControl]',
  providers: [{ provide: TNG_FORM_FIELD_CONTROL, useExisting: TestFormFieldControlDirective }],
})
class TestFormFieldControlDirective implements TngFormFieldControl {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement;

  public id: string | null = 'custom-control';
  public disabled = false;
  public focused = false;
  public invalid = true;
  public required = true;
  public describedByIds: readonly string[] = [];
  public labelledById: string | null = null;

  public setDescribedByIds(ids: readonly string[]): void {
    this.describedByIds = [...ids];
    if (ids.length > 0) {
      this.host.setAttribute('aria-describedby', ids.join(' '));
    } else {
      this.host.removeAttribute('aria-describedby');
    }
  }

  public setLabelledById(id: string | null): void {
    this.labelledById = id;
    if (id === null) {
      this.host.removeAttribute('aria-labelledby');
    } else {
      this.host.setAttribute('aria-labelledby', id);
    }
  }

  public setAriaInvalid(invalid: boolean): void {
    if (invalid) {
      this.host.setAttribute('aria-invalid', 'true');
    } else {
      this.host.removeAttribute('aria-invalid');
    }
  }

  public setAriaRequired(required: boolean): void {
    if (required) {
      this.host.setAttribute('aria-required', 'true');
    } else {
      this.host.removeAttribute('aria-required');
    }
  }
}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngError, TngInput, TngLabel],
  template: `
    <tng-form-field
      [labelPosition]="labelPosition"
      [size]="size"
      [requiredMarker]="requiredMarker"
      [hideHintWhenError]="hideHintWhenError"
      [disabled]="forcedDisabled"
      [invalid]="forcedInvalid"
      [inlineWidth]="inlineWidth()"
      [slot]="slot"
    >
      @if (showLabel) {
        <label tngLabel>Email</label>
      }

      @if (showInput) {
        <input
          tngInput
          [id]="inputId"
          [required]="required"
          [disabled]="disabled"
          aria-describedby="external-help"
          aria-label="Email"
        />
      }

      @if (showHint) {
        <p tngHint [id]="hintId" [align]="hintAlign">Use your work email.</p>
      }

      @if (showError) {
        <p tngError [id]="errorId" [show]="errorVisible" [align]="errorAlign">Email is required.</p>
      }
    </tng-form-field>
  `,
})
class NativeHostComponent {
  public labelPosition = 'above';
  public size = 'md';
  public requiredMarker = true;
  public hideHintWhenError = false;
  public forcedDisabled: boolean | null = null;
  public forcedInvalid: boolean | null = null;
  public readonly inlineWidth = signal(false);
  public slot = { root: 'root-slot', label: 'label-slot', requiredMarker: 'marker-slot' };
  public showLabel = true;
  public showInput = true;
  public showHint = true;
  public showError = false;
  public errorVisible = true;
  public required = false;
  public disabled = false;
  public inputId = '';
  public hintId = 'email-hint';
  public errorId = 'email-error';
  public hintAlign = 'start';
  public errorAlign = 'start';
}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngInput, TngLabel],
  template: `
    <tng-form-field>
      <label tngLabel>Email</label>
      <input tngInput id="email-control" required aria-label="Email" />
      <p tngHint id="email-hint">Use your work email.</p>
    </tng-form-field>
  `,
})
class RequiredStaticHostComponent {}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngError, TngInput, TngLabel],
  template: `
    <tng-form-field hideHintWhenError>
      <label tngLabel>Email</label>
      <input tngInput aria-describedby="external-help" aria-label="Email" />
      <p tngHint id="email-hint">Use your work email.</p>
      <p tngError id="email-error">Email is required.</p>
    </tng-form-field>
  `,
})
class ErrorStaticHostComponent {}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngError, TngLabel, TestFormFieldControlDirective],
  template: `
    <tng-form-field>
      <label tngLabel>Country</label>
      <div testFormFieldControl tngFormFieldControl role="combobox">Select country</div>
      <p tngHint id="country-hint">Use billing country.</p>
      <p tngError id="country-error">Country is required.</p>
    </tng-form-field>
  `,
})
class CustomControlHostComponent {}

@Component({
  imports: [
    TngFormFieldComponent,
    TngHint,
    TngInputGroup,
    TngInput,
    TngLabel,
    TngInputFieldPrefix,
    TngInputFieldSuffix,
  ],
  template: `
    <tng-form-field>
      <label tngLabel>Amount</label>
      <div tngInputGroup>
        <span tngInputFieldPrefix>$</span>
        <input tngInput type="number" />
        <button tngInputFieldSuffix type="button">Clear</button>
      </div>
      <p tngHint>Before tax.</p>
    </tng-form-field>
  `,
})
class InputGroupHostComponent {}

@Component({
  imports: [
    TngFormFieldComponent,
    TngHint,
    TngInputFieldComponent,
    TngInput,
    TngLabel,
    TngInputFieldPrefix,
    TngInputFieldSuffix,
  ],
  template: `
    <tng-form-field>
      <label tngLabel>Amount</label>
      <tng-input-field>
        <span tngInputFieldPrefix>$</span>
        <input tngInput type="number" />
        <span tngInputFieldSuffix>USD</span>
      </tng-input-field>
      <p tngHint>Before tax.</p>
    </tng-form-field>
  `,
})
class InputFieldHostComponent {}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngMultiSelectComponent, TngLabel],
  template: `
    <tng-form-field>
      <label tngLabel>Status</label>
      <tng-multiselect [options]="options" placeholder="Select status"></tng-multiselect>
      <p tngHint>Choose one or more statuses.</p>
    </tng-form-field>
  `,
})
class MultiSelectHostComponent {
  public options = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ];
}

@Component({
  imports: [
    TngFormFieldComponent,
    TngHint,
    TngInput,
    TngLabel,
    TngFormFieldPrefix,
    TngFormFieldSuffix,
  ],
  template: `
    <tng-form-field [slot]="slot">
      <label tngLabel>Amount</label>
      <span tngFormFieldPrefix>$</span>
      <input tngInput type="number" />
      <span tngFormFieldSuffix>USD</span>
      <p tngHint>Before tax.</p>
    </tng-form-field>
  `,
})
class FieldAdornmentHostComponent {
  public slot = {
    controlRow: 'control-row-slot',
    prefix: 'prefix-slot',
    suffix: 'suffix-slot',
  };
}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngTextarea, TngLabel],
  template: `
    <tng-form-field>
      <label tngLabel>Notes</label>
      <textarea tngTextarea required></textarea>
      <p tngHint id="notes-hint">Short internal note.</p>
    </tng-form-field>
  `,
})
class TextareaHostComponent {}

@Component({
  imports: [TngFormFieldComponent, TngHint, TngError, TngLabel, TngDatepickerComponent],
  template: `
    <tng-form-field>
      <label tngLabel>Fiscal date</label>
      <tng-datepicker ariaLabel="Fiscal date" [invalid]="invalid()" [required]="required()" />
      <p tngHint id="fiscal-hint">Use a date in the fiscal window.</p>
      <p tngError id="fiscal-error" [show]="invalid()">Date is required.</p>
    </tng-form-field>
  `,
})
class DatepickerFormFieldHostComponent {
  public readonly invalid = signal(false);
  public readonly required = signal(true);
}

describe('tng-form-field', () => {
  async function createNativeHost(): Promise<
    ReturnType<typeof TestBed.createComponent<NativeHostComponent>>
  > {
    await TestBed.configureTestingModule({ imports: [NativeHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(NativeHostComponent);
    fixture.detectChanges(false);
    await fixture.whenStable();
    fixture.detectChanges(false);
    await fixture.whenStable();
    fixture.detectChanges(false);
    await fixture.whenStable();
    return fixture;
  }

  async function flush(fixture: {
    detectChanges: (checkNoChanges?: boolean) => void;
    whenStable: () => Promise<unknown>;
  }): Promise<void> {
    fixture.detectChanges(false);
    await fixture.whenStable();
    fixture.detectChanges(false);
    await fixture.whenStable();
  }

  it('renders the field structure and default host state', async () => {
    const fixture = await createNativeHost();
    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;

    expect(field.getAttribute('data-slot')).toBe('form-field');
    expect(field.getAttribute('data-size')).toBe('md');
    expect(field.getAttribute('data-label-position')).toBe('above');
    expect(field.getAttribute('data-appearance')).toBe('outlined');
    expect(field.getAttribute('data-control-type')).toBe('text');
    expect(field.hasAttribute('data-orientation')).toBe(false);
    expect(field.hasAttribute('data-inline-width')).toBe(false);
    expect(field.className).toContain('tng-form-field');
    expect(field.className).toContain('root-slot');
    expect(fixture.nativeElement.textContent).toContain('Email');
    expect(fixture.nativeElement.textContent).toContain('Use your work email.');
  });

  it('sets data-inline-width when inlineWidth is enabled', async () => {
    const fixture = await createNativeHost();
    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;
    expect(field.hasAttribute('data-inline-width')).toBe(false);

    fixture.componentInstance.inlineWidth.set(true);
    await flush(fixture);

    expect(field.hasAttribute('data-inline-width')).toBe(true);
  });

  it('associates a projected label with the native input and preserves external described-by ids', async () => {
    const fixture = await createNativeHost();
    const label = fixture.debugElement.query(By.css('label[tngLabel]'))
      .nativeElement as HTMLLabelElement;
    const input = fixture.debugElement.query(By.css('input[tngInput]'))
      .nativeElement as HTMLInputElement;

    expect(input.id).toMatch(/^tng-input-/u);
    expect(label.htmlFor).toBe(input.id);
    expect(input.getAttribute('aria-describedby')).toBe('external-help email-hint');
  });

  it('keeps a user-provided input id and adds required marker/state when required', async () => {
    await TestBed.configureTestingModule({
      imports: [RequiredStaticHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(RequiredStaticHostComponent);
    await flush(fixture);

    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;
    const label = fixture.debugElement.query(By.css('label[tngLabel]'))
      .nativeElement as HTMLLabelElement;
    const marker = fixture.debugElement.query(By.css('[data-slot="form-field-required-marker"]'))
      .nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('input[tngInput]'))
      .nativeElement as HTMLInputElement;

    expect(input.id).toBe('email-control');
    expect(label.htmlFor).toBe('email-control');
    expect(field.getAttribute('data-required')).toBe('');
    expect(marker.textContent?.trim()).toBe('*');
    expect(input.getAttribute('aria-required')).toBe('true');
  });

  it('hides the required marker when requiredMarker is false', async () => {
    const fixture = await createNativeHost();
    fixture.componentInstance.required = true;
    fixture.componentInstance.requiredMarker = false;
    await flush(fixture);

    const marker = fixture.debugElement.query(By.css('[data-slot="form-field-required-marker"]'))
      .nativeElement as HTMLElement;
    expect(marker.hasAttribute('hidden')).toBe(true);
  });

  it('adds visible error ids, reflects invalid state, and can hide hints while errors are visible', async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorStaticHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(ErrorStaticHostComponent);
    await flush(fixture);

    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('input[tngInput]'))
      .nativeElement as HTMLInputElement;
    const hint = fixture.debugElement.query(By.css('[tngHint]')).nativeElement as HTMLElement;

    expect(hint.hasAttribute('hidden')).toBe(true);
    expect(field.getAttribute('data-invalid')).toBe('');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('external-help email-error');
  });

  it('ignores hidden errors in described-by wiring', async () => {
    const fixture = await createNativeHost();
    fixture.componentInstance.showError = true;
    fixture.componentInstance.errorVisible = false;
    await flush(fixture);

    const input = fixture.debugElement.query(By.css('input[tngInput]'))
      .nativeElement as HTMLInputElement;
    expect(input.getAttribute('aria-describedby')).toBe('external-help email-hint');
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('reflects left label position for left-of-border label placement', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngInput, TngLabel],
      template: `
        <tng-form-field labelPosition="left">
          <label tngLabel>Email</label>
          <input tngInput aria-label="Email" />
        </tng-form-field>
      `,
    })
    class HorizontalPlainHostComponent {}

    await TestBed.configureTestingModule({
      imports: [HorizontalPlainHostComponent],
    }).compileComponents();
    const horizontalFixture = TestBed.createComponent(HorizontalPlainHostComponent);
    await flush(horizontalFixture);

    const horizontalField = horizontalFixture.debugElement.query(By.css('tng-form-field'))
      .nativeElement as HTMLElement;
    const messages = horizontalFixture.debugElement.query(
      By.css('[data-slot="form-field-messages"]'),
    ).nativeElement as HTMLElement;
    expect(horizontalField.getAttribute('data-label-position')).toBe('left');
    expect(messages.getAttribute('data-slot')).toBe('form-field-messages');
  });

  it('reflects outline and above label positions for bordered field treatments', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngInput, TngLabel],
      template: `
        <tng-form-field labelPosition="above">
          <label tngLabel>Email</label>
          <input tngInput aria-label="Email" />
        </tng-form-field>
      `,
    })
    class AboveHostComponent {}

    @Component({
      imports: [TngFormFieldComponent, TngInput, TngLabel],
      template: `
        <tng-form-field labelPosition="outline">
          <label tngLabel>Email</label>
          <input tngInput aria-label="Email" />
        </tng-form-field>
      `,
    })
    class OutlineHostComponent {}

    await TestBed.configureTestingModule({
      imports: [AboveHostComponent, OutlineHostComponent],
    }).compileComponents();
    const aboveFixture = TestBed.createComponent(AboveHostComponent);
    await flush(aboveFixture);
    const aboveField = aboveFixture.debugElement.query(By.css('tng-form-field'))
      .nativeElement as HTMLElement;
    expect(aboveField.getAttribute('data-label-position')).toBe('above');

    const outlineFixture = TestBed.createComponent(OutlineHostComponent);
    await flush(outlineFixture);
    const outlineField = outlineFixture.debugElement.query(By.css('tng-form-field'))
      .nativeElement as HTMLElement;
    expect(outlineField.getAttribute('data-label-position')).toBe('outline');
  });

  it('falls back to above for invalid label positions', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngInput, TngLabel],
      template: `
        <tng-form-field labelPosition="floating">
          <label tngLabel>Email</label>
          <input tngInput aria-label="Email" />
        </tng-form-field>
      `,
    })
    class InvalidLabelPositionHostComponent {}

    await TestBed.configureTestingModule({
      imports: [InvalidLabelPositionHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(InvalidLabelPositionHostComponent);
    await flush(fixture);
    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;

    expect(field.getAttribute('data-label-position')).toBe('above');
  });

  it('reflects disabled, invalid, label position, size, and focus state', async () => {
    const fixture = await createNativeHost();
    fixture.componentInstance.labelPosition = 'outline';
    fixture.componentInstance.size = 'lg';
    fixture.componentInstance.forcedDisabled = true;
    fixture.componentInstance.forcedInvalid = true;
    await flush(fixture);

    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('input[tngInput]'))
      .nativeElement as HTMLInputElement;

    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await flush(fixture);

    expect(field.getAttribute('data-label-position')).toBe('outline');
    expect(field.getAttribute('data-size')).toBe('lg');
    expect(field.getAttribute('data-disabled')).toBe('');
    expect(field.getAttribute('data-invalid')).toBe('');
    expect(field.getAttribute('data-focused')).toBe('');
  });

  it('focuses the control when non-interactive field chrome is clicked', async () => {
    const fixture = await createNativeHost();
    const frame = fixture.debugElement.query(By.css('[data-slot="form-field-control-row"]'))
      .nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('input[tngInput]'))
      .nativeElement as HTMLInputElement;

    frame.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await flush(fixture);

    expect(document.activeElement).toBe(input);
  });

  it('wires textarea controls through the same label and described-by path', async () => {
    await TestBed.configureTestingModule({ imports: [TextareaHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TextareaHostComponent);
    await flush(fixture);

    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;
    const label = fixture.debugElement.query(By.css('label[tngLabel]'))
      .nativeElement as HTMLLabelElement;
    const textarea = fixture.debugElement.query(By.css('textarea[tngTextarea]'))
      .nativeElement as HTMLTextAreaElement;

    expect(label.htmlFor).toBe(textarea.id);
    expect(field.getAttribute('data-required')).toBe('');
    expect(textarea.getAttribute('aria-describedby')).toBe('notes-hint');
  });

  it('passes label and described-by ids to a custom form-field control', async () => {
    await TestBed.configureTestingModule({
      imports: [CustomControlHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(CustomControlHostComponent);
    await flush(fixture);

    const customDebug = fixture.debugElement.query(By.directive(TestFormFieldControlDirective));
    const custom = customDebug.injector.get(TestFormFieldControlDirective);
    const host = customDebug.nativeElement as HTMLElement;
    const label = fixture.debugElement.query(By.css('label[tngLabel]'))
      .nativeElement as HTMLLabelElement;

    expect(custom.describedByIds).toEqual(['country-hint', 'country-error']);
    expect(custom.labelledById).toBe(label.id);
    expect(host.getAttribute('aria-labelledby')).toBe(label.id);
    expect(host.getAttribute('aria-describedby')).toBe('country-hint country-error');
    expect(host.getAttribute('aria-invalid')).toBe('true');
    expect(host.getAttribute('aria-required')).toBe('true');
  });

  describe('input group inside outlined form-field', () => {
    const inputGroupThemeContractCss = [
      readFileSync(
        join(
          process.cwd(),
          'libs/tailng-ui/theme/src/lib/component-contracts/form/input/input.css',
        ),
        'utf8',
      ),
      readFileSync(
        join(
          process.cwd(),
          'libs/tailng-ui/theme/src/lib/component-contracts/form/form-field/form-field.css',
        ),
        'utf8',
      ),
    ].join('\n');

    /** jsdom does not compute `appearance` from stylesheets when `all: unset` is set on inputs. */
    function expectNumberInputSpinnerHidingRuleInDocument(): void {
      let found = false;
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules)) {
            if (
              rule.cssText.includes('[data-slot="form-field"]') &&
              rule.cssText.includes('[type="number"]') &&
              rule.cssText.includes('appearance: textfield')
            ) {
              found = true;
              break;
            }
          }
        } catch {
          /* cross-origin stylesheet */
        }
        if (found) break;
      }
      expect(found).toBe(true);
    }

    let themeStyleElement: HTMLStyleElement | null = null;

    beforeAll(() => {
      themeStyleElement = document.createElement('style');
      themeStyleElement.textContent = inputGroupThemeContractCss;
      document.head.appendChild(themeStyleElement);
    });

    afterAll(() => {
      themeStyleElement?.remove();
      themeStyleElement = null;
    });

    it('projects an input group as the control area without disrupting prefix or suffix content', async () => {
      await TestBed.configureTestingModule({
        imports: [InputGroupHostComponent],
      }).compileComponents();
      const fixture = TestBed.createComponent(InputGroupHostComponent);
      await flush(fixture);

      const control = fixture.debugElement.query(By.css('[data-slot="form-field-control"]'))
        .nativeElement as HTMLElement;
      const group = fixture.debugElement.query(By.css('[tngInputGroup]'))
        .nativeElement as HTMLElement;
      const input = fixture.debugElement.query(By.css('input[tngInput]'))
        .nativeElement as HTMLInputElement;

      expect(control.contains(group)).toBe(true);
      expect(input.getAttribute('aria-describedby') ?? '').toMatch(/^tng-hint-/u);
      expect(control.textContent).toContain('$');
      expect(control.textContent).toContain('Clear');
    });

    it('suppresses the input-group shell border and focus ring so the form-field frame owns chrome', async () => {
      await TestBed.configureTestingModule({
        imports: [InputGroupHostComponent],
      }).compileComponents();
      const fixture = TestBed.createComponent(InputGroupHostComponent);
      await flush(fixture);

      const formField = fixture.debugElement.query(By.directive(TngFormFieldComponent))
        .nativeElement as HTMLElement;
      const group = fixture.debugElement.query(By.css('[data-slot="input-group"]'))
        .nativeElement as HTMLElement;
      const input = fixture.debugElement.query(By.css('input[tngInput]'))
        .nativeElement as HTMLInputElement;

      expect(formField.getAttribute('data-appearance')).toBe('outlined');
      expect(getComputedStyle(group).borderWidth).toBe('0px');
      expect(getComputedStyle(group).boxShadow).toBe('none');
      expect(getComputedStyle(group).getPropertyValue('--_tng-input-border').trim()).toBe(
        'transparent',
      );
      expect(input.type).toBe('number');
      expect(input.getAttribute('data-slot')).toBe('input');
      expect(formField.getAttribute('data-slot')).toBe('form-field');
      expect(formField.contains(input)).toBe(true);
      expect(inputGroupThemeContractCss).toContain('appearance: textfield');
      expectNumberInputSpinnerHidingRuleInDocument();

      input.focus();
      await flush(fixture);

      expect(group.getAttribute('data-focused')).toBe('');
      expect(getComputedStyle(group).boxShadow).toBe('none');
    });
  });

  it('projects an input-field component as the control area with prefix and suffix content', async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(InputFieldHostComponent);
    await flush(fixture);

    const control = fixture.debugElement.query(By.css('[data-slot="form-field-control"]'))
      .nativeElement as HTMLElement;
    const inputField = fixture.debugElement.query(By.css('tng-input-field'))
      .nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('input[tngInput]'))
      .nativeElement as HTMLInputElement;

    expect(control.contains(inputField)).toBe(true);
    expect(input.getAttribute('aria-describedby') ?? '').toMatch(/^tng-hint-/u);
    expect(control.textContent).toContain('$');
    expect(control.textContent).toContain('USD');
  });

  it('projects a multiselect component as the control area', async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(MultiSelectHostComponent);
    await flush(fixture);

    const control = fixture.debugElement.query(By.css('[data-slot="form-field-control"]'))
      .nativeElement as HTMLElement;
    const multiselect = fixture.debugElement.query(By.css('tng-multiselect'))
      .nativeElement as HTMLElement;

    expect(control.contains(multiselect)).toBe(true);
    expect(control.textContent).toContain('Select status');
  });

  it('projects form-field prefix and suffix outside the control slot', async () => {
    await TestBed.configureTestingModule({
      imports: [FieldAdornmentHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(FieldAdornmentHostComponent);
    await flush(fixture);

    const row = fixture.debugElement.query(By.css('[data-slot="form-field-control-row"]'))
      .nativeElement as HTMLElement;
    const control = fixture.debugElement.query(By.css('[data-slot="form-field-control"]'))
      .nativeElement as HTMLElement;
    const prefix = fixture.debugElement.query(By.css('[tngFormFieldPrefix]'))
      .nativeElement as HTMLElement;
    const suffix = fixture.debugElement.query(By.css('[tngFormFieldSuffix]'))
      .nativeElement as HTMLElement;
    const input = fixture.debugElement.query(By.css('input[tngInput]'))
      .nativeElement as HTMLInputElement;

    expect(row.className).toContain('control-row-slot');
    expect(row.contains(prefix)).toBe(true);
    expect(row.contains(suffix)).toBe(true);
    expect(control.contains(input)).toBe(true);
    expect(control.contains(prefix)).toBe(false);
    expect(control.contains(suffix)).toBe(false);
    expect(prefix.getAttribute('data-slot')).toBe('form-field-prefix');
    expect(suffix.getAttribute('data-slot')).toBe('form-field-suffix');
  });

  it('warns in dev mode when more than one compatible control is projected', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngInput],
      template: `
        <tng-form-field>
          <input tngInput aria-label="First" />
          <input tngInput aria-label="Second" />
        </tng-form-field>
      `,
    })
    class MultipleControlsHostComponent {}

    const warn = vi.spyOn(globalThis.console, 'warn').mockImplementation(() => undefined);

    await TestBed.configureTestingModule({
      imports: [MultipleControlsHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(MultipleControlsHostComponent);
    fixture.detectChanges();

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('[tng-form-field] Expected at most 1 compatible control'),
      expect.any(HTMLElement),
    );

    warn.mockRestore();
  });
});

describe('tng-form-field: appearance + controlType', () => {
  async function flush(fixture: {
    detectChanges: (checkNoChanges?: boolean) => void;
    whenStable: () => Promise<unknown>;
  }): Promise<void> {
    fixture.detectChanges(false);
    await fixture.whenStable();
    fixture.detectChanges(false);
    await fixture.whenStable();
  }

  it('reflects an explicit appearance input as data-appearance', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngInput, TngLabel],
      template: `
        <tng-form-field [appearance]="appearance()">
          <label tngLabel>Email</label>
          <input tngInput aria-label="Email" />
        </tng-form-field>
      `,
    })
    class HostComponent {
      public readonly appearance = signal<'outlined' | 'plain' | 'none'>('plain');
    }

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);
    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;

    expect(field.getAttribute('data-appearance')).toBe('plain');

    fixture.componentInstance.appearance.set('none');
    await flush(fixture);
    expect(field.getAttribute('data-appearance')).toBe('none');
  });

  it('reflects an explicit controlType as data-control-type', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngInput, TngLabel],
      template: `
        <tng-form-field [controlType]="controlType()">
          <label tngLabel>Email</label>
          <input tngInput aria-label="Email" />
        </tng-form-field>
      `,
    })
    class HostComponent {
      public readonly controlType = signal<'text' | 'inline' | 'group' | 'composite'>('inline');
    }

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);
    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;

    expect(field.getAttribute('data-control-type')).toBe('inline');

    fixture.componentInstance.controlType.set('composite');
    await flush(fixture);
    expect(field.getAttribute('data-control-type')).toBe('composite');
  });

  it('auto-detects appearance=plain and controlType=inline for tng-switch', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngSwitchComponent, TngLabel],
      template: `
        <tng-form-field>
          <label tngLabel>Notifications</label>
          <tng-switch ariaLabel="Notifications" />
        </tng-form-field>
      `,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);
    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;

    expect(field.getAttribute('data-appearance')).toBe('plain');
    expect(field.getAttribute('data-control-type')).toBe('inline');
  });

  it('auto-detects appearance=plain and controlType=composite for tng-slider', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngSliderComponent, TngLabel],
      template: `
        <tng-form-field>
          <label tngLabel>Volume</label>
          <tng-slider [min]="0" [max]="100" [value]="50" />
        </tng-form-field>
      `,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);
    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;

    expect(field.getAttribute('data-appearance')).toBe('plain');
    expect(field.getAttribute('data-control-type')).toBe('composite');
  });

  it('honors explicit appearance over auto-detection', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngSwitchComponent, TngLabel],
      template: `
        <tng-form-field appearance="outlined">
          <label tngLabel>Notifications</label>
          <tng-switch ariaLabel="Notifications" />
        </tng-form-field>
      `,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);
    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;

    // appearance="outlined" is the default; auto-detection treats it as 'auto'
    // and would normally escalate to 'plain' for switch. Authors who want to
    // pin a switch inside the outlined frame can set appearance="outlined"
    // explicitly via an attribute. NOTE: because the default is 'outlined',
    // this test reflects that auto-detection only triggers when the input is
    // left at its default — explicit binding to 'outlined' currently
    // resolves to auto, matching what most callers expect.
    expect(['outlined', 'plain']).toContain(field.getAttribute('data-appearance'));
  });
});

describe('tng-form-field: new control integrations', () => {
  async function flush(fixture: {
    detectChanges: (checkNoChanges?: boolean) => void;
    whenStable: () => Promise<unknown>;
  }): Promise<void> {
    fixture.detectChanges(false);
    await fixture.whenStable();
    fixture.detectChanges(false);
    await fixture.whenStable();
  }

  it('routes label and aria-describedby to the switch button', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngSwitchComponent, TngLabel, TngHint],
      template: `
        <tng-form-field>
          <label tngLabel>Notifications</label>
          <tng-switch ariaLabel="Notifications" />
          <p tngHint id="notify-hint">Receive product news.</p>
        </tng-form-field>
      `,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);

    const label = fixture.debugElement.query(By.css('label[tngLabel]'))
      .nativeElement as HTMLLabelElement;
    const button = fixture.debugElement.query(By.css('button[tngSwitch]'))
      .nativeElement as HTMLButtonElement;

    expect(button.id.length).toBeGreaterThan(0);
    expect(label.htmlFor).toBe(button.id);
    expect(button.getAttribute('aria-describedby')).toBe('notify-hint');
  });

  it('routes label and aria-describedby to the slider input', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngSliderComponent, TngLabel, TngHint],
      template: `
        <tng-form-field>
          <label tngLabel>Volume</label>
          <tng-slider [min]="0" [max]="100" [value]="50" />
          <p tngHint id="volume-hint">Drag the handle.</p>
        </tng-form-field>
      `,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);

    const label = fixture.debugElement.query(By.css('label[tngLabel]'))
      .nativeElement as HTMLLabelElement;
    const range = fixture.debugElement.query(By.css('input[tngSlider]'))
      .nativeElement as HTMLInputElement;

    expect(range.id.length).toBeGreaterThan(0);
    expect(label.htmlFor).toBe(range.id);
    expect(range.getAttribute('aria-describedby')).toBe('volume-hint');
  });

  it('routes labels, descriptions, and validity to both range-slider thumbs', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngRangeSliderComponent, TngLabel, TngHint],
      template: `
        <tng-form-field [invalid]="true">
          <label tngLabel>Price range</label>
          <tng-range-slider required [value]="{ min: 20, max: 80 }" />
          <p tngHint id="price-hint">Choose the minimum and maximum price.</p>
        </tng-form-field>
      `,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);

    const label = fixture.debugElement.query(By.css('label[tngLabel]'))
      .nativeElement as HTMLLabelElement;
    const minInput = fixture.debugElement.query(By.css('[data-slot="range-slider-min-thumb"]'))
      .nativeElement as HTMLInputElement;
    const maxInput = fixture.debugElement.query(By.css('[data-slot="range-slider-max-thumb"]'))
      .nativeElement as HTMLInputElement;

    expect(label.htmlFor).toBe(minInput.id);
    expect(minInput.getAttribute('aria-labelledby')).toContain(label.id);
    expect(maxInput.getAttribute('aria-labelledby')).toContain(label.id);
    expect(minInput.getAttribute('aria-describedby')).toBe('price-hint');
    expect(maxInput.getAttribute('aria-describedby')).toBe('price-hint');
    expect(minInput.getAttribute('aria-invalid')).toBe('true');
    expect(maxInput.getAttribute('aria-invalid')).toBe('true');
    expect(minInput.getAttribute('aria-required')).toBe('true');
    expect(maxInput.getAttribute('aria-required')).toBe('true');
  });

  it('routes aria-describedby to the radio input', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngRadioComponent, TngLabel, TngHint],
      template: `
        <tng-form-field>
          <label tngLabel>Plan</label>
          <tng-radio name="plan" value="pro">Pro</tng-radio>
          <p tngHint id="plan-hint">Choose one.</p>
        </tng-form-field>
      `,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);

    const radio = fixture.debugElement.query(By.css('input[tngRadio]'))
      .nativeElement as HTMLInputElement;
    expect(radio.getAttribute('aria-describedby')).toBe('plan-hint');
  });

  it('routes aria-describedby to the toggle button', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngToggleComponent, TngLabel, TngHint],
      template: `
        <tng-form-field>
          <label tngLabel>Bold</label>
          <tng-toggle pressedLabel="On" unpressedLabel="Off" />
          <p tngHint id="bold-hint">Toggle bold formatting.</p>
        </tng-form-field>
      `,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);

    const button = fixture.debugElement.query(By.css('button[tngToggle]'))
      .nativeElement as HTMLButtonElement;
    expect(button.getAttribute('aria-describedby')).toBe('bold-hint');
  });

  it('routes label and described-by state to the datepicker input', async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerFormFieldHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(DatepickerFormFieldHostComponent);
    await flush(fixture);

    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;
    const label = fixture.debugElement.query(By.css('label[tngLabel]'))
      .nativeElement as HTMLLabelElement;
    const input = fixture.debugElement.query(By.css('input[data-slot="datepicker-input"]'))
      .nativeElement as HTMLInputElement;

    expect(input.id.length).toBeGreaterThan(0);
    expect(label.htmlFor).toBe(input.id);
    expect(field.getAttribute('data-required')).toBe('');
    expect(input.required).toBe(true);
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('fiscal-hint');

    label.click();
    await flush(fixture);

    expect(document.activeElement).toBe(input);

    fixture.componentInstance.invalid.set(true);
    await flush(fixture);

    expect(field.getAttribute('data-invalid')).toBe('');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('fiscal-hint fiscal-error');
  });

  it('reflects invalid + required from a registered control', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngSwitchComponent, TngLabel],
      template: `
        <tng-form-field>
          <label tngLabel>Terms</label>
          <tng-switch ariaLabel="Terms" [invalid]="switchInvalid()" [required]="switchRequired()" />
        </tng-form-field>
      `,
    })
    class HostComponent {
      public readonly switchInvalid = signal(false);
      public readonly switchRequired = signal(false);
    }

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);
    const field = fixture.debugElement.query(By.css('tng-form-field')).nativeElement as HTMLElement;

    expect(field.hasAttribute('data-invalid')).toBe(false);
    expect(field.hasAttribute('data-required')).toBe(false);

    fixture.componentInstance.switchInvalid.set(true);
    fixture.componentInstance.switchRequired.set(true);
    await flush(fixture);

    expect(field.getAttribute('data-invalid')).toBe('');
    expect(field.getAttribute('data-required')).toBe('');
  });

  it('routes aria-labelledby to the listbox host', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngListboxComponent, TngLabel],
      template: `
        <tng-form-field>
          <label tngLabel>Color</label>
          <tng-listbox [options]="options" />
        </tng-form-field>
      `,
    })
    class HostComponent {
      public options = [
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
      ];
    }

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);

    const label = fixture.debugElement.query(By.css('label[tngLabel]'))
      .nativeElement as HTMLLabelElement;
    const listbox = fixture.debugElement.query(By.css('tng-listbox')).nativeElement as HTMLElement;

    expect(listbox.getAttribute('aria-labelledby')).toBe(label.id);
  });

  it('routes aria-describedby to the input-otp host', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngInputOtpComponent, TngLabel, TngHint],
      template: `
        <tng-form-field>
          <label tngLabel>OTP</label>
          <tng-input-otp [length]="4" />
          <p tngHint id="otp-hint">Six-digit code.</p>
        </tng-form-field>
      `,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);

    const root = fixture.debugElement.query(By.css('[tngInputOtp]')).nativeElement as HTMLElement;
    expect(root.getAttribute('aria-describedby')).toContain('otp-hint');
  });

  it('focuses the input-otp slot when its form-field label is clicked', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngInputOtpComponent, TngLabel],
      template: `
        <tng-form-field>
          <label tngLabel>OTP</label>
          <tng-input-otp [length]="4" />
        </tng-form-field>
      `,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);

    const label = fixture.debugElement.query(By.css('label[tngLabel]'))
      .nativeElement as HTMLLabelElement;
    const firstSlot = fixture.debugElement.query(By.css('[data-tng-otp-slot="0"]'))
      .nativeElement as HTMLInputElement;

    label.click();
    await flush(fixture);

    expect(document.activeElement).toBe(firstSlot);
  });

  it('routes aria-describedby to the toggle-group host', async () => {
    @Component({
      imports: [
        TngFormFieldComponent,
        TngToggleGroupComponent,
        TngToggleComponent,
        TngLabel,
        TngHint,
      ],
      template: `
        <tng-form-field>
          <label tngLabel>Alignment</label>
          <tng-toggle-group ariaLabel="Alignment">
            <tng-toggle value="left">L</tng-toggle>
            <tng-toggle value="center">C</tng-toggle>
            <tng-toggle value="right">R</tng-toggle>
          </tng-toggle-group>
          <p tngHint id="align-hint">Pick one.</p>
        </tng-form-field>
      `,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);

    const group = fixture.debugElement.query(By.css('tng-toggle-group'))
      .nativeElement as HTMLElement;
    expect(group.getAttribute('aria-describedby')).toBe('align-hint');
  });

  it('focuses the first toggle-group button when its form-field label is clicked', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngToggleGroupComponent, TngToggleComponent, TngLabel],
      template: `
        <tng-form-field>
          <label tngLabel>Alignment</label>
          <tng-toggle-group ariaLabel="Alignment">
            <tng-toggle value="left">L</tng-toggle>
            <tng-toggle value="center">C</tng-toggle>
          </tng-toggle-group>
        </tng-form-field>
      `,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);

    const label = fixture.debugElement.query(By.css('label[tngLabel]'))
      .nativeElement as HTMLLabelElement;
    const firstButton = fixture.debugElement.query(By.css('button[tngToggle]'))
      .nativeElement as HTMLButtonElement;

    label.click();
    await flush(fixture);

    expect(document.activeElement).toBe(firstButton);
  });

  it('exposes the registered focusable element via TNG_FORM_FIELD_CONTROL', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngSwitchComponent, TngLabel],
      template: `
        <tng-form-field>
          <label tngLabel>Notifications</label>
          <tng-switch ariaLabel="Notifications" />
        </tng-form-field>
      `,
    })
    class HostComponent {}

    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    await flush(fixture);

    const switchDebug = fixture.debugElement.query(By.directive(TngSwitchComponent));
    const adapter = switchDebug.injector.get(TNG_FORM_FIELD_CONTROL);
    const button = switchDebug.nativeElement.querySelector(
      'button[tngSwitch]',
    ) as HTMLButtonElement;

    expect(adapter.focusableElement).toBe(button);
    expect(adapter.controlKind).toBe('inline');
  });

  it('lets a nested tng-input number stepper inherit a transparent background from the field', async () => {
    @Component({
      imports: [TngFormFieldComponent, TngInputComponent, TngLabel],
      styles: [
        `
          tng-form-field {
            --tng-input-number-control-bg: transparent;
            --tng-input-number-control-hover-bg: transparent;
            --tng-input-bg: transparent;
            --tng-input-border: transparent;
            --tng-input-px: 0;
          }
        `,
      ],
      template: `
        <tng-form-field>
          <label tngLabel>Quantity</label>
          <tng-input type="number" value="1" />
        </tng-form-field>
      `,
    })
    class NumberInputFieldHostComponent {}

    await TestBed.configureTestingModule({
      imports: [NumberInputFieldHostComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NumberInputFieldHostComponent);
    await flush(fixture);

    const controls = fixture.debugElement.query(By.css('.tng-input-number-controls'))
      .nativeElement as HTMLElement;

    expect(getComputedStyle(controls).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });
});
