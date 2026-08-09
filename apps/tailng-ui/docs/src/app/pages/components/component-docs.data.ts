export type ComponentsDocsCategoryId =
  | 'getting-started'
  | 'layout'
  | 'overlay'
  | 'feedback'
  | 'form'
  | 'utility'
  | 'navigation';

export type ComponentsDocsItem = Readonly<{
  id: string;
  slug: string;
  title: string;
  description: string;
}>;

export type ComponentsDocsGroup = Readonly<{
  id: ComponentsDocsCategoryId;
  title: string;
  subtitle: string;
  items: readonly ComponentsDocsItem[];
}>;

export type ComponentsDocsRouteData = Readonly<{
  groupId: ComponentsDocsCategoryId;
  groupTitle: string;
  groupSubtitle: string;
  item: ComponentsDocsItem;
}>;

export const COMPONENTS_GETTING_STARTED_GROUP: ComponentsDocsGroup = {
  id: 'getting-started',
  title: 'Getting Started',
  subtitle: 'Installation and setup guides',
  items: [
    {
      id: 'quick-start',
      slug: 'quick-start',
      title: 'Quick Start',
      description: 'Fast path to scaffold and run your first TailNG component page.',
    },
    {
      id: 'installation',
      slug: 'installation',
      title: 'Installation',
      description: 'Package-level install matrix for TailNG Components and peer layers.',
    },
    {
      id: 'configure-theme',
      slug: 'configure-theme',
      title: 'Configure Theme',
      description:
        'Apply and customize the TailNG theme using CSS variables, dark mode, and Tailwind integration.',
    },
    {
      id: 'signal-form-demo',
      slug: 'signal-form-demo',
      title: 'Signal Form Demo',
      description: 'Real-world Angular signal forms example using the TailNG form components.',
    },
    {
      id: 'plain-css-setup',
      slug: 'plain-css-setup',
      title: 'Plain CSS Setup',
      description: 'Set up TailNG Components with semantic tokens using vanilla CSS.',
    },
    {
      id: 'tailwind-setup',
      slug: 'tailwind-setup',
      title: 'Tailwind Setup',
      description: 'Integrate TailNG Components with utility-first styling in Tailwind.',
    },
  ],
};

export const COMPONENTS_FORM_GROUP: ComponentsDocsGroup = {
  id: 'form',
  title: 'Form',
  subtitle: 'Input and selection components',
  items: [
    {
      id: 'input',
      slug: 'input',
      title: 'Input',
      description: 'Text input fields, adornments, validation messaging, and layout patterns.',
    },
    {
      id: 'number-range',
      slug: 'number-range',
      title: 'Number Range',
      description:
        'Dual numeric input for min/max range selection with built-in validity checking and form integration.',
    },
    {
      id: 'textarea',
      slug: 'textarea',
      title: 'Textarea',
      description:
        'Multiline text input patterns with input-first primitives and styled textarea wrappers.',
    },
    {
      id: 'label',
      slug: 'label',
      title: 'Label',
      description: 'Accessible label semantics for explicit and wrapped control association.',
    },
    {
      id: 'checkbox',
      slug: 'checkbox',
      title: 'Checkbox',
      description: 'Binary and tri-state selection patterns with headless and styled usage.',
    },
    {
      id: 'toggle',
      slug: 'toggle',
      title: 'Toggle',
      description: 'Pressed button semantics for compact on/off actions and toolbar commands.',
    },
    {
      id: 'toggle-group',
      slug: 'toggle-group',
      title: 'Toggle Group',
      description: 'Coordinated single or multiple selection state for grouped toggle buttons.',
    },
    {
      id: 'switch',
      slug: 'switch',
      title: 'Switch',
      description: 'Two-state on/off toggle with track/thumb rendering and arrow-key support.',
    },
    {
      id: 'radio',
      slug: 'radio',
      title: 'Radio',
      description: 'Single-choice grouped selection with native semantics and keyboard behavior.',
    },
    {
      id: 'button-toggle',
      slug: 'button-toggle',
      title: 'Button Toggle',
      description: 'Single and multiple pressed-button groups for toolbars and view switches.',
    },
    {
      id: 'listbox',
      slug: 'listbox',
      title: 'ListBox',
      description: 'Listbox interaction patterns and keyboard behavior reference.',
    },
    {
      id: 'autocomplete',
      slug: 'autocomplete',
      title: 'AutoComplete',
      description: 'Single-value autocomplete patterns and filtering behavior.',
    },
    {
      id: 'multi-autocomplete',
      slug: 'multi-autocomplete',
      title: 'MultiAutocomplete',
      description: 'Chip-based autocomplete selection for multiple values.',
    },
    {
      id: 'select',
      slug: 'select',
      title: 'Select',
      description: 'Single-choice select surfaces and trigger/content composition.',
    },
    {
      id: 'multiselect',
      slug: 'multiselect',
      title: 'MultiSelect',
      description: 'Multiple-selection dropdown behavior and state handling.',
    },
    {
      id: 'datepicker',
      slug: 'datepicker',
      title: 'Datepicker',
      description:
        'Material-style date selection with editable input, adapter formatting, and bounded calendar views.',
    },
    {
      id: 'date-range-picker',
      slug: 'date-range-picker',
      title: 'Date Range Picker',
      description:
        'Material-style date range selection with editable input, adapter formatting, and bounded calendar views.',
    },
    {
      id: 'month-daypicker',
      slug: 'month-daypicker',
      title: 'Month Daypicker',
      description: 'Month-day selection for recurring dates without exposing a year in the value.',
    },
    {
      id: 'yearpicker',
      slug: 'yearpicker',
      title: 'Yearpicker',
      description: 'Year-only selection built on the shared datepicker surface.',
    },
    {
      id: 'slider',
      slug: 'slider',
      title: 'Slider',
      description: 'Single-value slider for numeric settings and continuous values.',
    },
    {
      id: 'range-slider',
      slug: 'range-slider',
      title: 'Range Slider',
      description: 'Dual-thumb slider for selecting bounded minimum and maximum values.',
    },
    {
      id: 'chips',
      slug: 'chips',
      title: 'Chips',
      description: 'Tokenized input and removable item chip usage patterns.',
    },
    {
      id: 'input-otp',
      slug: 'input-otp',
      title: 'Input OTP',
      description: 'Segmented one-time-password input with keyboard, paste, and form integration.',
    },
    {
      id: 'input-field',
      slug: 'input-field',
      title: 'Input Field',
      description:
        'Projected input shell with prefix and suffix slots for icons, helper text, and inline actions.',
    },
    {
      id: 'form-field',
      slug: 'form-field',
      title: 'Form Field',
      description:
        'Complete field wrapper for labels, controls, hints, errors, and accessibility wiring.',
    },
    {
      id: 'fileupload',
      slug: 'fileupload',
      title: 'File Upload',
      description:
        'Drag-and-drop file selection with MIME type filtering, size limits, multi-file support, and reactive drag-state feedback.',
    },
  ],
};

export const COMPONENTS_LAYOUT_GROUP: ComponentsDocsGroup = {
  id: 'layout',
  title: 'Layout',
  subtitle: 'Workflow and structural layout components',
  items: [
    {
      id: 'card',
      slug: 'card',
      title: 'Card',
      description: 'Grouped content surfaces with optional media, actions, and footer composition.',
    },
    {
      id: 'separator',
      slug: 'separator',
      title: 'Separator',
      description: 'Horizontal and vertical dividers for visual or semantic content grouping.',
    },
    {
      id: 'collapsible',
      slug: 'collapsible',
      title: 'Collapsible',
      description: 'Expandable disclosure regions with headless and styled integration paths.',
    },
    {
      id: 'accordion',
      slug: 'accordion',
      title: 'Accordion',
      description: 'Single and multi-expand panel groups with keyboard navigation and aria wiring.',
    },
    {
      id: 'stepper',
      slug: 'stepper',
      title: 'Stepper',
      description: 'Styled stepper shell powered by headless value, focus, and state management.',
    },
    {
      id: 'split',
      slug: 'split',
      title: 'Split Layout',
      description:
        'Resizable horizontal and vertical panes with controlled sizes, collapse states, and accessible handles.',
    },
    {
      id: 'flow-editor',
      slug: 'flow-editor',
      title: 'Flow Editor',
      description:
        'Embeddable, controlled node editor for AI agents, automations, and executable workflows.',
    },
    {
      id: 'drawer',
      slug: 'drawer',
      title: 'Drawer',
      description: 'Slide-in overlay panel with position, mode, focus trap, and backdrop support.',
    },
    {
      id: 'table',
      slug: 'table',
      title: 'Table',
      description: 'Styled data table shell with columns, sorting, sticky cells, and empty states.',
    },
    {
      id: 'tree-table',
      slug: 'tree-table',
      title: 'Tree Table',
      description:
        'Hierarchical treegrid table with expand/collapse rows, selection, keyboard navigation, and accessible aria attributes.',
    },
  ],
};

export const COMPONENTS_OVERLAY_GROUP: ComponentsDocsGroup = {
  id: 'overlay',
  title: 'Overlay',
  subtitle: 'Modal and floating layer surfaces',
  items: [
    {
      id: 'dialog',
      slug: 'dialog',
      title: 'Dialog',
      description: 'Modal panel with backdrop dismissal, focus trap, and close reason outputs.',
    },
    {
      id: 'popover',
      slug: 'popover',
      title: 'Popover',
      description: 'Anchored floating panel with trigger semantics and outside/Escape dismissal.',
    },
    {
      id: 'tooltip',
      slug: 'tooltip',
      title: 'Tooltip',
      description:
        'Hover/focus helper text with trigger/content association and side placement hooks.',
    },
  ],
};

export const COMPONENTS_FEEDBACK_GROUP: ComponentsDocsGroup = {
  id: 'feedback',
  title: 'Feedback',
  subtitle: 'Status, empty, progress, and loading placeholder patterns',
  items: [
    {
      id: 'toast',
      slug: 'toast',
      title: 'Toast',
      description:
        'Stacked notification toasts with auto-dismiss timing, dismiss actions, and tone semantics.',
    },
    {
      id: 'empty',
      slug: 'empty',
      title: 'Empty',
      description: 'Empty-state layout with icon, title, description, and action composition.',
    },
    {
      id: 'progress-bar',
      slug: 'progress-bar',
      title: 'Progress Bar',
      description: 'Linear determinate and indeterminate loading states with aria semantics.',
    },
    {
      id: 'progress-spinner',
      slug: 'progress-spinner',
      title: 'Progress Spinner',
      description: 'Circular determinate and indeterminate loading states with aria semantics.',
    },
    {
      id: 'confetti',
      slug: 'confetti',
      title: 'Confetti',
      description: 'Controlled decorative paper bursts for successful actions and milestones.',
    },
    {
      id: 'skeleton',
      slug: 'skeleton',
      title: 'Skeleton',
      description: 'Decorative placeholder blocks for loading layouts and content scaffolding.',
    },
  ],
};

export const COMPONENTS_UTILITY_GROUP: ComponentsDocsGroup = {
  id: 'utility',
  title: 'Utility',
  subtitle: 'General-purpose interface utilities',
  items: [
    {
      id: 'codeblock',
      slug: 'codeblock',
      title: 'Codeblock',
      description: 'Code rendering, highlighting adapters, and line metadata.',
    },
    {
      id: 'copybutton',
      slug: 'copybutton',
      title: 'CopyButton',
      description: 'Clipboard actions, success/error states, and feedback hooks.',
    },
    {
      id: 'button',
      slug: 'button',
      title: 'Button',
      description: 'Press/action semantics, accessibility, and interaction states.',
    },
    {
      id: 'command-palette',
      slug: 'command-palette',
      title: 'Command Palette',
      description:
        'Modal search palette with query output, templated results, keyboard selection, and empty/loading states.',
    },
    {
      id: 'avatar',
      slug: 'avatar',
      title: 'Avatar',
      description: 'Identity surfaces with fallback handling, shape, and size variants.',
    },
    {
      id: 'badge',
      slug: 'badge',
      title: 'Badge',
      description: 'Count, dot, and placement badges for notifications and status overlays.',
    },
    {
      id: 'tag',
      slug: 'tag',
      title: 'Tag',
      description: 'Compact label chips with optional icon and removable close action.',
    },
  ],
};

export const COMPONENTS_NAVIGATION_GROUP: ComponentsDocsGroup = {
  id: 'navigation',
  title: 'Navigation',
  subtitle: 'Menu surfaces and hierarchical actions',
  items: [
    {
      id: 'menubar',
      slug: 'menubar',
      title: 'Menubar',
      description: 'Top-level menubar patterns with owned menu integration.',
    },
    {
      id: 'menu',
      slug: 'menu',
      title: 'Menu',
      description: 'Contextual menu interactions, keyboard flow, and submenu behavior.',
    },
    {
      id: 'context-menu',
      slug: 'context-menu',
      title: 'Context Menu',
      description: 'Right-click and keyboard context actions anchored to element surfaces.',
    },
    {
      id: 'breadcrumb',
      slug: 'breadcrumb',
      title: 'Breadcrumb',
      description:
        'Hierarchical path navigation with optional collapse and current-page semantics.',
    },
    {
      id: 'tabs',
      slug: 'tabs',
      title: 'Tabs',
      description:
        'Sectioned navigation with tablist, triggers, panels, and controlled or uncontrolled selection.',
    },
    {
      id: 'tree',
      slug: 'tree',
      title: 'Tree',
      description:
        'Hierarchical data navigation with keyboard support, selection, and expand/collapse.',
    },
    {
      id: 'pagination',
      slug: 'pagination',
      title: 'Pagination',
      description:
        'Styled paginator controls for page movement, ranges, page size, and server mode.',
    },
  ],
};

function withAlphabetizedItems(group: ComponentsDocsGroup): ComponentsDocsGroup {
  return {
    ...group,
    items: [...group.items].sort((left, right) => left.title.localeCompare(right.title)),
  };
}

export const COMPONENTS_DOCS_GROUPS: readonly ComponentsDocsGroup[] = Object.freeze([
  COMPONENTS_GETTING_STARTED_GROUP,
  withAlphabetizedItems(COMPONENTS_FORM_GROUP),
  withAlphabetizedItems(COMPONENTS_LAYOUT_GROUP),
  withAlphabetizedItems(COMPONENTS_NAVIGATION_GROUP),
  withAlphabetizedItems(COMPONENTS_OVERLAY_GROUP),
  withAlphabetizedItems(COMPONENTS_FEEDBACK_GROUP),
  withAlphabetizedItems(COMPONENTS_UTILITY_GROUP),
]);

const defaultGroup = COMPONENTS_GETTING_STARTED_GROUP;
const defaultItem = defaultGroup.items[0];
if (defaultItem === undefined) {
  throw new Error('Components docs default item is missing.');
}

export const DEFAULT_COMPONENTS_DOCS_SEGMENT = `${defaultGroup.id}/${defaultItem.slug}`;

export function buildComponentsDocHref(
  groupId: ComponentsDocsCategoryId,
  itemSlug: string,
): string {
  return `/components/${groupId}/${itemSlug}`;
}

export function toComponentsDocsRouteData(
  group: ComponentsDocsGroup,
  item: ComponentsDocsItem,
): ComponentsDocsRouteData {
  return {
    groupId: group.id,
    groupTitle: group.title,
    groupSubtitle: group.subtitle,
    item,
  };
}
