// button-toggle.slots.ts

export type TngButtonToggleSlot =
  | 'container' // Root (role="group")
  | 'button' // Button base (all states)
  | 'buttonActive' // Selected button
  | 'buttonInactive' // Unselected button
  | 'buttonDisabled'; // Disabled button
