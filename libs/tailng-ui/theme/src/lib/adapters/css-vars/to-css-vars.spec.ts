import { describe, expect, it } from 'vitest';
import { toCssVars } from './to-css-vars';
import { defaultThemePreset } from '../../presets/default.preset';

describe('toCssVars', () => {
  it('creates primitive and semantic variables with resolved token references', () => {
    const cssVars = toCssVars(defaultThemePreset);

    expect(cssVars['--tng-color-primary500']).toBe('#2563eb');
    expect(cssVars['--tng-motion-durationFast']).toBe('120ms');
    expect(cssVars['--tng-motion-easingExit']).toBe('cubic-bezier(0.4, 0, 1, 1)');
    expect(cssVars['--tng-motion-distanceSmall']).toBe('0.25rem');
    expect(cssVars['--tng-motion-scaleSubtle']).toBe('0.98');
    expect(cssVars['--tng-semantic-accent-brand']).toBe('#2563eb');
  });

  it('supports custom prefix and selective scale inclusion', () => {
    const cssVars = toCssVars(defaultThemePreset, {
      prefix: 'tailng',
      includePrimitives: false,
      includeSemantic: true,
    });

    expect(cssVars['--tailng-semantic-accent-brand']).toBe('#2563eb');
    expect(cssVars['--tailng-color-primary500']).toBeUndefined();
  });

  it('can preserve unresolved references when requested', () => {
    const cssVars = toCssVars(defaultThemePreset, { resolveReferences: false });
    expect(cssVars['--tng-semantic-accent-brand']).toBe('{color.primary500}');
  });
});
