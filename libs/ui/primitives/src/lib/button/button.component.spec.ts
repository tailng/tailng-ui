// button.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TngButton } from './button.component';

/* ─────────────────────────
 * Helpers
 * ───────────────────────── */
const getHost = (fix: ComponentFixture<any>): HTMLElement =>
  fix.debugElement.query(By.css('tng-button')).nativeElement as HTMLElement;

const getNativeButton = (fix: ComponentFixture<any>): HTMLButtonElement =>
  fix.debugElement.query(By.css('tng-button button')).nativeElement as HTMLButtonElement;

const getSpinner = (fix: ComponentFixture<any>): HTMLSpanElement | null => {
  const de = fix.debugElement.query(By.css('tng-button button > span'));
  return de ? (de.nativeElement as HTMLSpanElement) : null;
};

/* ─────────────────────────
 * Host components
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [TngButton],
  template: `
    <tng-button
      [variant]="variant"
      [size]="size"
      [disabled]="disabled"
      [loading]="loading"
      [block]="block"
      [type]="type"
      [ariaLabel]="ariaLabel"
      [pressed]="pressed"
      [slot]="slot"
    >
      Click me
    </tng-button>
  `,
})
class BasicHost {
  variant: 'solid' | 'outline' | 'ghost' = 'solid';
  size: 'sm' | 'md' | 'lg' = 'md';
  disabled = false;
  loading = false;
  block = false;
  type: 'button' | 'submit' | 'reset' = 'button';
  ariaLabel = '';
  pressed: boolean | null = null;
  slot: Record<string, string> = {};
}

@Component({
  standalone: true,
  imports: [TngButton],
  template: `
    <tng-button [loading]="true" [slot]="slot">
      Loading
    </tng-button>
  `,
})
class LoadingHost {
  slot: Record<string, string> = {};
}

describe('TngButton', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('Rendering', () => {
    it('renders a native button', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);
      fix.detectChanges();

      expect(getHost(fix)).toBeTruthy();
      expect(getNativeButton(fix)).toBeTruthy();
    });

    it('renders projected content when not loading', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);
      fix.detectChanges();

      expect(getSpinner(fix)).toBeNull();
      expect(getNativeButton(fix).textContent?.trim()).toBe('Click me');
    });
  });

  describe('Inputs (variant, size, type)', () => {
    it('renders with default variant and size', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);
      fix.detectChanges();

      const btn = getNativeButton(fix);
      expect(btn.textContent?.trim()).toBe('Click me');

      // If your solid variant guarantees bg-primary, keep this.
      // Otherwise swap to a stable base class assertion.
      expect(btn.className).toContain('bg-primary');
    });

    it('applies outline variant', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.variant = 'outline';
      fix.detectChanges();

      const btn = getNativeButton(fix);
      expect(btn.className).toContain('border');
      expect(btn.className).toContain('border-border');
    });

    it('applies ghost variant', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.variant = 'ghost';
      fix.detectChanges();

      const btn = getNativeButton(fix);
      expect(btn.className).toContain('text-fg');
    });

    it('applies small size classes', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);
    
      fix.componentInstance.size = 'sm';
      fix.detectChanges();
    
      expect(getNativeButton(fix).className).toContain('h-8');
    });
    
    it('applies large size classes', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);
    
      fix.componentInstance.size = 'lg';
      fix.detectChanges();
    
      expect(getNativeButton(fix).className).toContain('h-12');
    });

    it('sets type="submit"', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);
    
      fix.componentInstance.type = 'submit';
      fix.detectChanges();
    
      expect(getNativeButton(fix).getAttribute('type')).toBe('submit');
    });
    
    it('sets type="reset"', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);
    
      fix.componentInstance.type = 'reset';
      fix.detectChanges();
    
      expect(getNativeButton(fix).getAttribute('type')).toBe('reset');
    });
  });

  describe('Disabled and loading', () => {
    it('disables button when disabled input is true', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.disabled = true;
      fix.detectChanges();

      expect(getNativeButton(fix).disabled).toBe(true);
      expect(getNativeButton(fix).getAttribute('aria-disabled')).toBe('true');
    });

    it('disables button when loading is true', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.loading = true;
      fix.detectChanges();

      const btn = getNativeButton(fix);
      expect(btn.disabled).toBe(true);
      expect(btn.getAttribute('aria-busy')).toBe('true');
    });

    it('shows spinner when loading is true (and hides content)', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.loading = true;
      fix.detectChanges();

      const spinner = getSpinner(fix);
      expect(spinner).toBeTruthy();
      expect(spinner?.className).toContain('animate-spin');

      // content should not be projected while loading
      expect(getNativeButton(fix).textContent?.trim()).toBe('');
    });
  });

  describe('Block', () => {
    it('applies full width when block is true', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.block = true;
      fix.detectChanges();

      expect(getNativeButton(fix).className).toContain('w-full');
    });
  });

  describe('ARIA attributes', () => {
    it('sets aria-label when provided', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.ariaLabel = 'Close dialog';
      fix.detectChanges();

      expect(getNativeButton(fix).getAttribute('aria-label')).toBe('Close dialog');
    });

    it('sets aria-pressed="true" when pressed is true', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);
    
      fix.componentInstance.pressed = true;
      fix.detectChanges();
    
      expect(getNativeButton(fix).getAttribute('aria-pressed')).toBe('true');
    });
    
    it('sets aria-pressed="false" when pressed is false', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);
    
      fix.componentInstance.pressed = false;
      fix.detectChanges();
    
      expect(getNativeButton(fix).getAttribute('aria-pressed')).toBe('false');
    });

    it('does not set aria-pressed when pressed is null', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.pressed = null;
      fix.detectChanges();

      expect(getNativeButton(fix).getAttribute('aria-pressed')).toBeNull();
    });

    it('sets aria-busy when loading', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.loading = true;
      fix.detectChanges();

      expect(getNativeButton(fix).getAttribute('aria-busy')).toBe('true');
    });
  });

  describe('Slot hooks', () => {
    it('applies button slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.slot = { button: 'custom-button-class' };
      fix.detectChanges();

      const btn = getNativeButton(fix);
      expect(btn.className).toContain('custom-button-class');
    });

    it('applies spinner slot classes when loading', async () => {
      await TestBed.configureTestingModule({ imports: [LoadingHost] }).compileComponents();
      const fix = TestBed.createComponent(LoadingHost);

      fix.componentInstance.slot = { spinner: 'custom-spinner-class' };
      fix.detectChanges();

      const spinner = getSpinner(fix);
      expect(spinner).toBeTruthy();
      expect(spinner?.className).toContain('custom-spinner-class');
      expect(spinner?.className).toContain('animate-spin');
    });

    it('applies multiple slots simultaneously', async () => {
      await TestBed.configureTestingModule({ imports: [LoadingHost] }).compileComponents();
      const fix = TestBed.createComponent(LoadingHost);

      fix.componentInstance.slot = {
        button: 's-button',
        spinner: 's-spinner',
      };
      fix.detectChanges();

      const btn = getNativeButton(fix);
      const spinner = getSpinner(fix);

      expect(btn.className).toContain('s-button');
      expect(spinner?.className).toContain('s-spinner');
    });

    it('handles empty slot object', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.slot = {};
      fix.detectChanges();

      const btn = getNativeButton(fix);
      expect(btn.className.length).toBeGreaterThan(0);
    });
  });
});