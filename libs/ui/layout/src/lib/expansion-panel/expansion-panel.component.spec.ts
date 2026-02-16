// expansion-panel.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TngExpansionPanel } from './expansion-panel.component';

const getContainer = (fix: ComponentFixture<unknown>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-expansion-panel > div')).nativeElement as HTMLDivElement;

const getHeaderButton = (fix: ComponentFixture<unknown>): HTMLButtonElement =>
  fix.debugElement.query(By.css('tng-expansion-panel button')).nativeElement as HTMLButtonElement;

const getTitleSpan = (fix: ComponentFixture<unknown>): HTMLSpanElement =>
  fix.debugElement.query(By.css('tng-expansion-panel button > span:first-child')).nativeElement as HTMLSpanElement;

const getContentBody = (fix: ComponentFixture<unknown>): HTMLDivElement | null =>
  fix.debugElement.query(By.css('tng-expansion-panel div[class*="text-sm"]'))?.nativeElement ?? null;

@Component({
  standalone: true,
  imports: [TngExpansionPanel],
  template: `
    <tng-expansion-panel
      [open]="open"
      [disabled]="disabled"
      [padded]="padded"
      [slot]="slot"
    >
      <div tngExpansionTitle>Panel Title</div>
      <div tngExpansionContent>Content here</div>
    </tng-expansion-panel>
  `,
})
class Host {
  open = false;
  disabled = false;
  padded = true;
  slot: Record<string, string> = {};
}

describe('TngExpansionPanel', () => {
  afterEach(() => TestBed.resetTestingModule());

  const setup = async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fix = TestBed.createComponent(Host);
    return fix;
  };

  describe('Rendering', () => {
    it('renders container element', async () => {
      const fix = await setup();
      fix.detectChanges();
      const container = getContainer(fix);
      expect(container).toBeTruthy();
      expect(container.className).toContain('rounded-lg');
    });

    it('renders header button with aria-expanded', async () => {
      const fix = await setup();
      fix.detectChanges();
      const btn = getHeaderButton(fix);
      expect(btn).toBeTruthy();
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });

    it('renders expanded when open is true', async () => {
      const fix = await setup();
      fix.componentInstance.open = true;
      fix.detectChanges();
      const btn = getHeaderButton(fix);
      expect(btn.getAttribute('aria-expanded')).toBe('true');
    });

    it('projects title and content', async () => {
      const fix = await setup();
      fix.detectChanges();
      const title = getTitleSpan(fix);
      expect(title?.textContent?.trim()).toContain('Panel Title');
      const body = getContentBody(fix);
      expect(body?.textContent?.trim()).toContain('Content here');
    });
  });

  describe('Base classes', () => {
    it('applies container base classes', async () => {
      const fix = await setup();
      fix.detectChanges();
      const container = getContainer(fix);
      expect(container.className).toContain('rounded-lg');
      expect(container.className).toContain('border');
      expect(container.className).toContain('bg-bg');
    });

    it('applies header base classes', async () => {
      const fix = await setup();
      fix.detectChanges();
      const btn = getHeaderButton(fix);
      expect(btn.className).toContain('flex');
      expect(btn.className).toContain('w-full');
      expect(btn.className).toContain('items-center');
    });
  });

  describe('Slot hooks', () => {
    it('applies container slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { container: 'max-w-md border-2 border-primary' };
      fix.detectChanges();
      const container = getContainer(fix);
      expect(container.className).toContain('max-w-md');
      expect(container.className).toContain('border-primary');
    });

    it('applies header slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { header: 'font-bold' };
      fix.detectChanges();
      const btn = getHeaderButton(fix);
      expect(btn.className).toContain('font-bold');
    });

    it('applies title slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { title: 'text-primary' };
      fix.detectChanges();
      const title = getTitleSpan(fix);
      expect(title?.className).toContain('text-primary');
    });

    it('applies contentBody slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.open = true;
      fix.componentInstance.slot = { contentBody: 'text-primary' };
      fix.detectChanges();
      const body = getContentBody(fix);
      expect(body?.className).toContain('text-primary');
    });

    it('handles empty slot object', async () => {
      const fix = await setup();
      fix.componentInstance.slot = {};
      fix.detectChanges();
      const container = getContainer(fix);
      expect(container.className).toContain('rounded-lg');
    });
  });

  describe('Interaction', () => {
    it('toggles open state on button click', async () => {
      const fix = await setup();
      fix.detectChanges();
      const btn = getHeaderButton(fix);
      expect(btn.getAttribute('aria-expanded')).toBe('false');
      btn.click();
      fix.detectChanges();
      expect(btn.getAttribute('aria-expanded')).toBe('true');
    });
  });
});
