import type { Routes } from '@angular/router';
import {
  DEFAULT_OWNABLE_DOCS_SEGMENT,
  OWNABLE_FORM_GROUP,
  OWNABLE_FEEDBACK_GROUP,
  OWNABLE_GETTING_STARTED_GROUP,
  OWNABLE_LAYOUT_GROUP,
  OWNABLE_NAVIGATION_GROUP,
  OWNABLE_OVERLAY_GROUP,
  OWNABLE_RELEASE_GROUP,
  OWNABLE_TOOLING_GROUP,
  OWNABLE_UTILITY_GROUP,
  toOwnableDocsRouteData,
  type OwnableDocsGroup,
} from './ownable-docs.data';

function requireOwnableItem(
  group: OwnableDocsGroup,
  slug: string,
): OwnableDocsGroup['items'][number] {
  const item = group.items.find((candidate) => candidate.slug === slug);
  if (item === undefined) {
    throw new Error(`Missing "${slug}" in ownable docs group "${group.id}".`);
  }

  return item;
}

const overviewItem = requireOwnableItem(OWNABLE_GETTING_STARTED_GROUP, 'overview');
const quickStartItem = requireOwnableItem(OWNABLE_GETTING_STARTED_GROUP, 'quick-start');
const checkboxItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'checkbox');
const toggleItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'toggle');
const radioItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'radio');
const buttonToggleItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'button-toggle');
const chipsItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'chips');
const inputOtpItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'input-otp');
const inputItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'input');
const textareaItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'textarea');
const autocompleteItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'autocomplete');
const switchItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'switch');
const labelItem = requireOwnableItem(OWNABLE_FORM_GROUP, 'label');
const cardItem = requireOwnableItem(OWNABLE_LAYOUT_GROUP, 'card');
const separatorItem = requireOwnableItem(OWNABLE_LAYOUT_GROUP, 'separator');
const collapsibleItem = requireOwnableItem(OWNABLE_LAYOUT_GROUP, 'collapsible');
const accordionItem = requireOwnableItem(OWNABLE_LAYOUT_GROUP, 'accordion');
const stepperItem = requireOwnableItem(OWNABLE_LAYOUT_GROUP, 'stepper');
const tableItem = requireOwnableItem(OWNABLE_LAYOUT_GROUP, 'table');
const dialogItem = requireOwnableItem(OWNABLE_OVERLAY_GROUP, 'dialog');
const popoverItem = requireOwnableItem(OWNABLE_OVERLAY_GROUP, 'popover');
const tooltipItem = requireOwnableItem(OWNABLE_OVERLAY_GROUP, 'tooltip');
const confettiItem = requireOwnableItem(OWNABLE_FEEDBACK_GROUP, 'confetti');
const toastItem = requireOwnableItem(OWNABLE_FEEDBACK_GROUP, 'toast');
const emptyItem = requireOwnableItem(OWNABLE_FEEDBACK_GROUP, 'empty');
const progressBarItem = requireOwnableItem(OWNABLE_FEEDBACK_GROUP, 'progress-bar');
const progressSpinnerItem = requireOwnableItem(OWNABLE_FEEDBACK_GROUP, 'progress-spinner');
const skeletonItem = requireOwnableItem(OWNABLE_FEEDBACK_GROUP, 'skeleton');
const breadcrumbItem = requireOwnableItem(OWNABLE_NAVIGATION_GROUP, 'breadcrumb');
const contextMenuItem = requireOwnableItem(OWNABLE_NAVIGATION_GROUP, 'context-menu');
const menubarItem = requireOwnableItem(OWNABLE_NAVIGATION_GROUP, 'menubar');
const tabsItem = requireOwnableItem(OWNABLE_NAVIGATION_GROUP, 'tabs');
const treeItem = requireOwnableItem(OWNABLE_NAVIGATION_GROUP, 'tree');
const paginationItem = requireOwnableItem(OWNABLE_NAVIGATION_GROUP, 'pagination');
const avatarItem = requireOwnableItem(OWNABLE_UTILITY_GROUP, 'avatar');
const badgeItem = requireOwnableItem(OWNABLE_UTILITY_GROUP, 'badge');
const tagItem = requireOwnableItem(OWNABLE_UTILITY_GROUP, 'tag');
const codeblockItem = requireOwnableItem(OWNABLE_UTILITY_GROUP, 'codeblock');
const copybuttonItem = requireOwnableItem(OWNABLE_UTILITY_GROUP, 'copybutton');
const buttonItem = requireOwnableItem(OWNABLE_UTILITY_GROUP, 'button');
const cliItem = requireOwnableItem(OWNABLE_TOOLING_GROUP, 'cli');
const registryItem = requireOwnableItem(OWNABLE_TOOLING_GROUP, 'registry');
const workflowItem = requireOwnableItem(OWNABLE_RELEASE_GROUP, 'workflow');

export const OWNABLE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/ownable-page.component').then((m) => m.OwnablePageComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: DEFAULT_OWNABLE_DOCS_SEGMENT,
      },
      {
        path: 'getting-started/overview',
        data: toOwnableDocsRouteData(OWNABLE_GETTING_STARTED_GROUP, overviewItem),
        loadComponent: () =>
          import('./getting-started/overview/ownable-overview-page.component').then(
            (m) => m.OwnableOverviewPageComponent,
          ),
      },
      {
        path: 'getting-started/quick-start',
        data: toOwnableDocsRouteData(OWNABLE_GETTING_STARTED_GROUP, quickStartItem),
        loadComponent: () =>
          import('./getting-started/quick-start/ownable-quick-start-page.component').then(
            (m) => m.OwnableQuickStartPageComponent,
          ),
      },
      {
        path: 'form/checkbox',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, checkboxItem),
        loadComponent: () =>
          import('./form/checkbox/ownable-checkbox-page.component').then(
            (m) => m.OwnableCheckboxPageComponent,
          ),
      },
      {
        path: 'form/toggle',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, toggleItem),
        loadComponent: () =>
          import('./form/toggle/ownable-toggle-page.component').then(
            (m) => m.OwnableTogglePageComponent,
          ),
      },
      {
        path: 'form/radio',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, radioItem),
        loadComponent: () =>
          import('./form/radio/ownable-radio-page.component').then(
            (m) => m.OwnableRadioPageComponent,
          ),
      },
      {
        path: 'form/button-toggle',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, buttonToggleItem),
        loadComponent: () =>
          import('./form/button-toggle/ownable-button-toggle-page.component').then(
            (m) => m.OwnableButtonTogglePageComponent,
          ),
      },
      {
        path: 'form/chips',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, chipsItem),
        loadComponent: () =>
          import('./form/chips/ownable-chips-page.component').then(
            (m) => m.OwnableChipsPageComponent,
          ),
      },
      {
        path: 'form/input-otp',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, inputOtpItem),
        loadComponent: () =>
          import('./form/input-otp/ownable-input-otp-page.component').then(
            (m) => m.OwnableInputOtpPageComponent,
          ),
      },
      {
        path: 'form/input',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, inputItem),
        loadComponent: () =>
          import('./form/input/ownable-input-page.component').then(
            (m) => m.OwnableInputPageComponent,
          ),
      },
      {
        path: 'form/textarea',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, textareaItem),
        loadComponent: () =>
          import('./form/textarea/ownable-textarea-page.component').then(
            (m) => m.OwnableTextareaPageComponent,
          ),
      },
      {
        path: 'form/autocomplete',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, autocompleteItem),
        loadComponent: () =>
          import('./form/autocomplete/ownable-autocomplete-page.component').then(
            (m) => m.OwnableAutocompletePageComponent,
          ),
      },
      {
        path: 'form/switch',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, switchItem),
        loadComponent: () =>
          import('./form/switch/ownable-switch-page.component').then(
            (m) => m.OwnableSwitchPageComponent,
          ),
      },
      {
        path: 'form/label',
        data: toOwnableDocsRouteData(OWNABLE_FORM_GROUP, labelItem),
        loadComponent: () =>
          import('./form/label/ownable-label-page.component').then(
            (m) => m.OwnableLabelPageComponent,
          ),
      },
      {
        path: 'layout/card',
        data: toOwnableDocsRouteData(OWNABLE_LAYOUT_GROUP, cardItem),
        loadComponent: () =>
          import('./layout/card/ownable-card-page.component').then(
            (m) => m.OwnableCardPageComponent,
          ),
      },
      {
        path: 'layout/separator',
        data: toOwnableDocsRouteData(OWNABLE_LAYOUT_GROUP, separatorItem),
        loadComponent: () =>
          import('./layout/separator/ownable-separator-page.component').then(
            (m) => m.OwnableSeparatorPageComponent,
          ),
      },
      {
        path: 'layout/collapsible',
        data: toOwnableDocsRouteData(OWNABLE_LAYOUT_GROUP, collapsibleItem),
        loadComponent: () =>
          import('./layout/collapsible/ownable-collapsible-page.component').then(
            (m) => m.OwnableCollapsiblePageComponent,
          ),
      },
      {
        path: 'layout/accordion',
        data: toOwnableDocsRouteData(OWNABLE_LAYOUT_GROUP, accordionItem),
        loadComponent: () =>
          import('./layout/accordion/ownable-accordion-page.component').then(
            (m) => m.OwnableAccordionPageComponent,
          ),
      },
      {
        path: 'layout/stepper',
        data: toOwnableDocsRouteData(OWNABLE_LAYOUT_GROUP, stepperItem),
        loadComponent: () =>
          import('./layout/stepper/ownable-stepper-page.component').then(
            (m) => m.OwnableStepperPageComponent,
          ),
      },
      {
        path: 'layout/table',
        data: toOwnableDocsRouteData(OWNABLE_LAYOUT_GROUP, tableItem),
        loadComponent: () =>
          import('./layout/table/ownable-table-page.component').then(
            (m) => m.OwnableTablePageComponent,
          ),
      },
      {
        path: 'overlay/dialog',
        data: toOwnableDocsRouteData(OWNABLE_OVERLAY_GROUP, dialogItem),
        loadComponent: () =>
          import('./overlay/dialog/ownable-dialog-page.component').then(
            (m) => m.OwnableDialogPageComponent,
          ),
      },
      {
        path: 'overlay/popover',
        data: toOwnableDocsRouteData(OWNABLE_OVERLAY_GROUP, popoverItem),
        loadComponent: () =>
          import('./overlay/popover/ownable-popover-page.component').then(
            (m) => m.OwnablePopoverPageComponent,
          ),
      },
      {
        path: 'overlay/tooltip',
        data: toOwnableDocsRouteData(OWNABLE_OVERLAY_GROUP, tooltipItem),
        loadComponent: () =>
          import('./overlay/tooltip/ownable-tooltip-page.component').then(
            (m) => m.OwnableTooltipPageComponent,
          ),
      },
      {
        path: 'feedback/confetti',
        data: toOwnableDocsRouteData(OWNABLE_FEEDBACK_GROUP, confettiItem),
        loadComponent: () =>
          import('./feedback/confetti/ownable-confetti-page.component').then(
            (m) => m.OwnableConfettiPageComponent,
          ),
      },
      {
        path: 'feedback/toast',
        data: toOwnableDocsRouteData(OWNABLE_FEEDBACK_GROUP, toastItem),
        loadComponent: () =>
          import('./feedback/toast/ownable-toast-page.component').then(
            (m) => m.OwnableToastPageComponent,
          ),
      },
      {
        path: 'feedback/empty',
        data: toOwnableDocsRouteData(OWNABLE_FEEDBACK_GROUP, emptyItem),
        loadComponent: () =>
          import('./feedback/empty/ownable-empty-page.component').then(
            (m) => m.OwnableEmptyPageComponent,
          ),
      },
      {
        path: 'feedback/progress-bar',
        data: toOwnableDocsRouteData(OWNABLE_FEEDBACK_GROUP, progressBarItem),
        loadComponent: () =>
          import('./feedback/progress-bar/ownable-progress-bar-page.component').then(
            (m) => m.OwnableProgressBarPageComponent,
          ),
      },
      {
        path: 'feedback/progress-spinner',
        data: toOwnableDocsRouteData(OWNABLE_FEEDBACK_GROUP, progressSpinnerItem),
        loadComponent: () =>
          import('./feedback/progress-spinner/ownable-progress-spinner-page.component').then(
            (m) => m.OwnableProgressSpinnerPageComponent,
          ),
      },
      {
        path: 'feedback/skeleton',
        data: toOwnableDocsRouteData(OWNABLE_FEEDBACK_GROUP, skeletonItem),
        loadComponent: () =>
          import('./feedback/skeleton/ownable-skeleton-page.component').then(
            (m) => m.OwnableSkeletonPageComponent,
          ),
      },
      {
        path: 'navigation/breadcrumb',
        data: toOwnableDocsRouteData(OWNABLE_NAVIGATION_GROUP, breadcrumbItem),
        loadComponent: () =>
          import('./navigation/breadcrumb/ownable-breadcrumb-page.component').then(
            (m) => m.OwnableBreadcrumbPageComponent,
          ),
      },
      {
        path: 'navigation/context-menu',
        data: toOwnableDocsRouteData(OWNABLE_NAVIGATION_GROUP, contextMenuItem),
        loadComponent: () =>
          import('./navigation/context-menu/ownable-context-menu-page.component').then(
            (m) => m.OwnableContextMenuPageComponent,
          ),
      },
      {
        path: 'navigation/menubar',
        data: toOwnableDocsRouteData(OWNABLE_NAVIGATION_GROUP, menubarItem),
        loadComponent: () =>
          import('./navigation/menubar/ownable-menubar-page.component').then(
            (m) => m.OwnableMenubarPageComponent,
          ),
      },
      {
        path: 'navigation/tabs',
        data: toOwnableDocsRouteData(OWNABLE_NAVIGATION_GROUP, tabsItem),
        loadComponent: () =>
          import('./navigation/tabs/ownable-tabs-page.component').then(
            (m) => m.OwnableTabsPageComponent,
          ),
      },
      {
        path: 'navigation/tree',
        data: toOwnableDocsRouteData(OWNABLE_NAVIGATION_GROUP, treeItem),
        loadComponent: () =>
          import('./navigation/tree/ownable-tree-page.component').then(
            (m) => m.OwnableTreePageComponent,
          ),
      },
      {
        path: 'navigation/pagination',
        data: toOwnableDocsRouteData(OWNABLE_NAVIGATION_GROUP, paginationItem),
        loadComponent: () =>
          import('./navigation/pagination/ownable-pagination-page.component').then(
            (m) => m.OwnablePaginationPageComponent,
          ),
      },
      {
        path: 'utility/avatar',
        data: toOwnableDocsRouteData(OWNABLE_UTILITY_GROUP, avatarItem),
        loadComponent: () =>
          import('./utility/avatar/ownable-avatar-page.component').then(
            (m) => m.OwnableAvatarPageComponent,
          ),
      },
      {
        path: 'utility/badge',
        data: toOwnableDocsRouteData(OWNABLE_UTILITY_GROUP, badgeItem),
        loadComponent: () =>
          import('./utility/badge/ownable-badge-page.component').then(
            (m) => m.OwnableBadgePageComponent,
          ),
      },
      {
        path: 'utility/tag',
        data: toOwnableDocsRouteData(OWNABLE_UTILITY_GROUP, tagItem),
        loadComponent: () =>
          import('./utility/tag/ownable-tag-page.component').then((m) => m.OwnableTagPageComponent),
      },
      {
        path: 'utility/codeblock',
        data: toOwnableDocsRouteData(OWNABLE_UTILITY_GROUP, codeblockItem),
        loadComponent: () =>
          import('./utility/codeblock/ownable-codeblock-page.component').then(
            (m) => m.OwnableCodeblockPageComponent,
          ),
      },
      {
        path: 'utility/copybutton',
        data: toOwnableDocsRouteData(OWNABLE_UTILITY_GROUP, copybuttonItem),
        loadComponent: () =>
          import('./utility/copybutton/ownable-copybutton-page.component').then(
            (m) => m.OwnableCopybuttonPageComponent,
          ),
      },
      {
        path: 'utility/button',
        data: toOwnableDocsRouteData(OWNABLE_UTILITY_GROUP, buttonItem),
        loadComponent: () =>
          import('./utility/button/ownable-button-page.component').then(
            (m) => m.OwnableButtonPageComponent,
          ),
      },
      {
        path: 'tooling/cli',
        data: toOwnableDocsRouteData(OWNABLE_TOOLING_GROUP, cliItem),
        loadComponent: () =>
          import('./tooling/cli/ownable-cli-page.component').then((m) => m.OwnableCliPageComponent),
      },
      {
        path: 'tooling/registry',
        data: toOwnableDocsRouteData(OWNABLE_TOOLING_GROUP, registryItem),
        loadComponent: () =>
          import('./tooling/registry/ownable-registry-page.component').then(
            (m) => m.OwnableRegistryPageComponent,
          ),
      },
      {
        path: 'release/workflow',
        data: toOwnableDocsRouteData(OWNABLE_RELEASE_GROUP, workflowItem),
        loadComponent: () =>
          import('./release/workflow/ownable-release-workflow-page.component').then(
            (m) => m.OwnableReleaseWorkflowPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: DEFAULT_OWNABLE_DOCS_SEGMENT,
      },
    ],
  },
];
