// tab.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TngTab } from './tab.component';
import { TngTabPanel } from './tab-panel.component';
import { TngTabs } from './tabs.component';

const getTab = (fix: ComponentFixture<unknown>, value: string): HTMLElement =>
  fix.debugElement.query(By.css(`tng-tab[value="${value}"]`))?.nativeElement as HTMLElement;

@Component({
  standalone: true,
  imports: [TngTabs, TngTab, TngTabPanel],
  template: `
    <tng-tabs [defaultValue]="activeValue">
      <tng-tab value="a" [slot]="tabASlot">Tab A</tng-tab>
      <tng-tab value="b" [slot]="tabBSlot" [disabled]="tabBDisabled">Tab B</tng-tab>
      <tng-tab-panel value="a">Panel A</tng-tab-panel>
      <tng-tab-panel value="b">Panel B</tng-tab-panel>
    </tng-tabs>
  `,
})
class Host {
  activeValue = 'a';
  tabASlot: Record<string, string> = {};
  tabBSlot: Record<string, string> = {};
  tabBDisabled = false;
}

describe('TngTab', () => {
  afterEach(() => TestBed.resetTestingModule());

  const setup = async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fix = TestBed.createComponent(Host);
    return fix;
  };

  describe('Rendering', () => {
    it('renders with role tab', async () => {
      const fix = await setup();
      fix.detectChanges();
      const tab = getTab(fix, 'a');
      expect(tab).toBeTruthy();
      expect(tab.getAttribute('role')).toBe('tab');
    });

    it('marks active tab with aria-selected true', async () => {
      const fix = await setup();
      fix.detectChanges();
      const tabA = getTab(fix, 'a');
      const tabB = getTab(fix, 'b');
      expect(tabA?.getAttribute('aria-selected')).toBe('true');
      expect(tabB?.getAttribute('aria-selected')).toBe('false');
    });
  });

  describe('Base classes', () => {
    it('applies default tab classes', async () => {
      const fix = await setup();
      fix.detectChanges();
      const tab = getTab(fix, 'a');
      expect(tab?.className).toContain('px-3');
      expect(tab?.className).toContain('py-2');
      expect(tab?.className).toContain('text-sm');
      expect(tab?.className).toContain('border-primary');
    });

    it('applies active classes to active tab', async () => {
      const fix = await setup();
      fix.detectChanges();
      const tabA = getTab(fix, 'a');
      expect(tabA?.className).toContain('text-primary');
    });

    it('applies inactive classes to inactive tab', async () => {
      const fix = await setup();
      fix.detectChanges();
      const tabB = getTab(fix, 'b');
      expect(tabB?.className).toContain('text-muted-foreground');
    });

    it('applies disabled classes when disabled', async () => {
      const fix = await setup();
      fix.componentInstance.tabBDisabled = true;
      fix.detectChanges();
      const tabB = getTab(fix, 'b');
      expect(tabB?.className).toContain('opacity-50');
      expect(tabB?.className).toContain('cursor-not-allowed');
    });
  });

  describe('Slot hooks', () => {
    it('applies tab slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.tabASlot = { tab: 'font-bold' };
      fix.detectChanges();
      const tab = getTab(fix, 'a');
      expect(tab?.className).toContain('font-bold');
    });

    it('applies active slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.tabASlot = { active: 'underline' };
      fix.detectChanges();
      const tabA = getTab(fix, 'a');
      expect(tabA?.className).toContain('underline');
    });

    it('applies inactive slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.tabBSlot = { inactive: 'text-primary/50' };
      fix.detectChanges();
      const tabB = getTab(fix, 'b');
      expect(tabB?.className).toContain('text-primary');
    });

    it('applies disabled slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.tabBSlot = { disabled: 'line-through' };
      fix.componentInstance.tabBDisabled = true;
      fix.detectChanges();
      const tabB = getTab(fix, 'b');
      expect(tabB?.className).toContain('line-through');
    });

    it('handles empty slot object', async () => {
      const fix = await setup();
      fix.componentInstance.tabASlot = {};
      fix.detectChanges();
      const tab = getTab(fix, 'a');
      expect(tab?.className).toContain('px-3');
    });
  });
});
