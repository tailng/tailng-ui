// button-toggle.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TngButtonToggle } from './button-toggle.component';
import type { TngButtonToggleOption } from './button-toggle.component';

/* ─────────────────────────
 * Helpers
 * ───────────────────────── */
const getContainer = (fix: ComponentFixture<any>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-button-toggle [role="group"]')).nativeElement as HTMLDivElement;

const getButtons = (fix: ComponentFixture<any>): HTMLButtonElement[] =>
  fix.debugElement.queryAll(By.css('tng-button-toggle [role="group"] button')).map((de) => de.nativeElement as HTMLButtonElement);

const getButtonByLabel = (fix: ComponentFixture<any>, label: string): HTMLButtonElement | undefined =>
  getButtons(fix).find((btn) => btn.textContent?.trim() === label);

/* ─────────────────────────
 * Test options
 * ───────────────────────── */
const viewOptions: TngButtonToggleOption[] = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'map', label: 'Map' },
];

const optionsWithDisabled: TngButtonToggleOption[] = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Disabled', disabled: true },
];

/* ─────────────────────────
 * Reactive Forms Hosts
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TngButtonToggle],
  template: `
    <form [formGroup]="form">
      <tng-button-toggle formControlName="view" [options]="options" />
    </form>
  `,
})
class RfBasicHost {
  options = viewOptions;
  form = new FormGroup({
    view: new FormControl<string | null>('list'),
  });

  get ctrl() {
    return this.form.controls.view;
  }
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TngButtonToggle],
  template: `
    <form [formGroup]="form">
      <tng-button-toggle
        formControlName="view"
        [options]="options"
        [multiple]="multiple"
        [allowDeselect]="allowDeselect"
        [slot]="slot"
      />
    </form>
  `,
})
class RfInputsHost {
  options = viewOptions;
  multiple = false;
  allowDeselect = false;
  slot: Record<string, string> = {};

  form = new FormGroup({
    view: new FormControl<string | null>('list'),
  });

  get ctrl() {
    return this.form.controls.view;
  }
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TngButtonToggle],
  template: `
    <form [formGroup]="form">
      <tng-button-toggle formControlName="choice" [options]="options" />
    </form>
  `,
})
class RfDisabledViaControlHost {
  options = viewOptions;
  form = new FormGroup({
    choice: new FormControl<string | null>({ value: 'list', disabled: true }),
  });

  get ctrl() {
    return this.form.controls.choice;
  }
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TngButtonToggle],
  template: `
    <form [formGroup]="form">
      <tng-button-toggle
        formControlName="choices"
        [options]="options"
        [multiple]="true"
        [slot]="slot"
      />
    </form>
  `,
})
class RfMultipleHost {
  options = viewOptions;
  slot: Record<string, string> = {};

  form = new FormGroup({
    choices: new FormControl<string[]>(['list', 'grid']),
  });

  get ctrl() {
    return this.form.controls.choices;
  }
}

/* ─────────────────────────
 * Standalone Host (value / valueChange)
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [TngButtonToggle],
  template: `
    <tng-button-toggle
      [options]="options"
      [value]="value"
      (valueChange)="valueChange.emit($event)"
      [disabled]="disabled"
      [slot]="slot"
    />
  `,
})
class StandaloneHost {
  options = viewOptions;
  value: string | null = 'grid';
  valueChange = { emit: (_v: string | null) => {} };
  disabled = false;
  slot: Record<string, string> = {};
}

@Component({
  standalone: true,
  imports: [TngButtonToggle],
  template: `
    <tng-button-toggle
      [options]="options"
      [value]="value"
      (valueChange)="valueChange.emit($event)"
      [allowDeselect]="true"
      [slot]="slot"
    />
  `,
})
class StandaloneWithDisabledOptionHost {
  options = optionsWithDisabled;
  value: string | null = 'a';
  valueChange = { emit: (_v: string | null) => {} };
  slot: Record<string, string> = {};
}

describe('TngButtonToggle', () => {
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
        expect(host.ctrl.value).toBe('list');

        const listBtn = getButtonByLabel(fix, 'List');
        expect(listBtn?.getAttribute('aria-pressed')).toBe('true');

        host.ctrl.setValue('grid');
        fix.detectChanges();

        expect(host.ctrl.value).toBe('grid');
        const gridBtn = getButtonByLabel(fix, 'Grid');
        expect(gridBtn?.getAttribute('aria-pressed')).toBe('true');
      });

      it('updates form control value on selection', async () => {
        await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
        const fix = TestBed.createComponent(RfBasicHost);
        fix.detectChanges();

        const host = fix.componentInstance as RfBasicHost;
        const gridBtn = getButtonByLabel(fix, 'Grid');
        expect(gridBtn).toBeDefined();

        gridBtn!.click();
        fix.detectChanges();

        expect(host.ctrl.value).toBe('grid');
      });

      it('marks control as touched on selection', async () => {
        await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
        const fix = TestBed.createComponent(RfBasicHost);
        fix.detectChanges();

        const host = fix.componentInstance as RfBasicHost;
        const gridBtn = getButtonByLabel(fix, 'Grid');

        expect(host.ctrl.touched).toBe(false);

        gridBtn!.click();
        fix.detectChanges();

        expect(host.ctrl.touched).toBe(true);
      });

      it('disables buttons when form control is disabled', async () => {
        await TestBed.configureTestingModule({ imports: [RfDisabledViaControlHost] }).compileComponents();
        const fix = TestBed.createComponent(RfDisabledViaControlHost);
        fix.detectChanges();

        const buttons = getButtons(fix);
        expect(buttons.every((b) => b.disabled)).toBe(true);
      });

      it('does not update form control when disabled', async () => {
        await TestBed.configureTestingModule({ imports: [RfDisabledViaControlHost] }).compileComponents();
        const fix = TestBed.createComponent(RfDisabledViaControlHost);
        fix.detectChanges();

        const host = fix.componentInstance as RfDisabledViaControlHost;
        const gridBtn = getButtonByLabel(fix, 'Grid');

        gridBtn!.click();
        fix.detectChanges();

        expect(host.ctrl.value).toBe('list');
      });

      it('re-enables when form control is enabled', async () => {
        await TestBed.configureTestingModule({ imports: [RfDisabledViaControlHost] }).compileComponents();
        const fix = TestBed.createComponent(RfDisabledViaControlHost);
        fix.detectChanges();

        const host = fix.componentInstance as RfDisabledViaControlHost;
        host.ctrl.enable();
        fix.detectChanges();

        const buttons = getButtons(fix);
        expect(buttons.every((b) => !b.disabled)).toBe(true);
      });
    });
  });

  describe('Standalone usage (value / valueChange)', () => {
    it('renders with controlled value', async () => {
      await TestBed.configureTestingModule({ imports: [StandaloneHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneHost);
      fix.detectChanges();

      const instance = fix.debugElement.query(By.directive(TngButtonToggle)).componentInstance as TngButtonToggle<string>;
      expect(instance.value()).toBe('grid');

      const gridBtn = getButtonByLabel(fix, 'Grid');
      expect(gridBtn?.getAttribute('aria-pressed')).toBe('true');
    });

    it('emits valueChange when selection changes', async () => {
      const emitSpy = jest.fn();
      await TestBed.configureTestingModule({ imports: [StandaloneHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneHost);

      fix.componentInstance.valueChange = { emit: emitSpy };
      fix.detectChanges();

      const listBtn = getButtonByLabel(fix, 'List');
      listBtn!.click();
      fix.detectChanges();

      expect(emitSpy).toHaveBeenCalledWith('list');
    });

    it('respects [disabled] input', async () => {
      await TestBed.configureTestingModule({ imports: [StandaloneHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneHost);

      fix.componentInstance.disabled = true;
      fix.detectChanges();

      const buttons = getButtons(fix);
      expect(buttons.every((b) => b.disabled)).toBe(true);
    });
  });

  describe('Selection behavior', () => {
    it('single mode: selecting same option keeps selection', async () => {
      await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
      const fix = TestBed.createComponent(RfBasicHost);
      fix.detectChanges();

      const host = fix.componentInstance as RfBasicHost;
      const listBtn = getButtonByLabel(fix, 'List');

      listBtn!.click();
      fix.detectChanges();

      expect(host.ctrl.value).toBe('list');
    });

    it('single mode with allowDeselect: clicking selected option clears selection', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      fix.componentInstance.allowDeselect = true;
      fix.detectChanges();

      const host = fix.componentInstance as RfInputsHost;
      const listBtn = getButtonByLabel(fix, 'List');

      listBtn!.click();
      fix.detectChanges();

      expect(host.ctrl.value).toBeNull();
    });

    it('multiple mode: toggles selection', async () => {
      await TestBed.configureTestingModule({ imports: [RfMultipleHost] }).compileComponents();
      const fix = TestBed.createComponent(RfMultipleHost);
      fix.detectChanges();

      const host = fix.componentInstance as RfMultipleHost;
      expect(host.ctrl.value).toEqual(['list', 'grid']);

      const listBtn = getButtonByLabel(fix, 'List');
      listBtn!.click();
      fix.detectChanges();

      expect(host.ctrl.value).toEqual(['grid']);
    });

    it('does not select disabled option', async () => {
      await TestBed.configureTestingModule({ imports: [StandaloneWithDisabledOptionHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneWithDisabledOptionHost);
      fix.detectChanges();

      const host = fix.componentInstance as StandaloneWithDisabledOptionHost;
      const disabledBtn = getButtonByLabel(fix, 'Disabled');

      disabledBtn!.click();
      fix.detectChanges();

      expect(host.value).toBe('a');
    });
  });

  describe('Slot hooks', () => {
    it('applies container slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      fix.componentInstance.slot = { container: 'custom-container' };
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.className).toContain('custom-container');
      expect(container.className).toContain('flex');
    });

    it('applies button slot classes to all buttons', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      fix.componentInstance.slot = { button: 'custom-button' };
      fix.detectChanges();

      const buttons = getButtons(fix);
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach((btn) => {
        expect(btn.className).toContain('custom-button');
      });
    });

    it('applies buttonActive slot classes to selected button', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      fix.componentInstance.slot = { buttonActive: 'custom-active' };
      fix.detectChanges();

      const listBtn = getButtonByLabel(fix, 'List');
      const gridBtn = getButtonByLabel(fix, 'Grid');

      expect(listBtn?.className).toContain('custom-active');
      expect(gridBtn?.className).not.toContain('custom-active');
    });

    it('applies buttonInactive slot classes to unselected enabled buttons', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      fix.componentInstance.slot = { buttonInactive: 'custom-inactive' };
      fix.detectChanges();

      const listBtn = getButtonByLabel(fix, 'List');
      const gridBtn = getButtonByLabel(fix, 'Grid');

      expect(listBtn?.className).not.toContain('custom-inactive');
      expect(gridBtn?.className).toContain('custom-inactive');
    });

    it('applies buttonDisabled slot classes to disabled buttons', async () => {
      await TestBed.configureTestingModule({ imports: [StandaloneWithDisabledOptionHost] }).compileComponents();
      const fix = TestBed.createComponent(StandaloneWithDisabledOptionHost);

      fix.componentInstance.slot = { buttonDisabled: 'custom-disabled' };
      fix.detectChanges();

      const disabledBtn = getButtonByLabel(fix, 'Disabled');
      const aBtn = getButtonByLabel(fix, 'Option A');

      expect(disabledBtn?.className).toContain('custom-disabled');
      expect(aBtn?.className).not.toContain('custom-disabled');
    });

    it('applies multiple slots simultaneously', async () => {
      await TestBed.configureTestingModule({ imports: [RfInputsHost] }).compileComponents();
      const fix = TestBed.createComponent(RfInputsHost);

      fix.componentInstance.slot = {
        container: 's-container',
        button: 's-button',
        buttonActive: 's-active',
        buttonInactive: 's-inactive',
      };
      fix.detectChanges();

      const container = getContainer(fix);
      const listBtn = getButtonByLabel(fix, 'List');
      const gridBtn = getButtonByLabel(fix, 'Grid');

      expect(container.className).toContain('s-container');
      expect(listBtn?.className).toContain('s-button');
      expect(listBtn?.className).toContain('s-active');
      expect(gridBtn?.className).toContain('s-button');
      expect(gridBtn?.className).toContain('s-inactive');
    });
  });

  describe('Keyboard navigation', () => {
    it('ArrowRight selects next option', async () => {
      await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
      const fix = TestBed.createComponent(RfBasicHost);
      fix.detectChanges();

      const host = fix.componentInstance as RfBasicHost;
      const container = getContainer(fix);

      container.focus();
      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      fix.detectChanges();

      expect(host.ctrl.value).toBe('grid');
    });

    it('ArrowLeft selects previous option', async () => {
      await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
      const fix = TestBed.createComponent(RfBasicHost);
      fix.detectChanges();

      const host = fix.componentInstance as RfBasicHost;
      const container = getContainer(fix);

      container.focus();
      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      fix.detectChanges();

      expect(host.ctrl.value).toBe('map');
    });

    it('does not respond to keyboard when disabled', async () => {
      await TestBed.configureTestingModule({ imports: [RfDisabledViaControlHost] }).compileComponents();
      const fix = TestBed.createComponent(RfDisabledViaControlHost);
      fix.detectChanges();

      const host = fix.componentInstance as RfDisabledViaControlHost;
      const container = getContainer(fix);

      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      fix.detectChanges();

      expect(host.ctrl.value).toBe('list');
    });
  });

  describe('ARIA attributes', () => {
    it('sets aria-pressed on buttons', async () => {
      await TestBed.configureTestingModule({ imports: [RfBasicHost] }).compileComponents();
      const fix = TestBed.createComponent(RfBasicHost);
      fix.detectChanges();

      const listBtn = getButtonByLabel(fix, 'List');
      const gridBtn = getButtonByLabel(fix, 'Grid');

      expect(listBtn?.getAttribute('aria-pressed')).toBe('true');
      expect(gridBtn?.getAttribute('aria-pressed')).toBe('false');
    });

    it('sets aria-multiselectable when multiple', async () => {
      await TestBed.configureTestingModule({ imports: [RfMultipleHost] }).compileComponents();
      const fix = TestBed.createComponent(RfMultipleHost);
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.getAttribute('aria-multiselectable')).toBe('true');
    });
  });
});
