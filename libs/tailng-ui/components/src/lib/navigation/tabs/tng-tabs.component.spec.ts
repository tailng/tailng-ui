import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TngTabsComponent } from './tng-tabs.component';

const tabsComponentCss = readFileSync(
  join(process.cwd(), 'libs/tailng-ui/components/src/lib/navigation/tabs/tng-tabs.component.css'),
  'utf8',
);

@Component({
  imports: [TngTabsComponent, TngTabList, TngTab, TngTabPanel],
  template: `
    <tng-tabs ariaLabel="Project tabs" data-testid="tabs">
      <div tngTabList data-testid="tab-list">
        <button type="button" tngTab value="overview">Overview</button>
        <button type="button" tngTab value="api">API</button>
      </div>
      <section tngTabPanel value="overview" data-testid="panel-overview">Overview panel</section>
      <section tngTabPanel value="api" data-testid="panel-api">API panel</section>
    </tng-tabs>
  `,
})
class HostComponent {}

describe('tng-tabs component', () => {
  it('attaches primitive tabs directive to host for projected tab directives', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const tabs = fixture.nativeElement.querySelector('[data-testid="tabs"]') as HTMLElement;
    const tabList = fixture.nativeElement.querySelector('[data-testid="tab-list"]') as HTMLElement;
    const panelOverview = fixture.nativeElement.querySelector(
      '[data-testid="panel-overview"]',
    ) as HTMLElement;
    const panelApi = fixture.nativeElement.querySelector(
      '[data-testid="panel-api"]',
    ) as HTMLElement;

    expect(tabs).toBeTruthy();
    expect(tabs.getAttribute('data-slot')).toBe('tabs');
    expect(tabs.getAttribute('aria-label')).toBe('Project tabs');
    expect(tabs.querySelector('.tng-tabs')?.getAttribute('data-slot')).toBe('tabs-shell');
    expect(tabList.getAttribute('role')).toBe('tablist');
    expect(panelOverview.hasAttribute('hidden')).toBe(false);
    expect(panelApi.hasAttribute('hidden')).toBe(true);
  });

  it('preserves host-scoped component token overrides', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const tabs = fixture.nativeElement.querySelector('[data-testid="tabs"]') as HTMLElement;
    tabs.style.setProperty('--tng-tabs-tab-height', '3rem');
    tabs.style.setProperty('--tng-tabs-brand', 'rebeccapurple');

    expect(tabs.style.getPropertyValue('--tng-tabs-tab-height')).toBe('3rem');
    expect(tabs.style.getPropertyValue('--tng-tabs-brand')).toBe('rebeccapurple');
  });

  it('keeps the wrapper shell unframed so the header and panel own their borders', () => {
    expect(tabsComponentCss).toContain('background: transparent');
    expect(tabsComponentCss).toContain('border: 0');
    expect(tabsComponentCss).toContain('box-shadow: none');
    expect(tabsComponentCss).toContain('overflow: visible');
  });
});
