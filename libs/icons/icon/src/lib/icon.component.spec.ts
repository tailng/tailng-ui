// icon.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideIcons } from '@ng-icons/core';
import { bootstrapAlarm, bootstrapBell } from '@ng-icons/bootstrap-icons';

import { TngIcon } from './icon.component';

/* ─────────────────────────
 * Helpers
 * ───────────────────────── */
const getNgIcon = (fix: ComponentFixture<unknown>): HTMLElement | null => {
  const de = fix.debugElement.query(By.css('tng-icon ng-icon'));
  return de ? (de.nativeElement as HTMLElement) : null;
};

/* ─────────────────────────
 * Host components
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [TngIcon],
  template: `
    <tng-icon
      [name]="name"
      [size]="size"
      [slot]="slot"
      [decorative]="decorative"
      [ariaLabel]="ariaLabel"
    />
  `,
})
class BasicHost {
  name = 'bootstrapAlarm';
  size: number | string = '1em';
  slot: Record<string, string> = {};
  decorative = true;
  ariaLabel = '';
}

describe('TngIcon', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicHost],
      providers: [provideIcons({ bootstrapAlarm, bootstrapBell })],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('Rendering', () => {
    it('renders ng-icon with name', () => {
      const fix = TestBed.createComponent(BasicHost);
      fix.detectChanges();

      const ngIcon = getNgIcon(fix);
      expect(ngIcon).toBeTruthy();
    });

    it('passes name to ng-icon', () => {
      const fix = TestBed.createComponent(BasicHost);
      fix.componentInstance.name = 'bootstrapBell';
      fix.detectChanges();

      const ngIcon = getNgIcon(fix);
      expect(ngIcon).toBeTruthy();
    });
  });

  describe('Size', () => {
    it('accepts number size (converts to px)', () => {
      const fix = TestBed.createComponent(BasicHost);
      fix.componentInstance.size = 24;
      fix.detectChanges();

      expect(getNgIcon(fix)).toBeTruthy();
    });

    it('accepts string size', () => {
      const fix = TestBed.createComponent(BasicHost);
      fix.componentInstance.size = '1.5rem';
      fix.detectChanges();

      expect(getNgIcon(fix)).toBeTruthy();
    });

    it('uses default size 1em when not provided', () => {
      const fix = TestBed.createComponent(BasicHost);
      fix.detectChanges();

      expect(getNgIcon(fix)).toBeTruthy();
    });
  });

  describe('ARIA', () => {
    it('sets aria-hidden when decorative is true', () => {
      const fix = TestBed.createComponent(BasicHost);
      fix.componentInstance.decorative = true;
      fix.detectChanges();

      const ngIcon = getNgIcon(fix);
      expect(ngIcon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('clears aria-hidden when decorative is false', () => {
      const fix = TestBed.createComponent(BasicHost);
      fix.componentInstance.decorative = false;
      fix.componentInstance.ariaLabel = 'Alarm icon';
      fix.detectChanges();

      const ngIcon = getNgIcon(fix);
      expect(ngIcon?.getAttribute('aria-hidden')).toBeNull();
    });

    it('sets aria-label when decorative is false and ariaLabel provided', () => {
      const fix = TestBed.createComponent(BasicHost);
      fix.componentInstance.decorative = false;
      fix.componentInstance.ariaLabel = 'Notifications';
      fix.detectChanges();

      const ngIcon = getNgIcon(fix);
      expect(ngIcon?.getAttribute('aria-label')).toBe('Notifications');
    });

    it('does not set aria-label when decorative is true', () => {
      const fix = TestBed.createComponent(BasicHost);
      fix.componentInstance.decorative = true;
      fix.componentInstance.ariaLabel = 'Should be ignored';
      fix.detectChanges();

      const ngIcon = getNgIcon(fix);
      expect(ngIcon?.getAttribute('aria-label')).toBeNull();
    });
  });

  describe('Base classes', () => {
    it('applies inline-flex and align-middle', () => {
      const fix = TestBed.createComponent(BasicHost);
      fix.detectChanges();

      const ngIcon = getNgIcon(fix);
      expect(ngIcon?.className).toContain('inline-flex');
      expect(ngIcon?.className).toContain('align-middle');
    });
  });

  describe('Slot hooks', () => {
    it('applies icon slot classes', () => {
      const fix = TestBed.createComponent(BasicHost);
      fix.componentInstance.slot = { icon: 'custom-icon-class text-primary' };
      fix.detectChanges();

      const ngIcon = getNgIcon(fix);
      expect(ngIcon?.className).toContain('custom-icon-class');
      expect(ngIcon?.className).toContain('text-primary');
      expect(ngIcon?.className).toContain('inline-flex');
    });

    it('handles empty slot object', () => {
      const fix = TestBed.createComponent(BasicHost);
      fix.componentInstance.slot = {};
      fix.detectChanges();

      const ngIcon = getNgIcon(fix);
      expect(ngIcon?.className).toContain('inline-flex');
      expect(ngIcon?.className).toContain('align-middle');
    });

    it('merges slot classes with base classes', () => {
      const fix = TestBed.createComponent(BasicHost);
      fix.componentInstance.slot = { icon: 'my-custom-icon' };
      fix.detectChanges();

      const ngIcon = getNgIcon(fix);
      expect(ngIcon?.className).toContain('inline-flex');
      expect(ngIcon?.className).toContain('align-middle');
      expect(ngIcon?.className).toContain('my-custom-icon');
    });
  });
});
