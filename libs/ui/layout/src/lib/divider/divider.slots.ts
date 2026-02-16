// divider.slots.ts

export type TngDividerSlot =
  | 'container'       // Root wrapper
  | 'line'            // Line element(s)
  | 'label'           // Label span
  | 'gap'             // Vertical gap (horizontal mode)
  | 'thickness'       // Line thickness (horizontal)
  | 'verticalHeight'; // Line height (vertical mode)
