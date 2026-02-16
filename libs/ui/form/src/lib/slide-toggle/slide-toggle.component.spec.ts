// slide-toggle.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TngSlideToggle } from './slide-toggle.component';

/* ─────────────────────────
 * Helpers
 * ───────────────────────── */
const getContainer = (fix: ComponentFixture<any>): HTMLLabelElement =>
  fix.debugElement.query(By.css('tng-slide-toggle label')).nativeElement as HTMLLabelElement;

const getCheckboxInput = (fix: ComponentFixture<any>): HTMLInputElement =>
  fix.debugElement.query(By.css('tng-slide-toggle input[type="checkbox"]')).nativeElement as HTMLInputElement;

const getTrack = (fix: ComponentFixture<any>): HTMLSpanElement =>
  fix.debugElement.query(By.css('tng-slide-toggle span[role="switch"]')).nativeElement as HTMLSpanElement;

const getThumb = (fix: ComponentFixture<any>): HTMLSpanElement =>
  fix.debugElement.query(By.css('tng-slide-toggle span[role="switch"] > span')).nativeElement as HTMLSpanElement;

const getLabelSpan = (fix: ComponentFixture<any>): HTMLSpanElement | null => {
  const spans = fix.debugElement.queryAll(By.css('tng-slide-toggle label > span'));
  const labelSpan = spans.find((de) => !(de.nativeElement as HTMLElement).getAttribute('role'));
  return labelSpan ? (labelSpan.nativeElement as HTMLSpanElement) : null;
};

/* ─────────────────────────
 * Reactive Forms Hosts
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TngSlideToggle],
  template: `
    <form [formGroup]="form">
      <tng-slide-toggle formControlName="on" label="Enable feature" />
    </form>
  `,
})
class RfBasicHost {
  form = new FormGroup({
    on: new FormControl<boolean>(false, { nonNullable: true }),
  });

  get ctrl() {
    return this.form.controls.on;
  }
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TngSlideToggle],
  template: `
    <form [formGroup]="form">
      <tng-slide-toggle
        formControlName="on"
        [id]="id"
        [name]="name"
        [label]="label"
        [required]="required"
        [slot]="slot"
      />
    </form>
  `,
})
class RfInputsHost {
  id = 'toggle-id';
  name = 'toggle-name';
  label = 'Test Label';
  required = false;
  slot: Record<string, string> = {};

  form = new FormGroup({
    on: new FormControl<boolean>(true, { nonNullable: true }),
  });
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TngSlideToggle],
  template: `
    <form [formGroup]="form">
      <tng-slide-toggle formControlName="on" label="Disabled toggle" />
    </form>
  `,
})
class RfDisabledViaControlHost {
  form = new FormGroup({
    on: new FormControl<boolean>({ value: false, disabled: true }),
  });

  get ctrl() {
    return this.form.controls.on;
  }
}

/* ─────────────────────────
 * Standalone Host (checked / checkedChange)
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [TngSlideToggle],
  template: `
    <tng-slide-toggle
      [checked]="checked"
      (checkedChange)="checkedChange.emit($event)"
      [label]="label"
      [disabled]="disabled"
      [id]="id"
      [name]="name"
      [required]="required"
      [slot]="slot"
    />
  `,
})
class StandaloneHost {
  checked = true;
  checkedChange = { emit: (_v: boolean) => {} };
  label = 'Standalone Toggle';
  disabled = false;
  id = '';
  name = 'standalone-toggle';
  required = false;
  slot: Record<string, string> = {};
}

describe('TngSlideToggle', () => {
  // Makes the suite robust even if we re-configure TestBed in many `it()` blocks.
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('CVA (ControlValueAccessor)', () => {
    describe('Reactive Forms', () => {
      it('writes value from form control', async () => {
        await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
        const fix = TestBed.createComponent(RfBasicHost);
        fix.detectChanges();

        const host = fix.componentInstance as RfBasicHost;
        const instance = fix.debugElement.query(By.directive(TngSlideToggle)).componentInstance as TngSlideToggle;
        const input = getCheckboxInput(fix);

        expect(instance.value()).toBe(false);
        expect(input.checked).toBe(false);

        host.ctrl.setValue(true);
        fix.detectChanges();

        expect(instance.value()).toBe(true);
        expect(input.checked).toBe(true);
      });

      it('updates form control value on change', async () => {
        await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
        const fix = TestBed.createComponent(RfBasicHost);
        fix.detectChanges();

        const host = fix.componentInstance as RfBasicHost;
        const input = getCheckboxInput(fix);

        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        fix.detectChanges();
        expect(host.ctrl.value).toBe(true);

        input.checked = false;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        fix.detectChanges();
        expect(host.ctrl.value).toBe(false);
      });

      it('marks control as touched on blur', async () => {
        await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
        const fix = TestBed.createComponent(RfBasicHost);
        fix.detectChanges();

        const host = fix.componentInstance as RfBasicHost;
        const input = getCheckboxInput(fix);

        expect(host.ctrl.touched).toBe(false);

        input.dispatchEvent(new Event('blur'));
        fix.detectChanges();

        expect(host.ctrl.touched).toBe(true);
      });

      it('disables checkbox when form control is disabled', async () => {
        await TestBed.configureTestingModule({ imports: [RfDisabledViaControlHost] }).compileComponents();
        const fix = TestBed.createComponent(RfDisabledViaControlHost);
        fix.detectChanges();

        expect(getCheckboxInput(fix).disabled).toBe(true);
      });

      it('does not update form control when disabled', async () => {
        await TestBed.configureTestingModule({ imports: [RfDisabledViaControlHost] }).compileComponents();
        const fix = TestBed.createComponent(RfDisabledViaControlHost);
        fix.detectChanges();

        const host = fix.componentInstance as RfDisabledViaControlHost;
        const input = getCheckboxInput(fix);

        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        fix.detectChanges();

        expect(host.ctrl.value).toBe(false);
      });

      it('re-enables checkbox when form control is enabled', async () => {
        await TestBed.configureTestingModule({ imports: [RfDisabledViaControlHost] }).compileComponents();
        const fix = TestBed.createComponent(RfDisabledViaControlHost);
        fix.detectChanges();

        const host = fix.componentInstance as RfDisabledViaControlHost;
        expect(getCheckboxInput(fix).disabled).toBe(true);

        host.ctrl.enable();
        fix.detectChanges();
        fix.detectChanges(); // extra CD: CVA + signals can need a second pass

        expect(getCheckboxInput(fix).disabled).toBe(false);
      });
    });
  });

  describe('Standalone usage (checked / checkedChange)', () => {
    it('renders with controlled value', async () => {
      await TestBed.configureTestingModule({ imports: [StandaloneHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneHost);
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlideToggle)).componentInstance as TngSlideToggle;
      const input = getCheckboxInput(fix);

      expect(instance.value()).toBe(true);
      expect(input.checked).toBe(true);
    });

    it('emits checkedChange when toggled', async () => {
      const emitSpy = jest.fn();
      await TestBed.configureTestingModule({ imports: [StandaloneHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneHost);

      // set BEFORE first CD to avoid NG0100
      fix.componentInstance.checkedChange = { emit: emitSpy };
      fix.detectChanges();

      const input = getCheckboxInput(fix);
      input.checked = false;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      fix.detectChanges();

      expect(emitSpy).toHaveBeenCalledWith(false);
    });

    it('respects [disabled] input', async () => {
      await TestBed.configureTestingModule({ imports: [StandaloneHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneHost);

      // set BEFORE first CD to avoid NG0100
      fix.componentInstance.disabled = true;
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlideToggle)).componentInstance as TngSlideToggle;
      expect(instance.isDisabled()).toBe(true);
      expect(getCheckboxInput(fix).disabled).toBe(true);
    });
  });

  describe('Input properties (id, name, label, required)', () => {
    it('sets id attribute on checkbox', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      // set BEFORE first CD to avoid NG0100
      fix.componentInstance.id = 'feature-toggle';
      fix.detectChanges();

      expect(getCheckboxInput(fix).id).toBe('feature-toggle');
    });

    it('sets name attribute on checkbox', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      // set BEFORE first CD to avoid NG0100
      fix.componentInstance.name = 'feature';
      fix.detectChanges();

      expect(getCheckboxInput(fix).name).toBe('feature');
    });

    it('displays label text when provided', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      // set BEFORE first CD to avoid NG0100
      fix.componentInstance.label = 'Test Label';
      fix.detectChanges();

      expect(getLabelSpan(fix)?.textContent?.trim()).toBe('Test Label');
    });

    it('does not render label span when label is empty', async () => {
      await TestBed.configureTestingModule({ imports: [StandaloneHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneHost);

      // set BEFORE first CD to avoid NG0100
      fix.componentInstance.label = '';
      fix.detectChanges();

      expect(getLabelSpan(fix)).toBeNull();
    });

    it('sets required attribute on checkbox', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      // set BEFORE first CD to avoid NG0100
      fix.componentInstance.required = true;
      fix.detectChanges();

      expect(getCheckboxInput(fix).required).toBe(true);
    });
  });

  describe('Slot hooks', () => {
    it('applies container slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      // set BEFORE first CD to avoid NG0100
      fix.componentInstance.slot = { container: 'custom-container' };
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.className).toContain('custom-container');
      expect(container.className).toContain('inline-flex');
    });

    it('applies label slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      // set BEFORE first CD to avoid NG0100
      fix.componentInstance.slot = { label: 'custom-label' };
      fix.detectChanges();

      const span = getLabelSpan(fix);
      expect(span?.className).toContain('custom-label');
      expect(span?.className).toContain('text-sm');
    });

    it('applies input slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      // set BEFORE first CD to avoid NG0100
      fix.componentInstance.slot = { input: 'custom-input' };
      fix.detectChanges();

      const input = getCheckboxInput(fix);
      expect(input.className).toContain('custom-input');
      expect(input.className).toContain('sr-only');
    });

    it('applies track slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      // set BEFORE first CD to avoid NG0100
      fix.componentInstance.slot = { track: 'custom-track' };
      fix.detectChanges();

      const track = getTrack(fix);
      expect(track.className).toContain('custom-track');
    });

    it('applies thumb slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      // set BEFORE first CD to avoid NG0100
      fix.componentInstance.slot = { thumb: 'custom-thumb' };
      fix.detectChanges();

      const thumb = getThumb(fix);
      expect(thumb.className).toContain('custom-thumb');
    });

    it('applies multiple slots simultaneously', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      // set BEFORE first CD to avoid NG0100
      fix.componentInstance.slot = {
        container: 's-container',
        label: 's-label',
        input: 's-input',
        track: 's-track',
        thumb: 's-thumb',
      };
      fix.detectChanges();

      const container = getContainer(fix);
      const labelSpan = getLabelSpan(fix);
      const input = getCheckboxInput(fix);
      const track = getTrack(fix);
      const thumb = getThumb(fix);

      expect(container.className).toContain('s-container');
      expect(labelSpan?.className).toContain('s-label');
      expect(input.className).toContain('s-input');
      expect(track.className).toContain('s-track');
      expect(thumb.className).toContain('s-thumb');
    });
  });

  describe('User interactions', () => {
    it('calls onChange when toggled (reactive forms)', async () => {
      await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
      const fix = TestBed.createComponent(RfBasicHost);
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlideToggle)).componentInstance as TngSlideToggle;
      const onChangeSpy = jest.spyOn(instance as any, 'onChange');

      const input = getCheckboxInput(fix);
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      fix.detectChanges();

      expect(onChangeSpy).toHaveBeenCalledWith(true);
    });

    it('calls onTouched on blur', async () => {
      await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
      const fix = TestBed.createComponent(RfBasicHost);
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlideToggle)).componentInstance as TngSlideToggle;
      const onTouchedSpy = jest.spyOn(instance as any, 'onTouched');

      const input = getCheckboxInput(fix);
      input.dispatchEvent(new Event('blur'));
      fix.detectChanges();

      expect(onTouchedSpy).toHaveBeenCalled();
    });

    it('does not call onChange when disabled', async () => {
      await TestBed.configureTestingModule({ imports: [RfDisabledViaControlHost] }).compileComponents();
      const fix = TestBed.createComponent(RfDisabledViaControlHost);
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlideToggle)).componentInstance as TngSlideToggle;
      const onChangeSpy = jest.spyOn(instance as any, 'onChange');

      const input = getCheckboxInput(fix);
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      fix.detectChanges();

      expect(onChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('aria-checked on track', () => {
    it('reflects checked state', async () => {
      await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
      const fix = TestBed.createComponent(RfBasicHost);
      fix.detectChanges();

      const host = fix.componentInstance as RfBasicHost;
      const track = getTrack(fix);

      expect(track.getAttribute('aria-checked')).toBe('false');

      host.ctrl.setValue(true);
      fix.detectChanges();

      expect(track.getAttribute('aria-checked')).toBe('true');
    });
  });

  describe('isDisabled computed', () => {
    it('true when disabled input is true (standalone)', async () => {
      await TestBed.configureTestingModule({ imports: [StandaloneHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneHost);

      // set BEFORE first CD to avoid NG0100
      fix.componentInstance.disabled = true;
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlideToggle)).componentInstance as TngSlideToggle;
      expect(instance.isDisabled()).toBe(true);
    });

    it('true when form control is disabled', async () => {
      await TestBed.configureTestingModule({ imports: [RfDisabledViaControlHost] }).compileComponents();
      const fix = TestBed.createComponent(RfDisabledViaControlHost);
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlideToggle)).componentInstance as TngSlideToggle;
      expect(instance.isDisabled()).toBe(true);
    });

    it('false when neither disabled input nor form control is disabled', async () => {
      await TestBed.configureTestingModule({ imports: [StandaloneHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneHost);
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlideToggle)).componentInstance as TngSlideToggle;
      expect(instance.isDisabled()).toBe(false);
    });
  });
});