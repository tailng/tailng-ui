/**
 * TailNG Tabs — styled component contract
 *
 * The default visual treatment is scoped to the <tng-tabs> wrapper. Headless
 * [tngTabs] compositions continue to expose the same primitive slots and
 * states without receiving component chrome.
 *
 * Styling relies on stable slot and state attributes rather than consumer
 * classes or assumptions about the projected element tags.
 */

export const tngTabsSlots = {
  root: 'tabs',
  shell: 'tabs-shell',
  strip: 'tabs-strip',
  list: 'tab-list',
  tab: 'tab',
  panel: 'tab-panel',
  scrollButtonPrev: 'tabs-scroll-button-prev',
  scrollButtonNext: 'tabs-scroll-button-next',
} as const;

export type TngTabsSlot = (typeof tngTabsSlots)[keyof typeof tngTabsSlots];

export const tngTabsHostStates = {
  orientation: 'data-orientation',
  activation: 'data-activation',
  disabled: 'data-disabled',
} as const;

export const tngTabsTabStates = {
  selected: 'data-selected',
  focused: 'data-focused',
  disabled: 'data-disabled',
} as const;

export const tngTabsPanelStates = {
  active: 'data-active',
} as const;

export const tngTabsCssVars = {
  // Layout
  radius: '--tng-tabs-radius',
  shellPadding: '--tng-tabs-shell-padding',
  gap: '--tng-tabs-gap',
  listGap: '--tng-tabs-list-gap',
  listPadding: '--tng-tabs-list-padding',
  listRadius: '--tng-tabs-list-radius',
  tabHeight: '--tng-tabs-tab-height',
  tabPaddingX: '--tng-tabs-tab-px',
  tabRadius: '--tng-tabs-tab-radius',
  panelPadding: '--tng-tabs-panel-padding',
  panelRadius: '--tng-tabs-panel-radius',
  verticalListWidth: '--tng-tabs-vertical-list-width',
  scrollButtonSize: '--tng-tabs-scroll-button-size',

  // Semantic aliases
  bg: '--tng-tabs-bg',
  surface: '--tng-tabs-surface',
  canvas: '--tng-tabs-canvas',
  fg: '--tng-tabs-fg',
  muted: '--tng-tabs-muted',
  border: '--tng-tabs-border',
  borderStrong: '--tng-tabs-border-strong',
  brand: '--tng-tabs-brand',
  focus: '--tng-tabs-focus',

  // State and effects
  tabHoverBg: '--tng-tabs-tab-hover-bg',
  tabSelectedBg: '--tng-tabs-tab-selected-bg',
  tabSelectedFg: '--tng-tabs-tab-selected-fg',
  tabSelectedBorder: '--tng-tabs-tab-selected-border',
  panelBg: '--tng-tabs-panel-bg',
  shadow: '--tng-tabs-shadow',
  selectedShadow: '--tng-tabs-selected-shadow',
  focusShadow: '--tng-tabs-focus-shadow',
  disabledOpacity: '--tng-tabs-disabled-opacity',
  duration: '--tng-tabs-duration',
  ease: '--tng-tabs-ease',
} as const;

export const tngTabsSemanticTokens = {
  bg: '--tng-semantic-background-base',
  surface: '--tng-semantic-background-surface',
  canvas: '--tng-semantic-background-canvas',
  fg: '--tng-semantic-foreground-primary',
  muted: '--tng-semantic-foreground-secondary',
  border: '--tng-semantic-border-subtle',
  borderStrong: '--tng-semantic-border-strong',
  brand: '--tng-semantic-accent-brand',
  focus: '--tng-semantic-focus-ring',
} as const;
