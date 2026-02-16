// progress-spinner.slots.ts

export type TngProgressSpinnerSlot =
  | 'container'  // Root wrapper
  | 'svg'        // SVG element (size: w-6 h-6, etc.)
  | 'track'      // Track circle (background)
  | 'indicator'; // Indicator circle (foreground stroke)
