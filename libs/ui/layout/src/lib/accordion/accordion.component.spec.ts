// accordion.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TngAccordion } from './accordion.component';
import { TngExpansionPanel } from '../expansion-panel/expansion-panel.component';

const getContainer = (fix: ComponentFixture<unknown>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-accordion > div')).nativeElement as HTMLDivElement;

const getStack = (fix: ComponentFixture<unknown>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-accordion > div > div')).nativeElement as HTMLDivElement;

const getPanels = (fix: ComponentFixture<unknown>): HTMLElement[] =>
  fix.debugElement.queryAll(By.css('tng-expansion-panel')).map((de) => de.nativeElement);

@Component({
  standalone: true,
  imports: [TngAccordion, TngExpansionPanel],
  template: `
    <tng-accordion [slot]="slot">
      <tng-expansion-panel>
        <div tngExpansionTitle>Panel A</div>
        <div tngExpansionContent>Content A</div>
      </tng-expansion-panel>
      <tng-expansion-panel>
        <div tngExpansionTitle>Panel B</div>
        <div tngExpansionContent>Content B</div>
      </tng-expansion-panel>
    </tng-accordion>
  `,
})
class Host {
  slot: Record<string, string> = {};
}

describe('TngAccordion', () => {
  afterEach(() => TestBed.resetTestingModule());

  const setup = async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fix = TestBed.createComponent(Host);
    return fix;
  };

  describe('Rendering', () => {
    it('renders container and stack', async () => {
      const fix = await setup();
      fix.detectChanges();
      const container = getContainer(fix);
      const stack = getStack(fix);
      expect(container).toBeTruthy();
      expect(stack).toBeTruthy();
    });

    it('projects expansion panels', async () => {
      const fix = await setup();
      fix.detectChanges();
      const panels = getPanels(fix);
      expect(panels.length).toBe(2);
    });
  });

  describe('Base classes', () => {
    it('applies container base classes', async () => {
      const fix = await setup();
      fix.detectChanges();
      const container = getContainer(fix);
      expect(container.className).toContain('w-full');
    });

    it('applies stack base classes', async () => {
      const fix = await setup();
      fix.detectChanges();
      const stack = getStack(fix);
      expect(stack.className).toContain('space-y-2');
    });
  });

  describe('Slot hooks', () => {
    it('applies container slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { container: 'max-w-lg py-4' };
      fix.detectChanges();
      const container = getContainer(fix);
      expect(container.className).toContain('max-w-lg');
      expect(container.className).toContain('py-4');
    });

    it('applies stack slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { stack: 'space-y-6' };
      fix.detectChanges();
      const stack = getStack(fix);
      expect(stack.className).toContain('space-y-6');
    });

    it('handles empty slot object', async () => {
      const fix = await setup();
      fix.componentInstance.slot = {};
      fix.detectChanges();
      const container = getContainer(fix);
      expect(container.className).toContain('w-full');
    });
  });
});
