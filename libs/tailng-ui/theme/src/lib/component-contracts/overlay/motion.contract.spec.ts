import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const motionContractCss = readFileSync(
  join(process.cwd(), 'libs/tailng-ui/theme/src/lib/component-contracts/overlay/motion.css'),
  'utf8',
);

const controlsContractCss = readFileSync(
  join(process.cwd(), 'libs/tailng-ui/theme/src/lib/component-contracts/shared/controls.css'),
  'utf8',
);

const componentContractsIndexCss = readFileSync(
  join(process.cwd(), 'libs/tailng-ui/theme/src/lib/component-contracts/index.css'),
  'utf8',
);

describe('overlay motion theme contract', () => {
  it('maps shared transition aliases to generated motion primitives', () => {
    expect(controlsContractCss).toContain(
      '--tng-duration-fast: var(--tng-motion-durationFast, 120ms);',
    );
    expect(controlsContractCss).toContain(
      '--tng-duration-normal: var(--tng-motion-durationNormal, 180ms);',
    );
    expect(controlsContractCss).toContain(
      '--tng-easing: var(--tng-motion-easingStandard, cubic-bezier(0.2, 0, 0, 1));',
    );
  });

  it('defines enter, exit, distance, scale, and directional hooks', () => {
    expect(motionContractCss).toContain('--tng-overlay-enter-duration:');
    expect(motionContractCss).toContain('--tng-overlay-exit-duration:');
    expect(motionContractCss).toContain('--tng-overlay-distance:');
    expect(motionContractCss).toContain('--tng-overlay-scale-from:');
    expect(motionContractCss).toContain("[data-presence='entering']");
    expect(motionContractCss).toContain("[data-presence='exiting']");
    expect(motionContractCss).toContain("[data-side='left']");
    expect(motionContractCss).toContain("[data-placement='top']");
  });

  it('provides an explicit reduced-motion treatment', () => {
    expect(motionContractCss).toContain('@media (prefers-reduced-motion: reduce)');
    expect(motionContractCss).toContain('animation: none !important;');
  });

  it('is loaded immediately after the shared control aliases', () => {
    const controlsIndex = componentContractsIndexCss.indexOf('./shared/controls.css');
    const motionIndex = componentContractsIndexCss.indexOf('./overlay/motion.css');

    expect(controlsIndex).toBeGreaterThanOrEqual(0);
    expect(motionIndex).toBeGreaterThan(controlsIndex);
  });
});
