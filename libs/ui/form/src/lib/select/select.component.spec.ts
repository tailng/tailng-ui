import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TngSelect } from './select.component';

/* ─────────────────────────
 * Helpers
 * ───────────────────────── */
const getTngInstance = <T>(fix: ComponentFixture<any>): TngSelect<T> =>
  fix.debugElement.query(By.directive(TngSelect)).componentInstance as TngSelect<T>;

const getTriggerButton = (fix: ComponentFixture<any>): HTMLButtonElement =>
  fix.debugElement.query(By.css('tng-select button[type="button"]')).nativeElement as HTMLButtonElement;

const getContainer = (fix: ComponentFixture<any>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-select > div')).nativeElement as HTMLDivElement;

/* ─────────────────────────
 * Host: Reactive Forms usage
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TngSelect],
  template: `
    <form [formGroup]="form">
      <tng-select
        formControlName="fruit"
        [options]="options"
        [displayWith]="displayWith"
        [placeholder]="placeholder"
        [slot]="slot"
      />
    </form>
  `,
})
class FormHostComponent {
  options = ['Apple', 'Banana', 'Cherry'];
  displayWith = (v: string) => v;
  placeholder = 'Choose…';
  slot: any = {};

  form = new FormGroup({
    fruit: new FormControl<string | null>(null),
  });

  get ctrl() {
    return this.form.controls.fruit;
  }
}

/* ─────────────────────────
 * Host: Disabled via FormControl (no template [disabled])
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TngSelect],
  template: `
    <form [formGroup]="form">
      <tng-select
        formControlName="fruit"
        [options]="options"
        [displayWith]="displayWith"
      />
    </form>
  `,
})
class RfDisabledViaControlHost {
  options = ['A', 'B'];
  displayWith = (v: string) => v;

  form = new FormGroup({
    fruit: new FormControl<string | null>({ value: null, disabled: true }),
  });
  get ctrl() {
    return this.form.controls.fruit;
  }
}

/* ─────────────────────────
 * Host: Standalone usage (bind inputs!)
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [TngSelect],
  template: `
    <tng-select
      [options]="options"
      [value]="value"
      [disabled]="disabled"
      [placeholder]="placeholder"
      [displayWith]="displayWith"
      [slot]="slot"
      (selected)="onSelected($event)"
      (closed)="onClosed($event)"
    />
  `,
})
class StandaloneHostComponent {
  options = ['Apple', 'Banana', 'Cherry'];
  value: string | null = null;
  disabled = false;
  placeholder = 'Choose…';
  displayWith = (v: string) => v;
  slot: any = {};

  selectedValue: string | null = null;
  closedReason: string | null = null;

  onSelected(v: string) {
    this.selectedValue = v;
  }
  onClosed(reason: unknown) {
    this.closedReason = (reason as { reason?: string })?.reason ?? String(reason);
  }
}

describe('TngSelect', () => {
  describe('Reactive Forms integration (CVA)', () => {
    let fixture: ComponentFixture<FormHostComponent>;
    let host: FormHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(FormHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('writes value from form control into component', () => {
      host.ctrl.setValue('Banana');
      fixture.detectChanges();

      const comp = getTngInstance<string>(fixture);
      expect(comp.currentValue()).toBe('Banana');
    });

    it('clears value when form control is set to null', () => {
      host.ctrl.setValue('Apple');
      fixture.detectChanges();

      host.ctrl.setValue(null);
      fixture.detectChanges();

      const comp = getTngInstance<string>(fixture);
      expect(comp.currentValue()).toBeNull();
    });

    it('marks control as touched on blur', () => {
      const trigger = getTriggerButton(fixture);

      trigger.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(host.ctrl.touched).toBe(true);
    });

    it('opens overlay when trigger is clicked', () => {
      const comp = getTngInstance<string>(fixture);
      const trigger = getTriggerButton(fixture);

      expect(comp.isOpen()).toBe(false);

      trigger.click();
      fixture.detectChanges();

      expect(comp.isOpen()).toBe(true);
    });

    it('closes overlay on Escape key', () => {
      const comp = getTngInstance<string>(fixture);
      const trigger = getTriggerButton(fixture);

      trigger.click();
      fixture.detectChanges();
      expect(comp.isOpen()).toBe(true);

      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();

      expect(comp.isOpen()).toBe(false);
    });

    it('selects item and updates form control value', () => {
      const comp = getTngInstance<string>(fixture);

      comp.open('programmatic');
      fixture.detectChanges();

      comp.select('Banana');
      fixture.detectChanges();

      expect(host.ctrl.value).toBe('Banana');
      expect(comp.isOpen()).toBe(false);
    });

    it('closes overlay after selection', () => {
      const comp = getTngInstance<string>(fixture);

      comp.open('programmatic');
      fixture.detectChanges();
      expect(comp.isOpen()).toBe(true);

      comp.select('Apple');
      fixture.detectChanges();

      expect(comp.isOpen()).toBe(false);
    });

    it('applies slot styling to container', () => {
      const fix = TestBed.createComponent(FormHostComponent);
      const h = fix.componentInstance;
      h.slot = { container: 'max-w-md border-2 border-primary' };
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.className).toContain('max-w-md');
      expect(container.className).toContain('border-2');
      expect(container.className).toContain('border-primary');
    });

    it('applies slot styling to triggerButton', () => {
      const fix = TestBed.createComponent(FormHostComponent);
      const h = fix.componentInstance;
      h.slot = { triggerButton: 'ring-2 ring-blue-500' };
      fix.detectChanges();

      const trigger = getTriggerButton(fix);
      expect(trigger.className).toContain('ring-2');
      expect(trigger.className).toContain('ring-blue-500');
    });
  });

  describe('Reactive Forms disabled state (FormControl disabled at creation)', () => {
    it('disables trigger button when form control is disabled', async () => {
      await TestBed.configureTestingModule({
        imports: [RfDisabledViaControlHost],
      }).compileComponents();
  
      const fix = TestBed.createComponent(RfDisabledViaControlHost);
      fix.detectChanges();
  
      expect(getTriggerButton(fix).disabled).toBe(true);
    });
  
    it('prevents opening overlay when disabled via form', async () => {
      await TestBed.configureTestingModule({
        imports: [RfDisabledViaControlHost],
      }).compileComponents();
  
      const fix = TestBed.createComponent(RfDisabledViaControlHost);
      fix.detectChanges();
  
      const comp = getTngInstance<string>(fix);
      const trigger = getTriggerButton(fix);
  
      trigger.click();
      fix.detectChanges();
  
      expect(comp.isOpen()).toBe(false);
    });
  });

  describe('Disabled via FormControl creation', () => {
    it('trigger button is disabled from start', async () => {
      await TestBed.configureTestingModule({
        imports: [RfDisabledViaControlHost],
      }).compileComponents();

      const fix = TestBed.createComponent(RfDisabledViaControlHost);
      fix.detectChanges();

      const trigger = getTriggerButton(fix);
      expect(trigger.disabled).toBe(true);
    });

    it('does not open overlay when trigger clicked', async () => {
      await TestBed.configureTestingModule({
        imports: [RfDisabledViaControlHost],
      }).compileComponents();

      const fix = TestBed.createComponent(RfDisabledViaControlHost);
      fix.detectChanges();

      const comp = getTngInstance<string>(fix);
      const trigger = getTriggerButton(fix);

      trigger.click();
      fix.detectChanges();

      expect(comp.isOpen()).toBe(false);
    });

    it('does not update value when select() called while disabled', async () => {
      await TestBed.configureTestingModule({
        imports: [RfDisabledViaControlHost],
      }).compileComponents();

      const fix = TestBed.createComponent(RfDisabledViaControlHost);
      fix.detectChanges();

      const host = fix.componentInstance as RfDisabledViaControlHost;
      const comp = getTngInstance<string>(fix);

      comp.select('A');
      fix.detectChanges();

      expect(host.ctrl.value).toBeNull();
    });
  });

  describe('Standalone usage', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StandaloneHostComponent],
      }).compileComponents();
    });

    it('renders with options and placeholder', () => {
      const fix = TestBed.createComponent(StandaloneHostComponent);
      fix.detectChanges();

      const trigger = getTriggerButton(fix);
      expect(trigger.textContent).toContain('Choose…');
    });

    it('emits selected when item is selected', () => {
      const fix = TestBed.createComponent(StandaloneHostComponent);
      fix.detectChanges();

      const host = fix.componentInstance as StandaloneHostComponent;
      const comp = getTngInstance<string>(fix);

      comp.open('programmatic');
      fix.detectChanges();

      comp.select('Cherry');
      fix.detectChanges();

      expect(host.selectedValue).toBe('Cherry');
    });

    it('respects [disabled] input when not using forms', () => {
      const fix = TestBed.createComponent(StandaloneHostComponent);
      const host = fix.componentInstance as StandaloneHostComponent;

      // Set BEFORE first detectChanges to avoid NG0100
      host.disabled = true;
      fix.detectChanges();

      const trigger = getTriggerButton(fix);
      expect(trigger.disabled).toBe(true);
    });

    it('prevents opening overlay when [disabled] is true', () => {
      const fix = TestBed.createComponent(StandaloneHostComponent);
      const host = fix.componentInstance as StandaloneHostComponent;

      host.disabled = true;
      fix.detectChanges();

      const comp = getTngInstance<string>(fix);
      const trigger = getTriggerButton(fix);

      trigger.click();
      fix.detectChanges();

      expect(comp.isOpen()).toBe(false);
    });

    it('prevents selection when [disabled] is true', () => {
      const fix = TestBed.createComponent(StandaloneHostComponent);
      const host = fix.componentInstance as StandaloneHostComponent;

      host.disabled = true;
      fix.detectChanges();

      const comp = getTngInstance<string>(fix);

      comp.select('Apple');
      fix.detectChanges();

      expect(host.selectedValue).toBeNull();
    });
  });

  describe('Keyboard', () => {
    let fixture: ComponentFixture<FormHostComponent>;
    let host: FormHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(FormHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('opens overlay on ArrowDown when closed', () => {
      const comp = getTngInstance<string>(fixture);
      const trigger = getTriggerButton(fixture);

      expect(comp.isOpen()).toBe(false);

      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();

      expect(comp.isOpen()).toBe(true);
    });

    it('opens overlay on ArrowUp when closed', () => {
      const comp = getTngInstance<string>(fixture);
      const trigger = getTriggerButton(fixture);

      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      fixture.detectChanges();

      expect(comp.isOpen()).toBe(true);
    });
  });

  describe('Keyboard when disabled (Reactive Forms)', () => {
    it('does not handle ArrowDown when disabled', async () => {
      await TestBed.configureTestingModule({
        imports: [RfDisabledViaControlHost],
      }).compileComponents();
  
      const fix = TestBed.createComponent(RfDisabledViaControlHost);
      fix.detectChanges();
  
      const comp = getTngInstance<string>(fix);
      const trigger = getTriggerButton(fix);
  
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fix.detectChanges();
  
      expect(comp.isOpen()).toBe(false);
    });
  });

  describe('display and placeholder', () => {
    it('displays placeholder when no value', async () => {
      await TestBed.configureTestingModule({
        imports: [FormHostComponent],
      }).compileComponents();

      const fix = TestBed.createComponent(FormHostComponent);
      const h = fix.componentInstance;
      h.placeholder = 'Pick a fruit…';
      fix.detectChanges();

      const trigger = getTriggerButton(fix);
      expect(trigger.textContent).toContain('Pick a fruit…');
    });

    it('displays selected value using displayWith', async () => {
      await TestBed.configureTestingModule({
        imports: [FormHostComponent],
      }).compileComponents();

      const fix = TestBed.createComponent(FormHostComponent);
      const h = fix.componentInstance;
      fix.detectChanges();

      h.ctrl.setValue('Banana');
      fix.detectChanges();

      const trigger = getTriggerButton(fix);
      expect(trigger.textContent).toContain('Banana');
    });
  });

  describe('re-enable', () => {
    it('re-enables trigger when form control is enabled', async () => {
      await TestBed.configureTestingModule({
        imports: [RfDisabledViaControlHost],
      }).compileComponents();
    
      const fix = TestBed.createComponent(RfDisabledViaControlHost);
      const host = fix.componentInstance as RfDisabledViaControlHost;
    
      // Initial render
      fix.detectChanges();
      await fix.whenStable();
      fix.detectChanges();
    
      // Make it deterministic: explicitly disable after CVA is wired
      host.ctrl.disable({ emitEvent: false });
      fix.detectChanges();
      await fix.whenStable();
      fix.detectChanges();
    
      expect(getTriggerButton(fix).disabled).toBe(true);
    
      host.ctrl.enable({ emitEvent: false });
      fix.detectChanges();
      await fix.whenStable();
      fix.detectChanges();
    
      expect(getTriggerButton(fix).disabled).toBe(false);
    });
  });
});
