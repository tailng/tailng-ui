// badge.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TngBadge } from './badge.component';

/* ─────────────────────────
 * Helpers
 * ───────────────────────── */
const getContainer = (fix: ComponentFixture<any>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-badge > div')).nativeElement as HTMLDivElement;

const getAnchor = (fix: ComponentFixture<any>): HTMLSpanElement =>
  fix.debugElement.query(By.css('tng-badge > div > span')).nativeElement as HTMLSpanElement;

const getBadgeSpan = (fix: ComponentFixture<any>): HTMLSpanElement | null => {
  const de = fix.debugElement.query(By.css('tng-badge span[aria-hidden="true"]'));
  return de ? (de.nativeElement as HTMLSpanElement) : null;
};

/* ─────────────────────────
 * Host components
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [TngBadge],
  template: `
    <tng-badge
      [value]="value"
      [dot]="dot"
      [hide]="hide"
      [showZero]="showZero"
      [max]="max"
      [position]="position"
      [overlap]="overlap"
      [variant]="variant"
      [size]="size"
      [ariaLabel]="ariaLabel"
      [slot]="slot"
    >
      <span class="host-content">Host</span>
    </tng-badge>
  `,
})
class BasicHost {
  value: number | string | null = 5;
  dot = false;
  hide = false;
  showZero = false;
  max = 99;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';
  overlap = true;
  variant: 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' = 'danger';
  size: 'sm' | 'md' = 'md';
  ariaLabel = '';
  slot: Record<string, string> = {};
}

@Component({
  standalone: true,
  imports: [TngBadge],
  template: `
    <tng-badge [value]="value" [slot]="slot">
    </tng-badge>
  `,
})
class SlotHost {
  value: number | string | null = 3;
  slot: Record<string, string> = {};
}

describe('TngBadge', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('Value and display', () => {
    it('displays numeric value', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);
      fix.detectChanges();

      const badge = getBadgeSpan(fix);
      expect(badge?.textContent?.trim()).toBe('5');
    });

    it('displays string value', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.value = 'NEW';
      fix.detectChanges();

      const badge = getBadgeSpan(fix);
      expect(badge?.textContent?.trim()).toBe('NEW');
    });

    it('shows overflow format when value exceeds max', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.value = 150;
      fix.componentInstance.max = 99;
      fix.detectChanges();

      const badge = getBadgeSpan(fix);
      expect(badge?.textContent?.trim()).toBe('99+');
    });

    it('hides badge when value is null', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.value = null;
      fix.detectChanges();

      expect(getBadgeSpan(fix)).toBeNull();
    });

    it('shows badge when value is 0 and showZero is true', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.value = 0;
      fix.componentInstance.showZero = true;
      fix.detectChanges();

      const badge = getBadgeSpan(fix);
      expect(badge?.textContent?.trim()).toBe('0');
    });

    it('hides badge when value is 0 and showZero is false', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.value = 0;
      fix.detectChanges();

      expect(getBadgeSpan(fix)).toBeNull();
    });
  });

  describe('Dot and hide', () => {
    it('shows dot when dot is true (no value text)', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.dot = true;
      fix.componentInstance.value = null;
      fix.detectChanges();

      const badge = getBadgeSpan(fix);
      expect(badge).toBeTruthy();
      expect(badge?.textContent?.trim()).toBe('');
    });

    it('hides badge when hide is true', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.hide = true;
      fix.detectChanges();

      expect(getBadgeSpan(fix)).toBeNull();
    });
  });

  describe('Variant and size', () => {
    it('applies danger variant classes', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);
      fix.detectChanges();

      const badge = getBadgeSpan(fix);
      expect(badge?.className).toContain('bg-danger');
    });

    it('applies primary variant classes', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.variant = 'primary';
      fix.detectChanges();

      const badge = getBadgeSpan(fix);
      expect(badge?.className).toContain('bg-primary');
    });
  });

  describe('Projected content', () => {
    it('projects host content', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);
      fix.detectChanges();

      const anchor = getAnchor(fix);
      expect(anchor.textContent).toContain('Host');
    });
  });

  describe('ARIA', () => {
    it('sets aria-label when provided', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.ariaLabel = '3 unread messages';
      fix.detectChanges();

      const badge = getBadgeSpan(fix);
      expect(badge?.getAttribute('aria-label')).toBe('3 unread messages');
    });

    it('generates default aria-label when not provided', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);
      fix.detectChanges();

      const badge = getBadgeSpan(fix);
      expect(badge?.getAttribute('aria-label')).toBe('Badge: 5');
    });

    it('sets aria-hidden on badge', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);
      fix.detectChanges();

      const badge = getBadgeSpan(fix);
      expect(badge?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Slot hooks', () => {
    it('applies container slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.slot = { container: 'custom-container' };
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.className).toContain('custom-container');
      expect(container.className).toContain('inline-flex');
    });

    it('applies anchor slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.slot = { anchor: 'custom-anchor' };
      fix.detectChanges();

      const anchor = getAnchor(fix);
      expect(anchor.className).toContain('custom-anchor');
      expect(anchor.className).toContain('relative');
    });

    it('applies badge slot classes', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.slot = { badge: 'custom-badge shadow-md' };
      fix.detectChanges();

      const badge = getBadgeSpan(fix);
      expect(badge?.className).toContain('custom-badge');
      expect(badge?.className).toContain('shadow-md');
    });

    it('applies multiple slots simultaneously', async () => {
      await TestBed.configureTestingModule({ imports: [SlotHost] }).compileComponents();
      const fix = TestBed.createComponent(SlotHost);

      fix.componentInstance.slot = {
        container: 's-container',
        anchor: 's-anchor',
        badge: 's-badge',
      };
      fix.detectChanges();

      const container = getContainer(fix);
      const anchor = getAnchor(fix);
      const badge = getBadgeSpan(fix);

      expect(container.className).toContain('s-container');
      expect(anchor.className).toContain('s-anchor');
      expect(badge?.className).toContain('s-badge');
    });

    it('handles empty slot object', async () => {
      await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
      const fix = TestBed.createComponent(BasicHost);

      fix.componentInstance.slot = {};
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.className).toContain('inline-flex');
    });
  });
});
