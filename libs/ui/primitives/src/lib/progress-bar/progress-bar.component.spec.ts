// progress-bar.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TngProgressBar } from './progress-bar.component';

/* ─────────────────────────
 * Helpers
 * ───────────────────────── */
const getContainer = (fix: ComponentFixture<unknown>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-progress-bar > div')).nativeElement as HTMLDivElement;

const getTrack = (fix: ComponentFixture<unknown>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-progress-bar [role="progressbar"]')).nativeElement as HTMLDivElement;

const getIndicator = (fix: ComponentFixture<unknown>): HTMLDivElement | null => {
  const de = fix.debugElement.query(By.css('tng-progress-bar [role="progressbar"] > div'));
  return de ? (de.nativeElement as HTMLDivElement) : null;
};

/* ─────────────────────────
 * Host components
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [TngProgressBar],
  template: `
    <tng-progress-bar
      [mode]="mode"
      [value]="value"
      [max]="max"
      [disableAnimation]="disableAnimation"
      [slot]="slot"
    />
  `,
})
class BasicHost {
  mode: 'determinate' | 'indeterminate' = 'determinate';
  value = 40;
  max = 100;
  disableAnimation = false;
  slot: Record<string, string> = {};
}

describe('TngProgressBar', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  const setup = async () => {
    await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
    const fix = TestBed.createComponent(BasicHost);
    return fix;
  };

  describe('Rendering', () => {
    it('renders container and track', async () => {
      const fix = await setup();
      fix.detectChanges();

      expect(getContainer(fix)).toBeTruthy();
      expect(getTrack(fix)).toBeTruthy();
      expect(getTrack(fix).getAttribute('role')).toBe('progressbar');
    });

    it('renders indicator in determinate mode', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'determinate';
      fix.detectChanges();

      const indicator = getIndicator(fix);
      expect(indicator).toBeTruthy();
    });

    it('renders indicator in indeterminate mode', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'indeterminate';
      fix.detectChanges();

      const indicator = getIndicator(fix);
      expect(indicator).toBeTruthy();
    });
  });

  describe('Determinate mode', () => {
    it('sets width based on value/max percentage', async () => {
      const fix = await setup();
      fix.componentInstance.value = 50;
      fix.componentInstance.max = 100;
      fix.detectChanges();

      const indicator = getIndicator(fix);
      expect(indicator?.style.width).toBe('50%');
    });

    it('calculates percentage with custom max', async () => {
      const fix = await setup();
      fix.componentInstance.value = 30;
      fix.componentInstance.max = 60;
      fix.detectChanges();

      const indicator = getIndicator(fix);
      expect(indicator?.style.width).toBe('50%');
    });

    it('clamps percentage at 100', async () => {
      const fix = await setup();
      fix.componentInstance.value = 150;
      fix.componentInstance.max = 100;
      fix.detectChanges();

      const indicator = getIndicator(fix);
      expect(indicator?.style.width).toBe('100%');
    });

    it('clamps percentage at 0', async () => {
      const fix = await setup();
      fix.componentInstance.value = -10;
      fix.componentInstance.max = 100;
      fix.detectChanges();

      const indicator = getIndicator(fix);
      expect(indicator?.style.width).toBe('0%');
    });
  });

  describe('ARIA', () => {
    it('sets aria-valuemin, aria-valuemax, aria-valuenow in determinate mode', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'determinate';
      fix.componentInstance.value = 25;
      fix.componentInstance.max = 100;
      fix.detectChanges();

      const track = getTrack(fix);
      expect(track.getAttribute('aria-valuemin')).toBe('0');
      expect(track.getAttribute('aria-valuemax')).toBe('100');
      expect(track.getAttribute('aria-valuenow')).toBe('25');
    });

    it('clears aria value attributes in indeterminate mode', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'indeterminate';
      fix.detectChanges();

      const track = getTrack(fix);
      expect(track.getAttribute('aria-valuemin')).toBeNull();
      expect(track.getAttribute('aria-valuemax')).toBeNull();
      expect(track.getAttribute('aria-valuenow')).toBeNull();
    });
  });

  describe('Base classes', () => {
    it('applies container base classes', async () => {
      const fix = await setup();
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.className).toContain('w-full');
    });

    it('applies track base classes', async () => {
      const fix = await setup();
      fix.detectChanges();

      const track = getTrack(fix);
      expect(track.className).toContain('relative');
      expect(track.className).toContain('w-full');
      expect(track.className).toContain('overflow-hidden');
      expect(track.className).toContain('rounded-full');
      expect(track.className).toContain('bg-border');
      expect(track.className).toContain('h-1');
    });

    it('applies indicator base classes in determinate', async () => {
      const fix = await setup();
      fix.detectChanges();

      const indicator = getIndicator(fix);
      expect(indicator?.className).toContain('bg-primary');
      expect(indicator?.className).toContain('rounded-full');
    });
  });

  describe('Slot hooks', () => {
    it('applies container slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { container: 'custom-container w-64' };
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.className).toContain('custom-container');
      expect(container.className).toContain('w-64');
      expect(container.className).toContain('w-full');
    });

    it('applies track slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { track: 'h-2 bg-slate-200' };
      fix.detectChanges();

      const track = getTrack(fix);
      expect(track.className).toContain('h-2');
      expect(track.className).toContain('bg-slate-200');
      expect(track.className).toContain('bg-border');
    });

    it('applies indicator slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { indicator: 'bg-success' };
      fix.detectChanges();

      const indicator = getIndicator(fix);
      expect(indicator?.className).toContain('bg-success');
      expect(indicator?.className).toContain('bg-primary');
    });

    it('handles empty slot object', async () => {
      const fix = await setup();
      fix.componentInstance.slot = {};
      fix.detectChanges();

      const container = getContainer(fix);
      const track = getTrack(fix);
      expect(container.className).toContain('w-full');
      expect(track.className).toContain('bg-border');
    });
  });

  describe('Indeterminate', () => {
    it('applies tng-progress-indeterminate when animation enabled', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'indeterminate';
      fix.componentInstance.disableAnimation = false;
      fix.detectChanges();

      const indicator = getIndicator(fix);
      expect(indicator?.className).toContain('tng-progress-indeterminate');
    });

    it('omits tng-progress-indeterminate when disableAnimation is true', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'indeterminate';
      fix.componentInstance.disableAnimation = true;
      fix.detectChanges();

      const indicator = getIndicator(fix);
      expect(indicator?.className).not.toContain('tng-progress-indeterminate');
    });
  });
});
