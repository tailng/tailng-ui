import type { BundledLanguage, BundledTheme } from 'shiki/bundle/web';

export const DOCS_SHIKI_LANGUAGES = [
  'ts',
  'tsx',
  'js',
  'jsx',
  'bash',
  'html',
  'json',
  'css',
  'scss',
  'shell',
] as const satisfies readonly BundledLanguage[];

export const DOCS_SHIKI_THEMES = [
  'github-dark',
  'github-light',
] as const satisfies readonly BundledTheme[];

export type DocsShikiLanguage = (typeof DOCS_SHIKI_LANGUAGES)[number];
export type DocsShikiTheme = (typeof DOCS_SHIKI_THEMES)[number];

export function normalizeDocsShikiValue(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

export function isDocsShikiLanguage(value: string | null | undefined): value is DocsShikiLanguage {
  return (DOCS_SHIKI_LANGUAGES as readonly string[]).includes(normalizeDocsShikiValue(value));
}

export function isDocsShikiTheme(value: string | null | undefined): value is DocsShikiTheme {
  return (DOCS_SHIKI_THEMES as readonly string[]).includes(normalizeDocsShikiValue(value));
}
