import type { TokenScale } from '../../contracts/token.types';

export const motionPrimitives: TokenScale = {
  durationFast: '120ms',
  durationNormal: '180ms',
  durationSlow: '280ms',
  easingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
  easingExit: 'cubic-bezier(0.4, 0, 1, 1)',
  distanceSmall: '0.25rem',
  scaleSubtle: '0.98',
};
