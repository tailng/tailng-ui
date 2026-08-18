import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  tngTabsCssVars,
  tngTabsHostStates,
  tngTabsPanelStates,
  tngTabsSlots,
  tngTabsTabStates,
} from './tabs.contract';

const tabsContractCss = readFileSync(
  join(process.cwd(), 'libs/tailng-ui/theme/src/lib/component-contracts/navigation/tabs/tabs.css'),
  'utf8',
);

const componentContractsIndexCss = readFileSync(
  join(process.cwd(), 'libs/tailng-ui/theme/src/lib/component-contracts/index.css'),
  'utf8',
);

function ruleBodyAfter(selector: string): string {
  const selectorIndex = tabsContractCss.indexOf(selector);
  const openingBraceIndex = tabsContractCss.indexOf('{', selectorIndex);
  const closingBraceIndex = tabsContractCss.indexOf('}', openingBraceIndex);

  return tabsContractCss.slice(openingBraceIndex + 1, closingBraceIndex);
}

describe('tabs theme contract', () => {
  it('exports the stable component slots and state attributes', () => {
    expect(tngTabsSlots).toEqual({
      root: 'tabs',
      shell: 'tabs-shell',
      strip: 'tabs-strip',
      list: 'tab-list',
      tab: 'tab',
      panel: 'tab-panel',
      scrollButtonPrev: 'tabs-scroll-button-prev',
      scrollButtonNext: 'tabs-scroll-button-next',
    });
    expect(tngTabsHostStates).toEqual({
      orientation: 'data-orientation',
      activation: 'data-activation',
      disabled: 'data-disabled',
    });
    expect(tngTabsTabStates).toEqual({
      selected: 'data-selected',
      focused: 'data-focused',
      disabled: 'data-disabled',
    });
    expect(tngTabsPanelStates).toEqual({ active: 'data-active' });
  });

  it('defines every public component variable', () => {
    for (const cssVar of Object.values(tngTabsCssVars)) {
      expect(tabsContractCss).toContain(`${cssVar}:`);
    }
  });

  it('scopes the polished treatment to the wrapper and leaves headless roots neutral', () => {
    expect(tabsContractCss).toContain(":where(tng-tabs[data-slot='tabs'])");
    expect(tabsContractCss).not.toMatch(/:where\([^)]*\[tngTabs\]/);
    expect(tabsContractCss).toContain(":where([data-slot='tab'][data-selected='true'])");
    expect(tabsContractCss).toContain(":where([data-slot='tab']:focus-visible)");
    expect(tabsContractCss).toContain("[data-slot='tabs-scroll-button-prev']");
    expect(tabsContractCss).toContain("[data-slot='tabs-strip']");
    expect(tabsContractCss).toContain("[data-orientation='vertical']");
    expect(tabsContractCss).toContain("[data-slot='tab-panel'][hidden]");
    expect(tabsContractCss).toContain("[data-disabled='true']");
    expect(tabsContractCss).toContain('@media (prefers-reduced-motion: reduce)');
    expect(tabsContractCss).toContain('@media (forced-colors: active)');
  });

  it('uses an integrated header with a bordered panel body', () => {
    const stripRule = ruleBodyAfter(":where([data-slot='tabs-strip'])");
    const listRule = ruleBodyAfter(":where([data-slot='tab-list'])");
    const panelRule = ruleBodyAfter(":where([data-slot='tab-panel'])");
    const previousButtonRule = ruleBodyAfter("> :where([data-slot='tabs-scroll-button-prev'])");
    const nextButtonRule = ruleBodyAfter("> :where([data-slot='tabs-scroll-button-next'])");

    expect(stripRule).toContain('border-bottom: 1px solid');
    expect(stripRule).toContain('grid-template-columns: auto minmax(0, 1fr) auto');
    expect(listRule).toContain('border: 0');
    expect(listRule).toContain('border-bottom: 1px solid');
    expect(tabsContractCss).toContain('grid-column: 2');
    expect(previousButtonRule).toContain('grid-column: 1');
    expect(previousButtonRule).toContain('grid-row: 1');
    expect(nextButtonRule).toContain('grid-column: 3');
    expect(nextButtonRule).toContain('grid-row: 1');
    expect(panelRule).toContain('border: 1px solid var(--tng-tabs-tab-selected-border)');
    expect(panelRule).toContain('border-top: 0');
    expect(panelRule).toContain('box-shadow: none');
  });

  it('aligns contiguous tab headers with the panel edges', () => {
    const listRule = ruleBodyAfter(":where([data-slot='tab-list'])");
    const tabRule = ruleBodyAfter(":where([data-slot='tab'])");

    expect(tabsContractCss).toContain('--tng-tabs-list-gap: 0;');
    expect(tabsContractCss).toContain('--tng-tabs-list-padding: 0;');
    expect(listRule).toContain('gap: var(--tng-tabs-list-gap)');
    expect(listRule).toContain('padding: 0');
    expect(tabRule).toContain('border-radius: 0');
  });

  it('opens the selected tab border into the active panel surface', () => {
    const selectedTabRule = ruleBodyAfter(":where([data-slot='tab'][data-selected='true'])");

    expect(tabsContractCss).toContain('--tng-tabs-tab-selected-bg: var(--tng-tabs-panel-bg);');
    expect(selectedTabRule).toContain('border-bottom-color: var(--tng-tabs-panel-bg)');
    expect(selectedTabRule).toContain(
      'border-radius: var(--tng-tabs-tab-radius) var(--tng-tabs-tab-radius) 0 0',
    );
    expect(selectedTabRule).toContain('margin-bottom: -1px');
    expect(tabsContractCss).toContain('border-right-color: var(--tng-tabs-panel-bg)');
    expect(tabsContractCss).toContain('margin-right: -1px');
  });

  it('is loaded through the public component contract stylesheet', () => {
    expect(componentContractsIndexCss).toMatch(
      /@import ['"]\.\/navigation\/tabs\/tabs\.css['"] layer\(tng\.contracts\);/,
    );
  });
});
