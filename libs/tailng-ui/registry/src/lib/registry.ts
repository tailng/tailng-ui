import { accordionRegistryItem } from './accordion/accordion.registry';
import { autocompleteRegistryItem } from './autocomplete/autocomplete.registry';
import { avatarRegistryItem } from './avatar/avatar.registry';
import { badgeRegistryItem } from './badge/badge.registry';
import { bottomsheetRegistryItem } from './bottom-sheet/bottom-sheet.registry';
import { breadcrumbRegistryItem } from './breadcrumb/breadcrumb.registry';
import { buttonRegistryItem } from './button/button.registry';
import { buttontoggleRegistryItem } from './button-toggle/button-toggle.registry';
import { cardRegistryItem } from './card/card.registry';
import { checkboxRegistryItem } from './checkbox/checkbox.registry';
import { chipsRegistryItem } from './chips/chips.registry';
import { codeBlockRegistryItem } from './code-block/code-block.registry';
import { collapsibleRegistryItem } from './collapsible/collapsible.registry';
import { comboboxRegistryItem } from './combobox/combobox.registry';
import { confettiRegistryItem } from './confetti/confetti.registry';
import { contextmenuRegistryItem } from './context-menu/context-menu.registry';
import { copyRegistryItem } from './copy/copy.registry';
import { dialogRegistryItem } from './dialog/dialog.registry';
import { drawerRegistryItem } from './drawer/drawer.registry';
import { dropdownMenuRegistryItem } from './dropdown-menu/dropdown-menu.registry';
import { emptyRegistryItem } from './empty/empty.registry';
import { gridRegistryItem } from './grid/grid.registry';
import { inputRegistryItem } from './input/input.registry';
import { inputOtpRegistryItem } from './input-otp/input-otp.registry';
import { labelRegistryItem } from './label/label.registry';
import { menuRegistryItem } from './menu/menu.registry';
import { menubarRegistryItem } from './menubar/menubar.registry';
import { multiselectRegistryItem } from './multiselect/multiselect.registry';
import { navigationmenuRegistryItem } from './navigation-menu/navigation-menu.registry';
import { paginationRegistryItem } from './pagination/pagination.registry';
import { popoverRegistryItem } from './popover/popover.registry';
import { progressBarRegistryItem } from './progress-bar/progress-bar.registry';
import { progressSpinnerRegistryItem } from './progress-spinner/progress-spinner.registry';
import { radioRegistryItem } from './radio/radio.registry';
import { rangeSliderRegistryItem } from './range-slider/range-slider.registry';
import { withRegistryInstallMetadata } from './registry.install';
import type { RegistryItem, RegistryItemSource } from './registry.types';
import { selectRegistryItem } from './select/select.registry';
import { separatorRegistryItem } from './separator/separator.registry';
import { skeletonRegistryItem } from './skeleton/skeleton.registry';
import { sliderRegistryItem } from './slider/slider.registry';
import { stepperRegistryItem } from './stepper/stepper.registry';
import { switchRegistryItem } from './switch/switch.registry';
import { tableRegistryItem } from './table/table.registry';
import { tabsRegistryItem } from './tabs/tabs.registry';
import { tagRegistryItem } from './tag/tag.registry';
import { textareaRegistryItem } from './textarea/textarea.registry';
import { toastRegistryItem } from './toast/toast.registry';
import { toggleRegistryItem } from './toggle/toggle.registry';
import { togglegroupRegistryItem } from './toggle-group/toggle-group.registry';
import { toolbarRegistryItem } from './toolbar/toolbar.registry';
import { tooltipRegistryItem } from './tooltip/tooltip.registry';
import { treeRegistryItem } from './tree/tree.registry';

const rawRegistry: readonly RegistryItemSource[] = [
  accordionRegistryItem,
  avatarRegistryItem,
  badgeRegistryItem,
  breadcrumbRegistryItem,
  buttontoggleRegistryItem,
  tagRegistryItem,
  buttonRegistryItem,
  cardRegistryItem,
  checkboxRegistryItem,
  dialogRegistryItem,
  dropdownMenuRegistryItem,
  emptyRegistryItem,
  labelRegistryItem,
  inputRegistryItem,
  inputOtpRegistryItem,
  menuRegistryItem,
  contextmenuRegistryItem,
  codeBlockRegistryItem,
  confettiRegistryItem,
  copyRegistryItem,
  menubarRegistryItem,
  navigationmenuRegistryItem,
  toolbarRegistryItem,
  paginationRegistryItem,
  tabsRegistryItem,
  stepperRegistryItem,
  togglegroupRegistryItem,
  chipsRegistryItem,
  collapsibleRegistryItem,
  comboboxRegistryItem,
  selectRegistryItem,
  switchRegistryItem,
  toggleRegistryItem,
  toastRegistryItem,
  tooltipRegistryItem,
  autocompleteRegistryItem,
  multiselectRegistryItem,
  gridRegistryItem,
  treeRegistryItem,
  tableRegistryItem,
  drawerRegistryItem,
  bottomsheetRegistryItem,
  popoverRegistryItem,
  progressBarRegistryItem,
  progressSpinnerRegistryItem,
  radioRegistryItem,
  rangeSliderRegistryItem,
  separatorRegistryItem,
  skeletonRegistryItem,
  sliderRegistryItem,
  textareaRegistryItem,
];

export const tailngRegistry: readonly RegistryItem[] = rawRegistry.map((item) =>
  withRegistryInstallMetadata(item),
);

export function getRegistryItem(name: string): RegistryItem | undefined {
  return tailngRegistry.find((item) => item.name === name);
}

export function listRegistryItemNames(): readonly string[] {
  return tailngRegistry.map((item) => item.name);
}
