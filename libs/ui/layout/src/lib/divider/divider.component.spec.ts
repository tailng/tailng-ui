// divider.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TngDivider } from './divider.component';

const getContainer = (fix: ComponentFixture<unknown>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-divider > div')).nativeElement as HTMLDivElement;

const getLineDivs = (fix: ComponentFixture<unknown>): HTMLDivElement[] =>
  fix.debugElement.queryAll(By.css('tng-divider > div > div')).map((de) => de.nativeElement);

const getLabelSpan = (fix: ComponentFixture<unknown>): HTMLSpanElement | null =>
  fix.debugElement.query(By.css('tng-divider span'))?.nativeElement ?? null;

@Component({
  standalone: true,
  imports: [TngDivider],
  template: `
    <tng-divider
      [orientation]="orientation"
      [label]="label"
      [align]="align"
      [dashed]="dashed"
      [slot]="slot"
    />
  `,
})
class Host {
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  label = '';
  align: 'start' | 'center' | 'end' = 'center';
  dashed = false;
  slot: Record<string, string> = {};
}

describe('TngDivider', () => {
  afterEach(() => TestBed.resetTestingModule());

  const setup = async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fix = TestBed.createComponent(Host);
    return fix;
  };

  describe('Rendering', () => {
    it('renders container with role separator', async () => {
      const fix = await setup();
      fix.detectChanges();
      const container = getContainer(fix);
      expect(container).toBeTruthy();
      expect(container.getAttribute('role')).toBe('separator');
      expect(container.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('renders vertical orientation', async () => {
      const fix = await setup();
      fix.componentInstance.orientation = 'vertical';
      fix.detectChanges(); // first CD with vertical
      expect(getContainer(fix).getAttribute('aria-orientation')).toBe('vertical');
      const lines = getLineDivs(fix);
      expect(lines.length).toBe(1);
    });

    it('renders horizontal without label (single line)', async () => {
      const fix = await setup();
      fix.componentInstance.label = '';
      fix.detectChanges(); // first CD with empty label
      const lines = getLineDivs(fix);
      expect(lines.length).toBe(1);
    });

    it('renders horizontal with label (two lines + span)', async () => {
      const fix = await setup();
      fix.componentInstance.label = 'OR';
      fix.detectChanges(); // first CD with label
      const span = getLabelSpan(fix);
      expect(span?.textContent?.trim()).toBe('OR');
      const lines = getLineDivs(fix);
      expect(lines.length).toBe(2);
    });
  });

  describe('Base classes', () => {
    it('applies horizontal container classes', async () => {
      const fix = await setup();
      fix.detectChanges();
      const container = getContainer(fix);
      expect(container.className).toContain('flex');
      expect(container.className).toContain('w-full');
      expect(container.className).toContain('items-center');
    });

    it('applies vertical container classes', async () => {
      const fix = await setup();
      fix.componentInstance.orientation = 'vertical';
      fix.detectChanges(); // first CD with vertical
      const container = getContainer(fix);
      expect(container.className).toContain('inline-flex');
      expect(container.className).toContain('shrink-0');
    });

    it('applies default line classes for horizontal', async () => {
      const fix = await setup();
      fix.detectChanges();
      const lines = getLineDivs(fix);
      expect(lines[0].className).toContain('border-t');
      expect(lines[0].className).toContain('border-solid');
    });

    it('applies dashed style when dashed is true', async () => {
      const fix = await setup();
      fix.componentInstance.dashed = true;
      fix.detectChanges(); // first CD with dashed
      const lines = getLineDivs(fix);
      expect(lines[0].className).toContain('border-dashed');
    });
  });

  describe('Slot hooks', () => {
    it('applies container slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { container: 'max-w-md custom' };
      fix.detectChanges(); // first CD with slot
      const container = getContainer(fix);
      expect(container.className).toContain('max-w-md');
      expect(container.className).toContain('custom');
    });

    it('applies line slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { line: 'border-primary' };
      fix.detectChanges(); // first CD with slot
      const lines = getLineDivs(fix);
      expect(lines[0].className).toContain('border-primary');
    });

    it('applies label slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.label = 'Test';
      fix.componentInstance.slot = { label: 'text-primary font-bold' };
      fix.detectChanges(); // first CD with label + slot
      const span = getLabelSpan(fix);
      expect(span?.className).toContain('text-primary');
      expect(span?.className).toContain('font-bold');
    });

    it('applies thickness slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { thickness: 'border-t-2' };
      fix.detectChanges(); // first CD with slot
      const lines = getLineDivs(fix);
      expect(lines[0].className).toContain('border-t-2');
    });

    it('handles empty slot object', async () => {
      const fix = await setup();
      fix.componentInstance.slot = {};
      fix.detectChanges(); // first CD with empty slot
      const container = getContainer(fix);
      expect(container.className).toContain('flex');
    });
  });
});
