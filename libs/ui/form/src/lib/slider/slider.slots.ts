// slider.slots.ts

export type TngSliderSlot =
  | 'container' // Root wrapper
  | 'trackWrapper' // Wraps track/fill/thumb (visual slider area)
  | 'track' // Track (background)
  | 'trackFill' // Filled segment
  | 'thumb' // Thumb (handle)
  | 'input' // Native range input
  | 'valueText'; // Value display
