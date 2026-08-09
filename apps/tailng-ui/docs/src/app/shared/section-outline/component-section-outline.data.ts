import type { DocsSectionRailItem } from '../section-rail/docs-section-rail.component';

export type DocsComponentTopLevelSectionId =
  | 'overview'
  | 'api'
  | 'styling'
  | 'examples'
  | 'ownable-install';

export const docsComponentOutlineItemsBySlug: Readonly<
  Record<string, Partial<Record<DocsComponentTopLevelSectionId, readonly DocsSectionRailItem[]>>>
> = {
  accordion: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'faq-variants', label: 'FAQ variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'primitive-composition', label: 'Primitive composition' },
      { id: 'wrapper-composition', label: 'Wrapper composition' },
      { id: 'outputs', label: 'Outputs' },
    ],
    styling: [
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'css-starter', label: 'CSS starter' },
    ],
    examples: [
      { id: 'single-mode-faq', label: 'Single-mode FAQ' },
      { id: 'multiple-mode-settings', label: 'Multiple mode settings' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  autocomplete: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'basic-usage', label: 'Basic usage' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'tng-autocomplete', label: 'tng-autocomplete' },
      { id: 'option-accessors', label: 'Option accessors' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'css-token-contracts', label: 'CSS token contracts' },
      { id: 'portal-overlay-guidance', label: 'Portal overlay guidance' },
      { id: 'user-scenario-style-examples', label: 'User scenario style examples' },
    ],
    examples: [
      { id: 'country-directory', label: 'Country directory' },
      { id: 'release-owner-handoff', label: 'Release owner handoff' },
    ],
  },
  avatar: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'wrapper-component', label: 'Wrapper component' },
      { id: 'wrapper-inputs', label: 'Wrapper inputs' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'wrapper-state-hooks', label: 'Wrapper state hooks' },
      { id: 'wrapper-shell', label: 'Wrapper shell' },
      { id: 'owner-guidance', label: 'Owner guidance' },
    ],
    examples: [
      { id: 'team-roster', label: 'Team roster' },
      { id: 'presence-strip', label: 'Presence strip' },
    ],
  },
  badge: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'component-package-export', label: 'Component package export' },
      { id: 'directive-inputs', label: 'Directive inputs' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'stable-hooks', label: 'Stable hooks' },
      { id: 'generated-node', label: 'Generated node' },
      { id: 'owner-guidance', label: 'Owner guidance' },
    ],
    examples: [
      { id: 'notification-counts', label: 'Notification counts' },
      { id: 'placement-and-host-sizing', label: 'Placement and host sizing' },
    ],
  },
  breadcrumb: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'keyboard-and-accessibility-baseline', label: 'Keyboard and accessibility baseline' },
    ],
    api: [
      { id: 'wrapper-apis', label: 'Wrapper APIs' },
      { id: 'primitive-directives', label: 'Primitive directives' },
      { id: 'data-attributes-from-wrapper-items', label: 'Data attributes from wrapper items' },
    ],
    styling: [
      { id: 'primitive-slot-selectors', label: 'Primitive slot selectors' },
      { id: 'wrapper-state-hooks', label: 'Wrapper state hooks' },
      { id: 'practical-guidance', label: 'Practical guidance' },
    ],
    examples: [
      { id: 'collapsed-long-path', label: 'Collapsed long path' },
      { id: 'current-link-and-disabled-segments', label: 'Current-link and disabled segments' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  button: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'wrapper-component', label: 'Wrapper component' },
      { id: 'aria-and-state-inputs', label: 'ARIA and state inputs' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'wrapper-state-hooks', label: 'Wrapper state hooks' },
      { id: 'wrapper-shell', label: 'Wrapper shell' },
      { id: 'owner-guidance', label: 'Owner guidance' },
    ],
    examples: [
      { id: 'action-row', label: 'Action row' },
      { id: 'menu-trigger', label: 'Menu trigger' },
    ],
  },
  'button-toggle': {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'primitive-contract', label: 'Primitive contract' },
      { id: 'component-group-api', label: 'tng-button-toggle-group' },
      { id: 'component-item-api', label: 'tng-button-toggle' },
    ],
    styling: [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'user-scenario-style-examples', label: 'User scenario style examples' },
    ],
    examples: [
      { id: 'single-select-alignment-controls', label: 'Single-select alignment controls' },
      { id: 'multiple-select-text-style-toolbar', label: 'Multiple-select text-style toolbar' },
    ],
  },
  card: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'release-status', label: 'Release status' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      {
        id: 'tngcard-and-slot-directives-primitives',
        label: 'tngCard and slot directives (primitives)',
      },
      { id: 'tng-card-wrappers-components', label: 'tng-card wrappers (components)' },
    ],
    styling: [
      { id: 'state-and-slot-hooks', label: 'State and slot hooks' },
      { id: 'css-starter', label: 'CSS starter' },
    ],
    examples: [
      { id: 'ava-mathews', label: 'Ava Mathews' },
      { id: 'billing-reminder', label: 'Billing reminder' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'flow-editor': {
    overview: [
      { id: 'imports', label: 'Install and import' },
      { id: 'controlled-workflow', label: 'Controlled workflow' },
      { id: 'state-ownership', label: 'State ownership' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'editor-inputs', label: 'Editor inputs' },
      { id: 'editor-outputs', label: 'Editor outputs' },
      { id: 'graph-models', label: 'Graph models' },
      { id: 'template-context', label: 'Node template context' },
      { id: 'imperative-methods', label: 'Imperative methods' },
      { id: 'validation', label: 'Validation' },
    ],
    styling: [
      { id: 'required-styles', label: 'Required styles' },
      { id: 'host-sizing', label: 'Host sizing' },
      { id: 'css-custom-properties', label: 'CSS custom properties' },
      { id: 'custom-node-content', label: 'Custom node content' },
    ],
    examples: [
      { id: 'professional-flow-builder', label: 'Professional flow creator' },
      { id: 'document-review-workflow', label: 'Document review workflow' },
      { id: 'timed-execution-workflow', label: 'Timed workflow simulation' },
      { id: 'branch-and-merge-workflow', label: 'Branch and merge workflow' },
      { id: 'connection-editing', label: 'Create, validate, and reconnect' },
      { id: 'selection-deletion-and-modes', label: 'Selection, deletion, and modes' },
      { id: 'controlled-node-positions', label: 'Controlled node positions' },
      { id: 'custom-model-node', label: 'Custom model node' },
      { id: 'execution-monitor', label: 'Execution monitor' },
    ],
  },
  table: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'release-status', label: 'Release status' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'component-wrapper', label: 'Component wrapper' },
      { id: 'inputs', label: 'Inputs' },
      { id: 'class-hooks', label: 'Styling hooks' },
      { id: 'outputs-and-templates', label: 'Outputs and templates' },
    ],
    styling: [
      { id: 'state-and-slot-hooks', label: 'State and slot hooks' },
      { id: 'row-and-cell-classes', label: 'Row and cell styling' },
      { id: 'css-starter', label: 'CSS starter' },
    ],
    examples: [
      { id: 'sortable-account-table', label: 'Sortable account table' },
      { id: 'custom-cell-template', label: 'Custom cell template' },
      { id: 'conditional-row-and-cell-classes', label: 'Conditional row and cell styling' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  checkbox: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'tngcheckbox-directive', label: 'tngCheckbox (directive)' },
      { id: 'tng-checkbox-styled-component', label: 'tng-checkbox (styled component)' },
    ],
    styling: [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'user-scenario-style-examples', label: 'User scenario style examples' },
    ],
    examples: [
      { id: 'consent-and-readonly-policy', label: 'Consent and readonly policy' },
      { id: 'tri-state-select-all', label: 'Tri-state select-all' },
      { id: 'validation-emphasis', label: 'Validation emphasis' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  chips: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'basic-usage', label: 'Basic usage' },
      { id: 'chip-variants', label: 'Chip variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    api: [
      { id: 'wrapper-api', label: '`<tng-chips>`' },
      { id: 'projected-chip', label: 'Projected chip parts' },
      { id: 'remove-control', label: 'Remove control' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'supported-contract', label: 'Supported contract' },
      { id: 'host-tokens', label: 'Host tokens' },
      { id: 'styling-variants', label: 'Styling variants' },
    ],
    examples: [
      { id: 'removable-filter-chips', label: 'Removable filter chips' },
      { id: 'locked-release-chips', label: 'Locked release lanes' },
    ],
  },
  codeblock: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'wrapper-component', label: 'Wrapper component' },
      { id: 'rendering-and-copy-inputs', label: 'Rendering and copy inputs' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'wrapper-slot-hooks', label: 'Wrapper slot hooks' },
      { id: 'wrapper-state-attributes', label: 'Wrapper state attributes' },
      { id: 'owner-guidance', label: 'Owner guidance' },
    ],
    examples: [
      { id: 'compact-snippet', label: 'Compact snippet' },
      { id: 'focused-review', label: 'Focused review' },
    ],
  },
  collapsible: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'progress-indicator-variants', label: 'Progress indicator variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'tngcollapsible-directive', label: 'tngCollapsible (directive)' },
      { id: 'tng-collapsible-component', label: 'tng-collapsible (component)' },
    ],
    styling: [
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'css-starter', label: 'CSS starter' },
    ],
    examples: [
      { id: 'checkout-progression-variants', label: 'Checkout progression variants' },
      { id: 'error-surface-variants', label: 'Error surface variants' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'context-menu': {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'keyboard-baseline', label: 'Keyboard baseline' },
    ],
    api: [
      { id: 'wrapper-apis', label: 'Wrapper APIs' },
      { id: 'primitive-directives', label: 'Primitive directives' },
      { id: 'keyboard-contract-high-level', label: 'Keyboard contract (high level)' },
    ],
    styling: [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'example-style-contract', label: 'Example style contract' },
    ],
    examples: [{ id: 'operational-context-actions', label: 'Operational context actions' }],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  copybutton: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'wrapper-component', label: 'Wrapper component' },
      { id: 'content-and-feedback-inputs', label: 'Content and feedback inputs' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'wrapper-slot-hooks', label: 'Wrapper slot hooks' },
      { id: 'wrapper-state-attributes', label: 'Wrapper state attributes' },
      { id: 'owner-guidance', label: 'Owner guidance' },
    ],
    examples: [
      { id: 'install-command', label: 'Install command' },
      { id: 'copy-from-target', label: 'Copy from target' },
    ],
  },
  datepicker: {
    overview: [
      { id: 'simple-sample', label: 'Simple sample' },
      { id: 'imports', label: 'Imports' },
      { id: 'quick-start', label: 'Quick start' },
      { id: 'headless-orchestration', label: 'Headless orchestration' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    api: [
      { id: 'tng-datepicker-component', label: 'tng-datepicker (component)' },
      {
        id: 'createdatepickercontroller-headless',
        label: 'createDatepickerController(...) (headless)',
      },
    ],
    styling: [
      { id: 'slot-selectors', label: 'Slot selectors' },
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'common-custom-properties', label: 'Common custom properties' },
      { id: 'compact-override-example', label: 'Compact override example' },
    ],
    examples: [
      { id: 'default-wrapper', label: 'Default wrapper' },
      { id: 'custom-format', label: 'Custom format' },
      { id: 'bounded-range', label: 'Bounded range' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'date-range-picker': {
    overview: [
      { id: 'simple-sample', label: 'Simple sample' },
      { id: 'imports', label: 'Imports' },
      { id: 'quick-start', label: 'Quick start' },
      { id: 'headless-orchestration', label: 'Headless orchestration' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    api: [
      { id: 'tng-date-range-picker-component', label: 'tng-date-range-picker (component)' },
      { id: 'outputs', label: 'Outputs' },
      { id: 'wrapper-instance-methods', label: 'Wrapper instance methods' },
      { id: 'headless-binding-layer', label: 'Headless binding layer' },
      { id: 'advanced-controller-options', label: 'Advanced controller options' },
      { id: 'controller-methods', label: 'Controller methods' },
    ],
    styling: [
      { id: 'slot-selectors', label: 'Slot selectors' },
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'common-custom-properties', label: 'Common custom properties' },
      { id: 'theme-aware-wrapper-shell', label: 'Theme-aware wrapper shell' },
      { id: 'compact-override-example', label: 'Compact override example' },
    ],
    examples: [
      { id: 'form-usage', label: 'Form usage' },
      { id: 'default-wrapper', label: 'Default wrapper' },
      { id: 'custom-format', label: 'Custom format' },
      { id: 'bounded-range', label: 'Bounded range' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  dialog: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'ship-this-release', label: 'Ship this release?' },
      { id: 'keyboard-baseline', label: 'Keyboard baseline' },
    ],
    api: [
      { id: 'wrapper-apis', label: 'Wrapper APIs' },
      { id: 'primitive-directives', label: 'Primitive directives' },
      { id: 'keyboard-contract-high-level', label: 'Keyboard contract (high level)' },
    ],
    styling: [
      { id: 'core-data-attributes', label: 'Core data attributes' },
      { id: 'reference-css', label: 'Reference CSS' },
    ],
    examples: [{ id: 'delete-release-branch', label: 'Delete release branch?' }],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  drawer: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'drawer-variants', label: 'Drawer variants' },
      { id: 'keyboard-interaction', label: 'Keyboard interaction' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [],
    styling: [
      { id: 'primitive-data-hooks', label: 'Primitive data hooks' },
      { id: 'component-css-classes', label: 'Component CSS classes' },
      { id: 'starter-css', label: 'Starter CSS' },
    ],
    examples: [
      { id: 'side-navigation', label: 'Side navigation' },
      { id: 'end-details-panel', label: 'End details panel' },
      { id: 'push-mode', label: 'Push mode' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  empty: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'wrapper-root', label: 'Wrapper root' },
      { id: 'wrapper-parts', label: 'Wrapper parts' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'wrapper-slot-hooks', label: 'Wrapper slot hooks' },
      { id: 'default-shell', label: 'Default shell' },
      { id: 'owner-guidance', label: 'Owner guidance' },
    ],
    examples: [
      { id: 'no-results-state', label: 'No-results state' },
      { id: 'onboarding-state', label: 'Onboarding state' },
    ],
  },
  input: {
    overview: [
      { id: 'what-you-get', label: 'What you get' },
      { id: 'simple-examples', label: 'Simple examples' },
      { id: 'installation', label: 'Installation' },
      { id: 'basic-usage', label: 'Basic usage' },
      { id: 'structure', label: 'Structure' },
      { id: 'accessibility-guidance', label: 'Accessibility guidance' },
      { id: 'validation-patterns', label: 'Validation patterns' },
      { id: 'examples', label: 'Examples' },
      { id: 'common-pitfalls', label: 'Common pitfalls' },
      { id: 'testing-notes', label: 'Testing notes' },
    ],
    api: [
      { id: 'tng-input-component', label: '&lt;tng-input&gt;' },
      { id: 'tng-input-field', label: '&lt;tng-input-field&gt;' },
      { id: 'tng-input-directive', label: 'tngInput (directive)' },
      { id: 'slot-directives', label: 'Slot directives' },
    ],
    styling: [
      { id: 'css-contracts', label: 'CSS contracts' },
      { id: 'shell-state-hooks', label: 'Shell state hooks' },
      { id: 'theme-contract-tokens', label: 'Theme contract tokens' },
      { id: 'user-scenario-style-examples', label: 'User scenario style examples' },
      { id: 'different-styling-pattern-examples', label: 'Different styling pattern examples' },
    ],
    examples: [
      { id: 'basic-text-field', label: 'Basic text field' },
      { id: 'type-variants', label: 'Type variants' },
      { id: 'validation-feedback', label: 'Validation feedback' },
      { id: 'readonly-and-disabled-states', label: 'Readonly and disabled states' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'input-field': {
    overview: [
      { id: 'what-input-field-does', label: 'What input field does' },
      { id: 'simple-examples', label: 'Simple examples' },
      { id: 'installation', label: 'Installation' },
      { id: 'basic-composition', label: 'Basic composition' },
      { id: 'relationship-to-input-component', label: 'Relationship to input component' },
      { id: 'accessibility-guidance', label: 'Accessibility guidance' },
    ],
    api: [
      { id: 'tng-input-field-component', label: '&lt;tng-input-field&gt;' },
      { id: 'projected-control-contract', label: 'Projected control contract' },
      { id: 'slot-directives', label: 'Slot directives' },
    ],
    styling: [
      { id: 'css-contracts', label: 'Supported contract' },
      { id: 'shell-state-hooks', label: 'Shell state ownership' },
      { id: 'user-scenario-style-examples', label: 'Workspace slug shell' },
      { id: 'different-styling-pattern-examples', label: 'Projected content classes' },
    ],
    examples: [
      { id: 'global-search-field', label: 'Global search field' },
      { id: 'workspace-slug-field', label: 'Workspace slug field' },
      { id: 'clear-action-field', label: 'Clear action field' },
    ],
  },
  'form-field': {
    overview: [
      { id: 'what-form-field-does', label: 'What form field does' },
      { id: 'basic-field', label: 'Basic field' },
      { id: 'input-group-field', label: 'With input group' },
    ],
    api: [
      { id: 'imports', label: 'Imports' },
      { id: 'tng-form-field-component', label: '<tng-form-field>' },
      { id: 'messages', label: 'Messages' },
      { id: 'adornments', label: 'Adornments' },
      { id: 'supported-controls', label: 'Supported controls' },
      { id: 'custom-control-contract', label: 'Custom control contract' },
    ],
    styling: [
      { id: 'slot-classes', label: 'Slot classes' },
      { id: 'css-variables', label: 'CSS variables' },
    ],
    examples: [
      { id: 'form-usage', label: 'Form usage' },
      { id: 'basic-field', label: 'Basic field' },
      { id: 'supported-controls', label: 'Supported controls' },
      { id: 'supported-control-label-positions', label: 'Supported control label positions' },
      { id: 'left-label-field', label: 'Left label' },
      { id: 'error-field', label: 'Error state with input group' },
      { id: 'inline-controls', label: 'Inline controls' },
      { id: 'composite-controls', label: 'Composite controls' },
    ],
  },
  'input-otp': {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-baseline', label: 'Usage baseline' },
      { id: 'input-otp-variants', label: 'Input OTP variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    api: [
      { id: 'wrapper-api', label: '&lt;tng-input-otp&gt; wrapper' },
      { id: 'event-contract', label: 'Event contract' },
      { id: 'forms-integration', label: 'Forms integration' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'theming-surface', label: 'Theming surface' },
      { id: 'styling-variants', label: 'Styling variants' },
      { id: 'guidance', label: 'Guidance' },
    ],
    examples: [
      { id: 'verification-passcode', label: 'Verification passcode' },
      { id: 'masked-recovery-code', label: 'Masked recovery code' },
    ],
  },
  label: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'label-variants', label: 'Label variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'primitive-label-tnglabel', label: 'Primitive: label[tngLabel]' },
      { id: 'component-and-lt-tng-label-and-gt', label: 'Component: &lt;tng-label&gt;' },
      { id: 'state-attributes', label: 'State attributes' },
    ],
    styling: [
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'suggested-css-baseline', label: 'Suggested CSS baseline' },
    ],
    examples: [{ id: 'association-patterns', label: 'Association patterns' }],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  listbox: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-baseline', label: 'Usage baseline' },
      { id: 'listbox-variants', label: 'Listbox variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    api: [
      { id: 'tnglistbox-tngoption', label: 'tngListbox + tngOption' },
      { id: 'wrapper-status', label: 'Wrapper status' },
    ],
    styling: [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'example-style-contract', label: 'Example style contract' },
    ],
    examples: [
      { id: 'priority-list-variants', label: 'Priority list variants' },
      { id: 'dual-listbox-keyboard-handoff', label: 'Dual listbox keyboard handoff' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  menu: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'keyboard-baseline', label: 'Keyboard baseline' },
    ],
    api: [
      { id: 'wrapper-apis', label: 'Wrapper APIs' },
      { id: 'primitive-directives', label: 'Primitive directives' },
      { id: 'keyboard-contract-high-level', label: 'Keyboard contract (high level)' },
    ],
    styling: [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'example-style-contract', label: 'Example style contract' },
    ],
    examples: [
      { id: 'action-menu-variants', label: 'Action menu variants' },
      { id: 'cascaded-submenu-example', label: 'Cascaded submenu example' },
    ],
  },
  menubar: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'keyboard-baseline', label: 'Keyboard baseline' },
    ],
    api: [
      { id: 'wrapper-apis', label: 'Wrapper APIs' },
      { id: 'primitive-directives', label: 'Primitive directives' },
      { id: 'keyboard-contract-high-level', label: 'Keyboard contract (high level)' },
    ],
    styling: [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'example-style-contract', label: 'Example style contract' },
    ],
    examples: [
      { id: 'workspace-command-bar', label: 'Workspace command bar' },
      { id: 'cascaded-submenu-chain', label: 'Cascaded submenu chain' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'multi-autocomplete': {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'basic-usage', label: 'Basic usage' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    api: [
      { id: 'wrapper-apis', label: 'Wrapper APIs' },
      { id: 'option-accessors', label: 'Option accessors' },
      { id: 'template-hooks', label: 'Template hooks' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'supported-contract', label: 'Supported contract' },
      { id: 'host-tokens', label: 'Host tokens' },
      { id: 'wrapper-style-variants', label: 'Wrapper style variants' },
    ],
    examples: [
      { id: 'launch-market-picker', label: 'Launch market picker' },
      { id: 'release-owner-roster', label: 'Release owner roster' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  multiselect: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'basic-usage', label: 'Basic usage' },
      { id: 'multiselect-variants', label: 'MultiSelect variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    api: [
      { id: 'tngmultiselect-parts-primitive', label: 'tngMultiSelect + parts (primitive)' },
      { id: 'tng-multiselect-styled-component', label: 'tng-multiselect (styled component)' },
    ],
    styling: [
      { id: 'supported-contract', label: 'Supported contract' },
      { id: 'host-tokens', label: 'Host tokens' },
      { id: 'wrapper-style-variants', label: 'Category picker shell' },
    ],
    examples: [
      { id: 'status-multiselect-variants', label: 'Status multiselect variants' },
      { id: 'dual-multiselect-keyboard-handoff', label: 'Dual multiselect keyboard handoff' },
    ],
  },
  pagination: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'basic-usage', label: 'Basic usage' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'component-wrapper', label: 'Component wrapper' },
      { id: 'inputs', label: 'Inputs' },
      { id: 'outputs', label: 'Outputs' },
    ],
    styling: [
      { id: 'state-and-slot-hooks', label: 'State and slot hooks' },
      { id: 'css-starter', label: 'CSS starter' },
    ],
    examples: [
      { id: 'compact-toolbar', label: 'Compact toolbar' },
      { id: 'server-pagination', label: 'Server pagination' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  popover: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'keyboard-baseline', label: 'Keyboard baseline' },
    ],
    api: [
      {
        id: 'wrapper-component-and-lt-tng-popover-and-gt',
        label: 'Wrapper component: &lt;tng-popover&gt;',
      },
      { id: 'primitive-directives', label: 'Primitive directives' },
      { id: 'keyboard-contract-high-level', label: 'Keyboard contract (high level)' },
    ],
    styling: [
      { id: 'core-data-attributes', label: 'Core data attributes' },
      { id: 'reference-css', label: 'Reference CSS' },
    ],
    examples: [{ id: 'delete-release-branch', label: 'Delete release branch?' }],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'progress-bar': {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'wrapper-component', label: 'Wrapper component' },
      { id: 'range-inputs', label: 'Range inputs' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'wrapper-slot-hooks', label: 'Wrapper slot hooks' },
      { id: 'default-shell', label: 'Default shell' },
      { id: 'owner-guidance', label: 'Owner guidance' },
    ],
    examples: [
      { id: 'determinate-metrics', label: 'Determinate metrics' },
      { id: 'indeterminate-handoff', label: 'Indeterminate handoff' },
    ],
  },
  'progress-spinner': {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'wrapper-component', label: 'Wrapper component' },
      { id: 'size-and-range-inputs', label: 'Size and range inputs' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'wrapper-slot-hooks', label: 'Wrapper slot hooks' },
      { id: 'default-shell', label: 'Default shell' },
      { id: 'owner-guidance', label: 'Owner guidance' },
    ],
    examples: [
      { id: 'determinate-metrics', label: 'Determinate metrics' },
      { id: 'indeterminate-handoff', label: 'Indeterminate handoff' },
    ],
  },
  confetti: {
    overview: [
      { id: 'imports', label: 'Import' },
      { id: 'controlled-celebration', label: 'Controlled celebration' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'component', label: 'Component' },
      { id: 'inputs', label: 'Inputs' },
      { id: 'output', label: 'Output' },
    ],
    styling: [
      { id: 'css-variables', label: 'CSS variables' },
      { id: 'container-overlay', label: 'Container overlay' },
      { id: 'performance', label: 'Performance' },
    ],
    examples: [
      { id: 'success-actions', label: 'Success actions' },
      { id: 'contained-burst', label: 'Contained burst' },
      { id: 'controlled-reset', label: 'Controlled reset' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import and usage' },
    ],
  },
  radio: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'tngradio-directive', label: 'tngRadio (directive)' },
      { id: 'tng-radio-styled-component', label: 'tng-radio (styled component)' },
    ],
    styling: [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'user-scenario-style-examples', label: 'User scenario style examples' },
    ],
    examples: [
      { id: 'billing-plan-selection', label: 'Billing plan selection' },
      { id: 'readonly-and-invalid-review', label: 'Readonly and invalid review' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  select: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'basic-usage', label: 'Basic usage' },
      { id: 'select-variants', label: 'Select variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    api: [
      { id: 'wrapper-api', label: 'Wrapper API' },
      { id: 'option-accessors', label: 'Option accessors' },
      { id: 'template-hooks', label: 'Template hooks' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'supported-contract', label: 'Supported contract' },
      { id: 'host-tokens', label: 'Host tokens' },
      { id: 'wrapper-style-variants', label: 'Wrapper style variants' },
    ],
    examples: [
      { id: 'form-usage', label: 'Form usage' },
      { id: 'release-stage-select', label: 'Release stage select' },
      { id: 'custom-owner-template', label: 'Custom owner template' },
      { id: 'mapped-options', label: 'Mapped options' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  slider: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'basic-usage', label: 'Basic usage' },
      { id: 'slider-variants', label: 'Slider variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    api: [
      { id: 'wrapper-api', label: 'Wrapper API' },
      { id: 'range-wrapper-api', label: 'Range wrapper API' },
      { id: 'primitive-api', label: 'Primitive API' },
      { id: 'signal-forms', label: 'Signal forms' },
    ],
    styling: [
      { id: 'supported-contract', label: 'Supported contract' },
      { id: 'host-tokens', label: 'Host tokens' },
      { id: 'wrapper-style-variants', label: 'Wrapper style variants' },
    ],
    examples: [
      { id: 'form-usage', label: 'Form usage' },
      { id: 'stepped-slider', label: 'Stepped slider' },
      { id: 'range-slider', label: 'Range slider' },
      { id: 'range-states', label: 'Range constraints and states' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  separator: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'separator-variants', label: 'Separator variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'tngseparator-directive', label: 'tngSeparator (directive)' },
      { id: 'tng-separator-component', label: 'tng-separator (component)' },
    ],
    styling: [
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'css-starter', label: 'CSS starter' },
    ],
    examples: [
      { id: 'toolbar-grouping', label: 'Toolbar grouping' },
      { id: 'list-grouping', label: 'List grouping' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  skeleton: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'wrapper-component', label: 'Wrapper component' },
      { id: 'sizing-and-state-inputs', label: 'Sizing and state inputs' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'wrapper-slot-hooks', label: 'Wrapper slot hooks' },
      { id: 'default-shell', label: 'Default shell' },
      { id: 'owner-guidance', label: 'Owner guidance' },
    ],
    examples: [
      { id: 'text-stack', label: 'Text stack' },
      { id: 'card-placeholder', label: 'Card placeholder' },
    ],
  },
  stepper: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'progress-indicator-variants', label: 'Progress indicator variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'tngstepper-directive', label: 'tngStepper (directive)' },
      { id: 'tng-stepper-component', label: 'tng-stepper (component)' },
    ],
    styling: [
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'css-starter', label: 'CSS starter' },
    ],
    examples: [
      { id: 'horizontal-orientation-variants', label: 'Horizontal orientation variants' },
      { id: 'checkout-progression-variants', label: 'Checkout progression variants' },
      { id: 'release-pipeline-variants', label: 'Release pipeline variants' },
      { id: 'error-surface-variants', label: 'Error surface variants' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  split: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'workspace-layout', label: 'Workspace layout' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'split-group', label: 'Split group' },
      { id: 'split-pane', label: 'Split pane' },
      { id: 'split-handle', label: 'Split handle' },
      { id: 'events-and-methods', label: 'Events and methods' },
    ],
    styling: [
      { id: 'css-custom-properties', label: 'CSS custom properties' },
      { id: 'state-hooks', label: 'State hooks' },
    ],
    examples: [
      { id: 'vertical-json-panel', label: 'Vertical JSON panel' },
      { id: 'application-workspace', label: 'Application builder workspace' },
      { id: 'persistence', label: 'Consumer persistence' },
    ],
  },
  switch: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'switch-variants', label: 'Switch variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'tngswitch-directive', label: 'tngSwitch (directive)' },
      { id: 'tng-switch-styled-component', label: 'tng-switch (styled component)' },
    ],
    styling: [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'styling-examples', label: 'Styling examples' },
    ],
    examples: [
      { id: 'settings-panel', label: 'Settings panel' },
      { id: 'disabled-state', label: 'Disabled state' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  tag: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'component-wrapper', label: 'Component wrapper' },
      { id: 'projected-primitives', label: 'Projected primitives' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'slot-and-state-hooks', label: 'Slot and state hooks' },
      { id: 'wrapper-data-hooks', label: 'Wrapper data hooks' },
      { id: 'example-contract-overrides', label: 'Example contract overrides' },
    ],
    examples: [
      { id: 'removable-filter-chips', label: 'Removable filter chips' },
      { id: 'status-tags', label: 'Status tags' },
    ],
  },
  tabs: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'structure', label: 'Structure' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    api: [
      { id: 'wrapper-component', label: 'Wrapper component' },
      { id: 'tablist-tab-panel', label: 'Tablist, tab, and panel' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'stable-hooks', label: 'Stable hooks' },
      { id: 'default-shell', label: 'Default shell' },
      { id: 'owner-guidance', label: 'Owner guidance' },
    ],
    examples: [
      { id: 'controlled-value', label: 'Controlled value' },
      { id: 'vertical-layout', label: 'Vertical layout' },
      { id: 'scroll-buttons', label: 'Scroll buttons' },
    ],
  },
  textarea: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'textarea-variants', label: 'Textarea variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    api: [
      { id: 'primitive-textarea-tnginput', label: 'Primitive: textarea[tngInput]' },
      { id: 'component-and-lt-tng-textarea-and-gt', label: 'Component: &lt;tng-textarea&gt;' },
      { id: 'compatibility-alias', label: 'Compatibility alias' },
    ],
    styling: [
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'suggested-css-baseline', label: 'Suggested CSS baseline' },
    ],
    examples: [{ id: 'incident-summary-composer', label: 'Incident summary composer' }],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  toast: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'wrapper-component', label: '&lt;tng-toast&gt; wrapper' },
      { id: 'runtime-methods', label: 'Runtime methods' },
      { id: 'primitive-foundation', label: 'Primitive foundation' },
    ],
    styling: [
      { id: 'wrapper-slot-hooks', label: 'Wrapper slot hooks' },
      { id: 'default-shell', label: 'Default shell' },
      { id: 'owner-guidance', label: 'Owner guidance' },
    ],
    examples: [
      { id: 'activity-stream-notifications', label: 'Activity stream notifications' },
      { id: 'escalation-notifications', label: 'Escalation notifications' },
    ],
  },
  toggle: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'tngtoggle-directive', label: 'tngToggle (directive)' },
      { id: 'tng-toggle-styled-component', label: 'tng-toggle (styled component)' },
    ],
    styling: [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'user-scenario-style-examples', label: 'User scenario style examples' },
    ],
    examples: [{ id: 'professional-scenarios', label: 'Professional scenarios' }],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  tooltip: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'keyboard-baseline', label: 'Keyboard baseline' },
    ],
    api: [
      {
        id: 'wrapper-component-and-lt-tng-tooltip-and-gt',
        label: 'Wrapper component: &lt;tng-tooltip&gt;',
      },
      { id: 'projected-content', label: 'Projected content' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    styling: [
      { id: 'core-data-attributes', label: 'Core data attributes' },
      { id: 'reference-css', label: 'Reference CSS' },
    ],
    examples: [{ id: 'action-hint-workflow', label: 'Action hint workflow' }],
  },
  tree: {
    overview: [
      { id: 'imports', label: 'Imports' },
      { id: 'file-tree-variants', label: 'File tree variants' },
      { id: 'keyboard-navigation', label: 'Keyboard navigation' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    api: [
      { id: 'tngtree-directive', label: 'tngTree (directive)' },
      { id: 'tngtreeitem-directive', label: 'tngTreeItem (directive)' },
      { id: 'tngtreegroup-directive', label: 'tngTreeGroup (directive)' },
      { id: 'tngtreeindicator-directive', label: 'tngTreeIndicator (directive)' },
      { id: 'tng-tree-component', label: 'tng-tree (component)' },
    ],
    styling: [
      { id: 'primitive-data-hooks', label: 'Primitive data hooks' },
      { id: 'primitive-css-starter', label: 'Primitive CSS starter' },
      { id: 'component-css-classes', label: 'Component CSS classes' },
      { id: 'component-css-starter', label: 'Component CSS starter' },
    ],
    examples: [
      { id: 'file-browser', label: 'File browser' },
      { id: 'settings-panel', label: 'Settings panel' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
};

export function getDocsComponentSectionOutlineItems(
  componentSlug: string,
  section: DocsComponentTopLevelSectionId,
): readonly DocsSectionRailItem[] {
  return docsComponentOutlineItemsBySlug[componentSlug]?.[section] ?? [];
}

export function getDocsComponentSectionOutlineTitle(
  section: DocsComponentTopLevelSectionId,
): string {
  switch (section) {
    case 'api':
      return 'API content';
    case 'styling':
      return 'Styling content';
    case 'examples':
      return 'Examples content';
    case 'ownable-install':
      return 'Install content';
    case 'overview':
    default:
      return 'Overview content';
  }
}

export function getDocsComponentSectionOutlineAriaLabel(
  componentTitle: string,
  section: DocsComponentTopLevelSectionId,
): string {
  return `${componentTitle} ${section} section navigation`;
}
