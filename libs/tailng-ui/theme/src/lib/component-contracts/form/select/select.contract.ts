// libs/tailng-ui/theme/src/lib/component-contracts/form/select/select.contract.ts

/**
 * TailNG Select — minimal style contract (Option B)
 *
 * Scope: component-layer <tng-select> that renders primitives with `data-slot`.
 * Styling must only rely on:
 *  - slot attributes:  data-slot="..."
 *  - state attributes: data-state / data-disabled / data-loading / data-invalid
 *  - option state attrs: data-active / data-selected / data-disabled
 *
 * No tag selectors. No DOM assumptions beyond slot names.
 */

export const tngSelectSlots = {
  root: 'select',
  trigger: 'select-trigger',
  value: 'select-value',
  icon: 'select-icon',
  content: 'select-content',
  overlay: 'select-overlay',
  listbox: 'select-listbox',
  option: 'select-option',
} as const;

export type TngSelectSlot = (typeof tngSelectSlots)[keyof typeof tngSelectSlots];

export const tngSelectHostStates = {
  state: 'data-state', // "open" | "closed"
  disabled: 'data-disabled', // presence
  loading: 'data-loading', // presence
  invalid: 'data-invalid', // presence
} as const;

export const tngSelectOptionStates = {
  active: 'data-active', // presence
  selected: 'data-selected', // presence
  disabled: 'data-disabled', // presence (option-level)
} as const;

/**
 * CSS custom properties the theme may define for Select.
 * (All optional; defaults exist in the CSS file.)
 */
export const tngSelectCssVars = {
  radius: '--tng-select-radius',
  triggerPaddingY: '--tng-select-trigger-py',
  triggerPaddingX: '--tng-select-trigger-px',
  optionPaddingY: '--tng-select-option-py',
  optionPaddingX: '--tng-select-option-px',
  triggerShadow: '--tng-select-shadow',
  shadow: '--tng-select-overlay-shadow',
  zOverlay: '--tng-select-z-overlay',
  overlayZIndex: '--tng-select-overlay-z-index',

  /**
   * Overlay min-width strategy:
   * - overlay should be at least trigger width
   * - but allow wider if content needs it
   *
   * The overlay primitive (or component wrapper) can set this var at runtime.
   * If unset, CSS falls back to `auto`.
   */
  triggerWidth: '--tng-select-trigger-width',
} as const;

/**
 * Semantic tokens referenced by the default theme CSS (recommended).
 * Keeping them listed here helps tooling/docs/presets.
 */
export const tngSelectSemanticTokens = {
  bg: '--tng-semantic-background-surface',
  surface: '--tng-semantic-background-surface',
  canvas: '--tng-semantic-background-canvas',

  fg: '--tng-semantic-foreground-primary',
  fgMuted: '--tng-semantic-foreground-secondary',

  border: '--tng-semantic-border-subtle',

  brand: '--tng-semantic-accent-brand',
  danger: '--tng-semantic-accent-danger',
} as const;
