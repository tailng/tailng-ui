import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { toCssVars } from '@tailng-ui/theme';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../shared/util';
import { getThemeDocsTheme } from '../../theme-docs.data';

type ThemeCollectionCard = Readonly<{
  examples: readonly string[];
  label: string;
  summary: string;
}>;

const PRIMITIVE_COLLECTIONS: readonly ThemeCollectionCard[] = [
  {
    label: 'color',
    summary: 'Foundational palette values used as references inside semantic scales.',
    examples: ['primary500', 'neutral900', 'danger500'],
  },
  {
    label: 'spacing',
    summary: 'Spacing ramp used by wrappers, layouts, and exported utility adapters.',
    examples: ['space2', 'space4', 'space8'],
  },
  {
    label: 'radius',
    summary: 'Corner radius scale for shells, panels, and rounded affordances.',
    examples: ['sm', 'md', 'xl'],
  },
  {
    label: 'typography',
    summary: 'Font-size and typographic tokens exposed to CSS variables and Tailwind.',
    examples: ['textSm', 'textBase', 'textLg'],
  },
  {
    label: 'motion',
    summary: 'Transition durations and motion utilities shared by wrappers and utilities.',
    examples: ['durationFast', 'durationNormal', 'durationSlow', 'easingExit'],
  },
] as const;

const SEMANTIC_COLLECTIONS: readonly ThemeCollectionCard[] = [
  {
    label: 'background',
    summary: 'Surface and canvas colors that define page, panel, and muted surfaces.',
    examples: ['base', 'canvas', 'surface'],
  },
  {
    label: 'foreground',
    summary: 'Readable text colors for primary, secondary, muted, and inverse content.',
    examples: ['primary', 'secondary', 'inverse'],
  },
  {
    label: 'border',
    summary: 'Border strengths for shells, separators, and emphasis states.',
    examples: ['default', 'subtle', 'strong'],
  },
  {
    label: 'accent',
    summary: 'Brand and state accents used by actions, status surfaces, and emphasis treatments.',
    examples: ['brand', 'success', 'warning'],
  },
  {
    label: 'focus',
    summary: 'Focus ring tokens that keep keyboard states aligned with the current theme.',
    examples: ['ring'],
  },
] as const;

function buildCssVarBlock(vars: Readonly<Record<string, string>>, keys: readonly string[]): string {
  return [':root {', ...keys.map((key) => `  ${key}: ${vars[key]};`), '}', ''].join('\n');
}

@Component({
  selector: 'app-theme-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './theme-styling-page.component.html',
  styleUrl: './theme-styling-page.component.css',
})
export class ThemeStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly primitiveCollections = PRIMITIVE_COLLECTIONS;
  protected readonly semanticCollections = SEMANTIC_COLLECTIONS;

  protected readonly tokenReferenceCode = [
    "import { resolveToken } from '@tailng-ui/theme';",
    '',
    "const surface = resolveToken(theme, '{semantic.background.surface}');",
    "const brand = resolveToken(theme, '{accent.brand}');",
    "const spacing = resolveToken(theme, '{spacing.space4}');",
    '',
  ].join('\n');

  protected readonly cssVarAdapterCode = [
    "import { defaultDarkThemePreset, toCssVars } from '@tailng-ui/theme';",
    '',
    'const semanticVars = toCssVars(defaultDarkThemePreset, {',
    '  includePrimitives: false,',
    '});',
    '',
  ].join('\n');

  protected readonly semanticVarsOutputCode = ((): string => {
    const theme = getThemeDocsTheme('default', 'dark');
    const vars = toCssVars(theme, { includePrimitives: false });

    return buildCssVarBlock(vars, [
      '--tng-semantic-background-base',
      '--tng-semantic-background-canvas',
      '--tng-semantic-background-surface',
      '--tng-semantic-foreground-primary',
      '--tng-semantic-foreground-secondary',
      '--tng-semantic-border-default',
      '--tng-semantic-accent-brand',
      '--tng-semantic-accent-success',
      '--tng-semantic-focus-ring',
    ]);
  })();

  protected readonly contractIndexImportCode =
    "@import '@tailng-ui/theme/component-contracts/index.css';";

  protected readonly contractSingleImportCode =
    "@import '@tailng-ui/theme/component-contracts/button.css';";

  protected readonly overlayMotionThemeCode = [
    "import { createTheme, defaultThemePreset } from '@tailng-ui/theme';",
    '',
    'export const calmTheme = createTheme(defaultThemePreset, {',
    '  tokens: {',
    '    primitives: {',
    '      motion: {',
    "        durationFast: '100ms', // overlay exit",
    "        durationNormal: '160ms', // overlay enter",
    "        easingExit: 'cubic-bezier(0.4, 0, 1, 1)',",
    "        distanceSmall: '0.2rem',",
    "        scaleSubtle: '0.985',",
    '      },',
    '    },',
    '  },',
    '});',
    '',
  ].join('\n');

  protected readonly overlayMotionCssCode = [
    ':root {',
    '  /* Shared overlay-only overrides */',
    '  --tng-overlay-enter-duration: 160ms;',
    '  --tng-overlay-exit-duration: 100ms;',
    '  --tng-overlay-distance: 0.2rem;',
    '  --tng-overlay-scale-from: 0.985;',
    '}',
    '',
    '.quiet-dialog {',
    '  /* Component-scoped overrides */',
    '  --tng-dialog-enter-duration: 220ms;',
    '  --tng-dialog-exit-duration: 140ms;',
    '}',
    '',
  ].join('\n');

  protected readonly tailwindPresetCode = [
    "import type { Config } from 'tailwindcss';",
    "import { atlasThemePreset, toTailwindPreset } from '@tailng-ui/theme';",
    '',
    'const tailngTheme = toTailwindPreset(atlasThemePreset);',
    '',
    'export default {',
    "  content: ['./src/**/*.{html,ts}'],",
    '  theme: {',
    '    extend: {',
    '      ...tailngTheme.theme.extend,',
    '    },',
    '  },',
    '} satisfies Config;',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
