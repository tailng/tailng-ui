// select.slots.ts

export type TngSelectSlot =
  | 'container' // Root wrapper

  // Trigger
  | 'triggerButton'
  | 'triggerValue'
  | 'triggerPlaceholder'
  | 'triggerIcon'

  // Dropdown overlay
  | 'overlayPanel' // tng-overlay-panel panel

  // Option list (tng-option-list)
  | 'optionListContainer'
  | 'option'
  | 'optionActive'
  | 'optionInactive'
  | 'optionListEmpty';
