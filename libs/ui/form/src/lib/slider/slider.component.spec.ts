import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TngSlider } from './slider.component';

/* ─────────────────────────
 * Helpers
 * ───────────────────────── */
const getRootDiv = (fix: ComponentFixture<any>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-slider > div')).nativeElement as HTMLDivElement;

const getTrackWrapper = (fix: ComponentFixture<any>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-slider > div > div')).nativeElement as HTMLDivElement;

const getTrack = (fix: ComponentFixture<any>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-slider > div > div > div')).nativeElement as HTMLDivElement;

const getFill = (fix: ComponentFixture<any>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-slider > div > div > div > div')).nativeElement as HTMLDivElement;

const getThumb = (fix: ComponentFixture<any>): HTMLDivElement =>
  fix.debugElement.queryAll(By.css('tng-slider > div > div > div > div'))[1]?.nativeElement as HTMLDivElement;

const getRangeInput = (fix: ComponentFixture<any>): HTMLInputElement =>
  fix.debugElement.query(By.css('tng-slider input[type="range"]')).nativeElement as HTMLInputElement;

const getValueText = (fix: ComponentFixture<any>): HTMLDivElement | null => {
  const el = fix.debugElement.query(By.css('tng-slider > div > div:last-of-type'));
  return el ? (el.nativeElement as HTMLDivElement) : null;
};

/* ─────────────────────────
 * Reactive Forms Hosts
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TngSlider],
  template: `
    <form [formGroup]="form">
      <tng-slider formControlName="volume" [min]="0" [max]="100" [step]="1" />
    </form>
  `,
})
class RfBasicHost {
  form = new FormGroup({
    volume: new FormControl<number>(50, { nonNullable: true }),
  });

  get ctrl() {
    return this.form.controls.volume;
  }
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TngSlider],
  template: `
    <form [formGroup]="form">
      <tng-slider
        formControlName="val"
        [id]="id"
        [name]="name"
        [ariaLabel]="ariaLabel"
        [min]="min"
        [max]="max"
        [step]="step"
        [slot]="slot"
      />
    </form>
  `,
})
class RfInputsHost {
  id = 'slider-id';
  name = 'slider-name';
  ariaLabel = 'Volume control';
  min = 0;
  max = 100;
  step = 1;
  slot: Record<string, string> = {};

  form = new FormGroup({
    val: new FormControl<number>(25, { nonNullable: true }),
  });
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TngSlider],
  template: `
    <form [formGroup]="form">
      <tng-slider formControlName="vol" [min]="0" [max]="100" />
    </form>
  `,
})
class RfDisabledViaControlHost {
  form = new FormGroup({
    vol: new FormControl<number>(50),
  });

  constructor() {
    this.form.controls.vol.disable();
  }

  get ctrl() {
    return this.form.controls.vol;
  }
}

/* ─────────────────────────
 * Standalone Host (signal controlled)
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [TngSlider],
  template: `
    <tng-slider
      [value]="value"
      (valueChange)="valueChange.emit($event)"
      [min]="min"
      [max]="max"
      [step]="step"
      [disabled]="disabled"
      [id]="id"
      [name]="name"
      [ariaLabel]="ariaLabel"
      [slot]="slot"
    />
  `,
})
class StandaloneHost {
  value = 75;
  valueChange = { emit: (_v: number) => {} };
  min = 0;
  max = 100;
  step = 1;
  disabled = false;
  id = '';
  name = 'standalone-slider';
  ariaLabel = 'Slider';

  slot: Record<string, string> = {};
}

describe('TngSlider', () => {
  describe('CVA (ControlValueAccessor)', () => {
    describe('Reactive Forms', () => {
      it('writes value from form control', async () => {
        await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
        const fix = TestBed.createComponent(RfBasicHost);
        fix.detectChanges();

        const host = fix.componentInstance as RfBasicHost;
        const instance = fix.debugElement.query(By.directive(TngSlider)).componentInstance as TngSlider;
        const input = getRangeInput(fix);

        expect(instance.clampedValue()).toBe(50);
        expect(input.value).toBe('50');
        expect(getValueText(fix)?.textContent?.trim()).toBe('50');

        host.ctrl.setValue(75);
        fix.detectChanges();

        expect(instance.clampedValue()).toBe(75);
        expect(input.value).toBe('75');
        expect(getValueText(fix)?.textContent?.trim()).toBe('75');
      });

      it('updates form control value on input', async () => {
        await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
        const fix = TestBed.createComponent(RfBasicHost);
        fix.detectChanges();

        const host = fix.componentInstance as RfBasicHost;
        const input = getRangeInput(fix);

        input.value = '80';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        fix.detectChanges();

        expect(host.ctrl.value).toBe(80);
      });

      it('marks control as touched on blur', async () => {
        await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
        const fix = TestBed.createComponent(RfBasicHost);
        fix.detectChanges();

        const host = fix.componentInstance as RfBasicHost;
        const input = getRangeInput(fix);

        expect(host.ctrl.touched).toBe(false);

        input.dispatchEvent(new Event('blur'));
        fix.detectChanges();

        expect(host.ctrl.touched).toBe(true);
      });

      it('disables native input when form control is disabled', async () => {
        await TestBed.configureTestingModule({ imports: [RfDisabledViaControlHost] }).compileComponents();
        const fix = TestBed.createComponent(RfDisabledViaControlHost);
        fix.detectChanges();

        expect(getRangeInput(fix).disabled).toBe(true);
      });

      it('does not update form control when disabled', async () => {
        await TestBed.configureTestingModule({ imports: [RfDisabledViaControlHost] }).compileComponents();
        const fix = TestBed.createComponent(RfDisabledViaControlHost);
        fix.detectChanges();

        const host = fix.componentInstance as RfDisabledViaControlHost;
        const input = getRangeInput(fix);

        input.value = '90';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        fix.detectChanges();

        expect(host.ctrl.value).toBe(50);
      });

      it('re-enables native input when form control is enabled', async () => {
        await TestBed.configureTestingModule({ imports: [RfDisabledViaControlHost] }).compileComponents();
        const fix = TestBed.createComponent(RfDisabledViaControlHost);
        fix.detectChanges();

        const host = fix.componentInstance as RfDisabledViaControlHost;
        expect(getRangeInput(fix).disabled).toBe(true);

        host.ctrl.enable();
        fix.detectChanges();

        expect(getRangeInput(fix).disabled).toBe(false);
      });
    });
  });

  describe('Standalone usage (value / valueChange)', () => {
    it('renders with controlled value', async () => {
      await TestBed.configureTestingModule({ imports: [StandaloneHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneHost);
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlider)).componentInstance as TngSlider;
      const input = getRangeInput(fix);

      expect(instance.clampedValue()).toBe(75);
      expect(input.value).toBe('75');
      expect(getValueText(fix)?.textContent?.trim()).toBe('75');
    });

    it('emits valueChange when user slides', async () => {
      const emitSpy = jest.fn();
      await TestBed.configureTestingModule({ imports: [StandaloneHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneHost);
      fix.componentInstance.valueChange = { emit: emitSpy };
      fix.detectChanges();

      const input = getRangeInput(fix);
      input.value = '60';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fix.detectChanges();

      expect(emitSpy).toHaveBeenCalledWith(60);
    });

    it('respects [disabled] input', async () => {
      await TestBed.configureTestingModule({ imports: [StandaloneHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneHost);
      fix.componentInstance.disabled = true;
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlider)).componentInstance as TngSlider;
      expect(instance.isDisabled()).toBe(true);
      expect(getRangeInput(fix).disabled).toBe(true);
    });
  });

  describe('Input properties (min, max, step)', () => {
    it('applies min, max, step to native input', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);
      fix.componentInstance.min = 10;
      fix.componentInstance.max = 200;
      fix.componentInstance.step = 5;
      fix.detectChanges();

      const input = getRangeInput(fix);
      expect(input.min).toBe('10');
      expect(input.max).toBe('200');
      expect(input.step).toBe('5');
    });

    it('sets id attribute on input', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);
      fix.componentInstance.id = 'volume-slider';
      fix.detectChanges();

      expect(getRangeInput(fix).id).toBe('volume-slider');
    });

    it('sets name attribute on input', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);
      fix.componentInstance.name = 'vol';
      fix.detectChanges();

      expect(getRangeInput(fix).name).toBe('vol');
    });

    it('sets aria-label on input', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);
      fix.componentInstance.ariaLabel = 'Volume control';
      fix.detectChanges();

      expect(getRangeInput(fix).getAttribute('aria-label')).toBe('Volume control');
    });
  });

  describe('clampedValue', () => {
    it('clamps value to min', async () => {
      await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
      const fix = TestBed.createComponent(RfBasicHost);
      fix.detectChanges();

      const host = fix.componentInstance as RfBasicHost;
      const instance = fix.debugElement.query(By.directive(TngSlider)).componentInstance as TngSlider;

      host.ctrl.setValue(-10);
      fix.detectChanges();

      expect(instance.clampedValue()).toBe(0);
    });

    it('clamps value to max', async () => {
      await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
      const fix = TestBed.createComponent(RfBasicHost);
      fix.detectChanges();

      const host = fix.componentInstance as RfBasicHost;
      const instance = fix.debugElement.query(By.directive(TngSlider)).componentInstance as TngSlider;

      host.ctrl.setValue(150);
      fix.detectChanges();

      expect(instance.clampedValue()).toBe(100);
    });
  });

  describe('Slot hooks', () => {
    it('applies container slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);
      fix.componentInstance.slot = { container: 'custom-container' };
      fix.detectChanges();

      const root = getRootDiv(fix);
      expect(root.className).toContain('custom-container');
      expect(root.className).toContain('w-full');
    });

    it('applies trackWrapper slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);
      fix.componentInstance.slot = { trackWrapper: 'custom-track-wrapper' };
      fix.detectChanges();

      const wrapper = getTrackWrapper(fix);
      expect(wrapper.className).toContain('custom-track-wrapper');
      expect(wrapper.className).toContain('relative');
    });

    it('applies track slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);
      fix.componentInstance.slot = { track: 'custom-track' };
      fix.detectChanges();

      const track = fix.debugElement.query(By.css('tng-slider > div > div > div')).nativeElement as HTMLDivElement;
      expect(track.className).toContain('custom-track');
    });

    it('applies trackFill slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);
      fix.componentInstance.slot = { trackFill: 'custom-fill' };
      fix.detectChanges();

      const fill = getFill(fix);
      expect(fill.className).toContain('custom-fill');
    });

    it('applies thumb slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);
      fix.componentInstance.slot = { thumb: 'custom-thumb' };
      fix.detectChanges();

      const thumb = getThumb(fix);
      expect(thumb.className).toContain('custom-thumb');
    });

    it('applies valueText slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);
      fix.componentInstance.slot = { valueText: 'custom-value-text' };
      fix.detectChanges();

      const valueEl = getValueText(fix);
      expect(valueEl?.className).toContain('custom-value-text');
    });

    it('applies multiple slots simultaneously', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);
      fix.componentInstance.slot = {
        container: 's-container',
        trackWrapper: 's-wrapper',
        track: 's-track',
        trackFill: 's-fill',
        thumb: 's-thumb',
        valueText: 's-value',
      };
      fix.detectChanges();

      const root = getRootDiv(fix);
      const wrapper = getTrackWrapper(fix);
      const track = fix.debugElement.query(By.css('tng-slider > div > div > div')).nativeElement as HTMLDivElement;
      const fill = getFill(fix);
      const thumb = getThumb(fix);
      const valueEl = getValueText(fix);

      expect(root.className).toContain('s-container');
      expect(wrapper.className).toContain('s-wrapper');
      expect(track.className).toContain('s-track');
      expect(fill.className).toContain('s-fill');
      expect(thumb.className).toContain('s-thumb');
      expect(valueEl?.className).toContain('s-value');
    });
  });

  describe('User interactions', () => {
    it('calls onChange when value changes (reactive forms)', async () => {
      await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
      const fix = TestBed.createComponent(RfBasicHost);
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlider)).componentInstance as TngSlider;
      const onChangeSpy = jest.spyOn(instance as any, 'onChange');

      const input = getRangeInput(fix);
      input.value = '42';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fix.detectChanges();

      expect(onChangeSpy).toHaveBeenCalledWith(42);
    });

    it('calls onTouched on blur', async () => {
      await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
      const fix = TestBed.createComponent(RfBasicHost);
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlider)).componentInstance as TngSlider;
      const onTouchedSpy = jest.spyOn(instance as any, 'onTouched');

      const input = getRangeInput(fix);
      input.dispatchEvent(new Event('blur'));
      fix.detectChanges();

      expect(onTouchedSpy).toHaveBeenCalled();
    });

    it('does not call onChange when disabled', async () => {
      await TestBed.configureTestingModule({ imports: [RfDisabledViaControlHost] }).compileComponents();
      const fix = TestBed.createComponent(RfDisabledViaControlHost);
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlider)).componentInstance as TngSlider;
      const onChangeSpy = jest.spyOn(instance as any, 'onChange');

      const input = getRangeInput(fix);
      input.value = '80';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fix.detectChanges();

      expect(onChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('isDisabled computed', () => {
    it('true when disabled input is true (standalone)', async () => {
      await TestBed.configureTestingModule({ imports: [StandaloneHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneHost);
      fix.componentInstance.disabled = true;
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlider)).componentInstance as TngSlider;
      expect(instance.isDisabled()).toBe(true);
    });

    it('true when form control is disabled', async () => {
      await TestBed.configureTestingModule({ imports: [RfDisabledViaControlHost] }).compileComponents();
      const fix = TestBed.createComponent(RfDisabledViaControlHost);
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlider)).componentInstance as TngSlider;
      expect(instance.isDisabled()).toBe(true);
    });

    it('false when neither disabled input nor form control is disabled', async () => {
      await TestBed.configureTestingModule({ imports: [StandaloneHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneHost);
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngSlider)).componentInstance as TngSlider;
      expect(instance.isDisabled()).toBe(false);
    });
  });
});
