// tabs.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TngTab } from './tab.component';
import { TngTabPanel } from './tab-panel.component';
import { TngTabs } from './tabs.component';

const getContainer = (fix: ComponentFixture<unknown>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-tabs > div')).nativeElement as HTMLDivElement;

const getTabList = (fix: ComponentFixture<unknown>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-tabs > div > div[role="tablist"]')).nativeElement as HTMLDivElement;

const getPanelContainer = (fix: ComponentFixture<unknown>): HTMLDivElement =>
  fix.debugElement.queryAll(By.css('tng-tabs > div > div'))[1]?.nativeElement as HTMLDivElement;

const getTabs = (fix: ComponentFixture<unknown>): HTMLElement[] =>
  fix.debugElement.queryAll(By.css('tng-tab')).map((de) => de.nativeElement);

@Component({
  standalone: true,
  imports: [TngTabs, TngTab, TngTabPanel],
  template: `
    <tng-tabs [defaultValue]="defaultValue" [slot]="slot">
      <tng-tab value="a">Tab A</tng-tab>
      <tng-tab value="b">Tab B</tng-tab>
      <tng-tab-panel value="a">Panel A</tng-tab-panel>
      <tng-tab-panel value="b">Panel B</tng-tab-panel>
    </tng-tabs>
  `,
})
class Host {
  defaultValue = 'a';
  slot: Record<string, string> = {};
}

describe('TngTabs', () => {
  afterEach(() => TestBed.resetTestingModule());

  const setup = async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fix = TestBed.createComponent(Host);
    return fix;
  };

  describe('Rendering', () => {
    it('renders container and tab list', async () => {
      const fix = await setup();
      fix.detectChanges();
      const container = getContainer(fix);
      const tabList = getTabList(fix);
      expect(container).toBeTruthy();
      expect(tabList).toBeTruthy();
      expect(tabList.getAttribute('role')).toBe('tablist');
    });

    it('projects tabs and panels', async () => {
      const fix = await setup();
      fix.detectChanges();
      const tabs = getTabs(fix);
      expect(tabs.length).toBe(2);
    });

    it('sets default active tab via defaultValue', async () => {
      const fix = await setup();
      fix.detectChanges();
      const tabA = fix.debugElement.query(By.css('tng-tab[value="a"]')).nativeElement as HTMLElement;
      expect(tabA.getAttribute('aria-selected')).toBe('true');
    });
  });

  describe('Base classes', () => {
    it('applies container base classes', async () => {
      const fix = await setup();
      fix.detectChanges();
      const container = getContainer(fix);
      expect(container.className).toContain('w-full');
    });

    it('applies tab list base classes', async () => {
      const fix = await setup();
      fix.detectChanges();
      const tabList = getTabList(fix);
      expect(tabList.className).toContain('flex');
      expect(tabList.className).toContain('border-b');
    });

    it('applies panel container base classes', async () => {
      const fix = await setup();
      fix.detectChanges();
      const panelContainer = getPanelContainer(fix);
      expect(panelContainer.className).toContain('pt-4');
    });
  });

  describe('Slot hooks', () => {
    it('applies container slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { container: 'max-w-lg' };
      fix.detectChanges();
      const container = getContainer(fix);
      expect(container.className).toContain('max-w-lg');
    });

    it('applies tabList slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { tabList: 'flex gap-6' };
      fix.detectChanges();
      const tabList = getTabList(fix);
      expect(tabList.className).toContain('gap-6');
    });

    it('applies panelContainer slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { panelContainer: 'pt-8' };
      fix.detectChanges();
      const panelContainer = getPanelContainer(fix);
      expect(panelContainer.className).toContain('pt-8');
    });

    it('handles empty slot object', async () => {
      const fix = await setup();
      fix.componentInstance.slot = {};
      fix.detectChanges();
      const container = getContainer(fix);
      expect(container.className).toContain('w-full');
    });
  });

  describe('Interaction', () => {
    it('switches active tab on click', async () => {
      const fix = await setup();
      fix.detectChanges();
      const tabB = fix.debugElement.query(By.css('tng-tab[value="b"]')).nativeElement as HTMLElement;
      expect(tabB.getAttribute('aria-selected')).toBe('false');
      tabB.click();
      fix.detectChanges();
      expect(tabB.getAttribute('aria-selected')).toBe('true');
    });
  });
});
