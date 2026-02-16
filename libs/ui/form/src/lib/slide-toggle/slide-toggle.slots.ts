// slide-toggle.slots.ts

export type TngSlideToggleSlot =
  | 'container' // Root <label>
  | 'label' // Label <span>
  | 'input' // Hidden checkbox
  | 'track' // Track (pill background, base)
  | 'trackChecked' // Track when on
  | 'trackUnchecked' // Track when off
  | 'thumb' // Thumb (moving circle, base)
  | 'thumbChecked' // Thumb when on
  | 'thumbUnchecked'; // Thumb when off
