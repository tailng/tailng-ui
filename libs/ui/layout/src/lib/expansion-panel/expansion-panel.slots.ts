// expansion-panel.slots.ts

export type TngExpansionPanelSlot =
  | 'container'       // Root wrapper
  | 'header'          // Header button
  | 'title'           // Title span
  | 'iconWrapper'     // Icon wrapper span
  | 'chevron'         // Default chevron SVG
  | 'contentOuter'    // Outer content grid
  | 'contentClip'     // Content overflow clip
  | 'contentBody'     // Content body (includes padding when padded)
  | 'contentPadding'; // Padding (used when padded=true)
