// skeleton.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TngSkeleton } from './skeleton.component';

/* ─────────────────────────
 * Helpers
 * ───────────────────────── */
const getRoot = (fix: ComponentFixture<unknown>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-skeleton > div')).nativeElement as HTMLDivElement;

/* ─────────────────────────
 * Host components
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [TngSkeleton],
  template: `
    <tng-skeleton
      [variant]="variant"
      [widthClass]="widthClass"
      [heightClass]="heightClass"
      [width]="width"
      [height]="height"
      [shimmer]="shimmer"
      [slot]="slot"
    />
  `,
})
class BasicHost {
  variant: 'text' | 'circular' | 'rectangular' = 'text';
  widthClass = 'w-full';
  heightClass = 'h-4';
  width = '';
  height = '';
  shimmer = false;
  slot: Record<string, string> = {};
}

describe('TngSkeleton', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  const setup = async () => {
    await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
    const fix = TestBed.createComponent(BasicHost);
    return fix;
  };

  describe('Rendering', () => {
    it('renders root element with aria-hidden', async () => {
      const fix = await setup();
      fix.detectChanges();

      const root = getRoot(fix);
      expect(root).toBeTruthy();
      expect(root.getAttribute('aria-hidden')).toBe('true');
    });

    it('renders with default text variant', async () => {
      const fix = await setup();
      fix.componentInstance.variant = 'text';
      fix.detectChanges();

      const root = getRoot(fix);
      expect(root.className).toContain('rounded');
    });

    it('renders circular variant with rounded-full', async () => {
      const fix = await setup();
      fix.componentInstance.variant = 'circular';
      fix.detectChanges();

      const root = getRoot(fix);
      expect(root.className).toContain('rounded-full');
    });

    it('renders rectangular variant with rounded-md', async () => {
      const fix = await setup();
      fix.componentInstance.variant = 'rectangular';
      fix.detectChanges();

      const root = getRoot(fix);
      expect(root.className).toContain('rounded-md');
    });
  });

  describe('Sizing', () => {
    it('applies widthClass and heightClass', async () => {
      const fix = await setup();
      fix.componentInstance.widthClass = 'w-64';
      fix.componentInstance.heightClass = 'h-8';
      fix.detectChanges();

      const root = getRoot(fix);
      expect(root.className).toContain('w-64');
      expect(root.className).toContain('h-8');
    });

    it('applies inline width/height when provided', async () => {
      const fix = await setup();
      fix.componentInstance.widthClass = '';
      fix.componentInstance.heightClass = '';
      fix.componentInstance.width = '240px';
      fix.componentInstance.height = '16px';
      fix.detectChanges();

      const root = getRoot(fix);
      expect(root.style.width).toBe('240px');
      expect(root.style.height).toBe('16px');
    });
  });

  describe('Animation', () => {
    it('applies animate-pulse when shimmer is false', async () => {
      const fix = await setup();
      fix.componentInstance.shimmer = false;
      fix.detectChanges();

      const root = getRoot(fix);
      expect(root.className).toContain('animate-pulse');
      expect(root.className).not.toContain('tng-skeleton-shimmer');
    });

    it('applies tng-skeleton-shimmer when shimmer is true', async () => {
      const fix = await setup();
      fix.componentInstance.shimmer = true;
      fix.detectChanges();

      const root = getRoot(fix);
      expect(root.className).toContain('tng-skeleton-shimmer');
      expect(root.className).not.toContain('animate-pulse');
    });
  });

  describe('Base classes', () => {
    it('applies base classes', async () => {
      const fix = await setup();
      fix.detectChanges();

      const root = getRoot(fix);
      expect(root.className).toContain('relative');
      expect(root.className).toContain('overflow-hidden');
      expect(root.className).toContain('bg-slate-200/70');
    });

    it('applies default widthClass and heightClass', async () => {
      const fix = await setup();
      fix.detectChanges();

      const root = getRoot(fix);
      expect(root.className).toContain('w-full');
      expect(root.className).toContain('h-4');
    });
  });

  describe('Slot hooks', () => {
    it('applies container slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { container: 'bg-border/50 custom-class' };
      fix.detectChanges();

      const root = getRoot(fix);
      expect(root.className).toContain('bg-border/50');
      expect(root.className).toContain('custom-class');
      expect(root.className).toContain('w-full');
    });

    it('handles empty slot object', async () => {
      const fix = await setup();
      fix.componentInstance.slot = {};
      fix.detectChanges();

      const root = getRoot(fix);
      expect(root.className).toContain('w-full');
      expect(root.className).toContain('h-4');
    });
  });
});
