import { describe, expect, it } from 'vitest';
import { atlasDarkThemePreset } from './atlas-dark.preset';
import { atlasThemePreset } from './atlas.preset';
import { daybookClassicDarkThemePreset } from './daybook-classic-dark.preset';
import { daybookClassicThemePreset } from './daybook-classic.preset';
import { defaultDarkThemePreset } from './default-dark.preset';
import { defaultThemePreset } from './default.preset';
import { minimalDarkThemePreset } from './minimal-dark.preset';
import { minimalThemePreset } from './minimal.preset';
import { nexusDarkThemePreset } from './nexus-dark.preset';
import { nexusThemePreset } from './nexus.preset';
import { prismDarkThemePreset } from './prism-dark.preset';
import { prismThemePreset } from './prism.preset';
import { slateDarkThemePreset } from './slate-dark.preset';
import { slateThemePreset } from './slate.preset';
import { sterlingDarkThemePreset } from './sterling-dark.preset';
import { sterlingThemePreset } from './sterling.preset';

describe('theme presets', () => {
  it('provides the shared overlay motion primitives', () => {
    expect(defaultThemePreset.tokens.primitives.motion).toMatchObject({
      durationFast: '120ms',
      durationNormal: '180ms',
      durationSlow: '280ms',
      easingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
      easingExit: 'cubic-bezier(0.4, 0, 1, 1)',
      distanceSmall: '0.25rem',
      scaleSubtle: '0.98',
    });
  });

  it('keeps light presets in light mode', () => {
    expect(defaultThemePreset.meta.mode).toBe('light');
    expect(minimalThemePreset.meta.mode).toBe('light');
    expect(slateThemePreset.meta.mode).toBe('light');
    expect(nexusThemePreset.meta.mode).toBe('light');
    expect(prismThemePreset.meta.mode).toBe('light');
    expect(atlasThemePreset.meta.mode).toBe('light');
    expect(sterlingThemePreset.meta.mode).toBe('light');
    expect(daybookClassicThemePreset.meta.mode).toBe('light');
  });

  it('exports dark preset variants with dark mode metadata', () => {
    expect(defaultDarkThemePreset.meta.mode).toBe('dark');
    expect(minimalDarkThemePreset.meta.mode).toBe('dark');
    expect(slateDarkThemePreset.meta.mode).toBe('dark');
    expect(nexusDarkThemePreset.meta.mode).toBe('dark');
    expect(prismDarkThemePreset.meta.mode).toBe('dark');
    expect(atlasDarkThemePreset.meta.mode).toBe('dark');
    expect(sterlingDarkThemePreset.meta.mode).toBe('dark');
    expect(daybookClassicDarkThemePreset.meta.mode).toBe('dark');
    expect(defaultDarkThemePreset.meta.name).toBe('tailng-default-dark');
    expect(minimalDarkThemePreset.meta.name).toBe('tailng-minimal-dark');
    expect(slateDarkThemePreset.meta.name).toBe('tailng-slate-dark');
    expect(nexusDarkThemePreset.meta.name).toBe('tailng-nexus-dark');
    expect(prismDarkThemePreset.meta.name).toBe('tailng-prism-dark');
    expect(atlasDarkThemePreset.meta.name).toBe('tailng-atlas-dark');
    expect(sterlingDarkThemePreset.meta.name).toBe('tailng-sterling-dark');
    expect(daybookClassicDarkThemePreset.meta.name).toBe('tailng-daybook-classic-dark');
  });

  it('provides non-empty semantic scales for dark preset variants', () => {
    expect(Object.keys(defaultDarkThemePreset.tokens.semantic.background).length).toBeGreaterThan(
      0,
    );
    expect(Object.keys(minimalDarkThemePreset.tokens.semantic.background).length).toBeGreaterThan(
      0,
    );
    expect(Object.keys(slateDarkThemePreset.tokens.semantic.background).length).toBeGreaterThan(0);
    expect(Object.keys(nexusDarkThemePreset.tokens.semantic.background).length).toBeGreaterThan(0);
    expect(Object.keys(prismDarkThemePreset.tokens.semantic.background).length).toBeGreaterThan(0);
    expect(Object.keys(atlasDarkThemePreset.tokens.semantic.background).length).toBeGreaterThan(0);
    expect(Object.keys(sterlingDarkThemePreset.tokens.semantic.background).length).toBeGreaterThan(
      0,
    );
    expect(
      Object.keys(daybookClassicDarkThemePreset.tokens.semantic.background).length,
    ).toBeGreaterThan(0);
  });
});
