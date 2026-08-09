import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_SLIDER_PLAYGROUND_FILE = 'src/app/playground/form/slider/slider.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'slider',
  COMPONENT_SLIDER_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'slider',
  COMPONENT_SLIDER_PLAYGROUND_FILE,
);
