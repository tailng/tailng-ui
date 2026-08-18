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

describe('tabs theme contract', () => {
  it('exports the stable component slots and state attributes', () => {
    expect(tngTabsSlots).toEqual({
      root: 'tabs',
      shell: 'tabs-shell',
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
    expect(tabsContractCss).toContain("[data-orientation='vertical']");
    expect(tabsContractCss).toContain("[data-slot='tab-panel'][hidden]");
    expect(tabsContractCss).toContain("[data-disabled='true']");
    expect(tabsContractCss).toContain('@media (prefers-reduced-motion: reduce)');
    expect(tabsContractCss).toContain('@media (forced-colors: active)');
  });

  it('is loaded through the public component contract stylesheet', () => {
    expect(componentContractsIndexCss).toMatch(
      /@import ['"]\.\/navigation\/tabs\/tabs\.css['"] layer\(tng\.contracts\);/,
    );
  });
});
