// progress-spinner.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TngProgressSpinner } from './progress-spinner.component';

/* ─────────────────────────
 * Helpers
 * ───────────────────────── */
const getContainer = (fix: ComponentFixture<unknown>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-progress-spinner > div')).nativeElement as HTMLDivElement;

const getSvg = (fix: ComponentFixture<unknown>): SVGElement =>
  fix.debugElement.query(By.css('tng-progress-spinner svg')).nativeElement as SVGElement;

const getTrack = (fix: ComponentFixture<unknown>): SVGCircleElement =>
  fix.debugElement.query(By.css('tng-progress-spinner svg circle:first-of-type')).nativeElement as SVGCircleElement;

const getIndicator = (fix: ComponentFixture<unknown>): SVGCircleElement =>
  fix.debugElement.query(By.css('tng-progress-spinner svg circle:last-of-type')).nativeElement as SVGCircleElement;

/* ─────────────────────────
 * Host components
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [TngProgressSpinner],
  template: `
    <tng-progress-spinner
      [mode]="mode"
      [value]="value"
      [max]="max"
      [strokeWidth]="strokeWidth"
      [slot]="slot"
    />
  `,
})
class BasicHost {
  mode: 'determinate' | 'indeterminate' = 'determinate';
  value = 40;
  max = 100;
  strokeWidth = 4;
  slot: Record<string, string> = {};
}

describe('TngProgressSpinner', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  const setup = async () => {
    await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
    const fix = TestBed.createComponent(BasicHost);
    return fix;
  };

  describe('Rendering', () => {
    it('renders container with role progressbar', async () => {
      const fix = await setup();
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container).toBeTruthy();
      expect(container.getAttribute('role')).toBe('progressbar');
    });

    it('renders svg, track and indicator circles', async () => {
      const fix = await setup();
      fix.detectChanges();

      expect(getSvg(fix)).toBeTruthy();
      expect(getSvg(fix).getAttribute('viewBox')).toBe('0 0 100 100');
      expect(getTrack(fix)).toBeTruthy();
      expect(getIndicator(fix)).toBeTruthy();
    });

    it('sets stroke-dasharray on indicator from circumference', async () => {
      const fix = await setup();
      fix.componentInstance.strokeWidth = 4;
      fix.componentInstance.mode = 'determinate';
      fix.detectChanges();

      const radius = 50 - 4 / 2; // 48
      const circumference = 2 * Math.PI * radius;
      const indicator = getIndicator(fix);
      expect(indicator.getAttribute('stroke-dasharray')).toBe(String(circumference));
    });
  });

  describe('Determinate mode', () => {
    it('sets stroke-dashoffset based on value/max percentage', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'determinate';
      fix.componentInstance.value = 50;
      fix.componentInstance.max = 100;
      fix.detectChanges();

      const radius = 48;
      const circumference = 2 * Math.PI * radius;
      const expectedOffset = circumference * 0.5; // 50% remaining
      const indicator = getIndicator(fix);
      const actualOffset = parseFloat(indicator.getAttribute('stroke-dashoffset') ?? '0');
      expect(actualOffset).toBeCloseTo(expectedOffset, 1);
    });

    it('calculates offset with custom max', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'determinate';
      fix.componentInstance.value = 30;
      fix.componentInstance.max = 60;
      fix.detectChanges();

      const radius = 48;
      const circumference = 2 * Math.PI * radius;
      const expectedOffset = circumference * 0.5; // 50% (30/60)
      const indicator = getIndicator(fix);
      const actualOffset = parseFloat(indicator.getAttribute('stroke-dashoffset') ?? '0');
      expect(actualOffset).toBeCloseTo(expectedOffset, 1);
    });

    it('clamps at 100% (full circle, zero offset)', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'determinate';
      fix.componentInstance.value = 150;
      fix.componentInstance.max = 100;
      fix.detectChanges();

      const indicator = getIndicator(fix);
      const actualOffset = parseFloat(indicator.getAttribute('stroke-dashoffset') ?? '0');
      expect(actualOffset).toBe(0);
    });

    it('clamps at 0% (full circumference offset)', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'determinate';
      fix.componentInstance.value = -10;
      fix.componentInstance.max = 100;
      fix.detectChanges();

      const radius = 48;
      const circumference = 2 * Math.PI * radius;
      const indicator = getIndicator(fix);
      const actualOffset = parseFloat(indicator.getAttribute('stroke-dashoffset') ?? '0');
      expect(actualOffset).toBeCloseTo(circumference, 1);
    });

    it('handles zero max by showing empty (full offset)', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'determinate';
      fix.componentInstance.value = 50;
      fix.componentInstance.max = 0;
      fix.detectChanges();

      const radius = 48;
      const circumference = 2 * Math.PI * radius;
      const indicator = getIndicator(fix);
      const actualOffset = parseFloat(indicator.getAttribute('stroke-dashoffset') ?? '0');
      expect(actualOffset).toBeCloseTo(circumference, 1);
    });
  });

  describe('Indeterminate mode', () => {
    it('sets stroke-dashoffset to 0', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'indeterminate';
      fix.detectChanges();

      const indicator = getIndicator(fix);
      expect(indicator.getAttribute('stroke-dashoffset')).toBe('0');
    });

    it('applies tng-spinner-indeterminate class to indicator', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'indeterminate';
      fix.detectChanges();

      const indicator = getIndicator(fix);
      expect(indicator.getAttribute('class') ?? '').toContain('tng-spinner-indeterminate');
    });

    it('does not apply tng-spinner-indeterminate in determinate mode', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'determinate';
      fix.detectChanges();

      const indicator = getIndicator(fix);
      expect(indicator.getAttribute('class') ?? '').not.toContain('tng-spinner-indeterminate');
    });
  });

  describe('ARIA', () => {
    it('sets aria-valuemin, aria-valuemax, aria-valuenow in determinate mode', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'determinate';
      fix.componentInstance.value = 25;
      fix.componentInstance.max = 100;
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.getAttribute('aria-valuemin')).toBe('0');
      expect(container.getAttribute('aria-valuemax')).toBe('100');
      expect(container.getAttribute('aria-valuenow')).toBe('25');
    });

    it('clears aria value attributes in indeterminate mode', async () => {
      const fix = await setup();
      fix.componentInstance.mode = 'indeterminate';
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.getAttribute('aria-valuemin')).toBeNull();
      expect(container.getAttribute('aria-valuemax')).toBeNull();
      expect(container.getAttribute('aria-valuenow')).toBeNull();
    });
  });

  describe('Base classes', () => {
    it('applies container base classes', async () => {
      const fix = await setup();
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.className).toContain('inline-flex');
    });

    it('applies svg base classes', async () => {
      const fix = await setup();
      fix.detectChanges();

      const svg = getSvg(fix);
      const classes = svg.getAttribute('class') ?? '';
      expect(classes).toContain('block');
      expect(classes).toContain('w-6');
      expect(classes).toContain('h-6');
    });

    it('applies track base classes', async () => {
      const fix = await setup();
      fix.detectChanges();

      const track = getTrack(fix);
      const classes = track.getAttribute('class') ?? '';
      expect(classes).toContain('opacity-30');
      expect(classes).toContain('text-border');
    });

    it('applies indicator base classes', async () => {
      const fix = await setup();
      fix.detectChanges();

      const indicator = getIndicator(fix);
      expect(indicator.getAttribute('class') ?? '').toContain('text-primary');
    });
  });

  describe('Slot hooks', () => {
    it('applies container slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { container: 'custom-container p-4' };
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.className).toContain('custom-container');
      expect(container.className).toContain('p-4');
      expect(container.className).toContain('inline-flex');
    });

    it('applies svg slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { svg: 'w-10 h-10' };
      fix.detectChanges();

      const svg = getSvg(fix);
      const classes = svg.getAttribute('class') ?? '';
      expect(classes).toContain('w-10');
      expect(classes).toContain('h-10');
      expect(classes).toContain('w-6');
    });

    it('applies track slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { track: 'opacity-20 text-fg/50' };
      fix.detectChanges();

      const track = getTrack(fix);
      const classes = track.getAttribute('class') ?? '';
      expect(classes).toContain('opacity-20');
      expect(classes).toContain('text-fg/50');
      expect(classes).toContain('opacity-30');
    });

    it('applies indicator slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { indicator: 'text-success' };
      fix.detectChanges();

      const indicator = getIndicator(fix);
      const classes = indicator.getAttribute('class') ?? '';
      expect(classes).toContain('text-success');
      expect(classes).toContain('text-primary');
    });

    it('handles empty slot object', async () => {
      const fix = await setup();
      fix.componentInstance.slot = {};
      fix.detectChanges();

      const container = getContainer(fix);
      const svg = getSvg(fix);
      expect(container.className).toContain('inline-flex');
      expect(svg.getAttribute('class') ?? '').toContain('w-6');
    });
  });

  describe('strokeWidth', () => {
    it('passes stroke-width to circles and affects radius', async () => {
      const fix = await setup();
      fix.componentInstance.strokeWidth = 8;
      fix.componentInstance.mode = 'determinate';
      fix.detectChanges();

      const track = getTrack(fix);
      const indicator = getIndicator(fix);
      expect(track.getAttribute('stroke-width')).toBe('8');
      expect(indicator.getAttribute('stroke-width')).toBe('8');
      expect(track.getAttribute('r')).toBe('46'); // 50 - 8/2
    });
  });
});
