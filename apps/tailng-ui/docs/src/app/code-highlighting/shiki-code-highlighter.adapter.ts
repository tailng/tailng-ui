import {
  createTngCodeHighlighterAdapter,
  type TngCodeHighlightInput,
  type TngCodeHighlightResult,
} from '@tailng-ui/components';
import {
  createHighlighter,
  type BundledLanguage,
  type BundledTheme,
  type HighlighterGeneric,
} from 'shiki/bundle/web';
import {
  DOCS_SHIKI_LANGUAGES,
  DOCS_SHIKI_THEMES,
  isDocsShikiLanguage,
  isDocsShikiTheme,
  normalizeDocsShikiValue,
} from './shiki-code-highlighter.constants';

type ShikiHighlighter = HighlighterGeneric<BundledLanguage, BundledTheme>;

let cachedHighlighter: ShikiHighlighter | null = null;

function extractCodeInnerHtml(shikiHtml: string): string {
  const codeOpenTagIndex = shikiHtml.indexOf('<code');
  if (codeOpenTagIndex < 0) {
    return shikiHtml;
  }

  const codeContentStart = shikiHtml.indexOf('>', codeOpenTagIndex);
  if (codeContentStart < 0) {
    return shikiHtml;
  }

  const codeCloseTagIndex = shikiHtml.lastIndexOf('</code>');
  if (codeCloseTagIndex < 0 || codeCloseTagIndex <= codeContentStart) {
    return shikiHtml;
  }

  return shikiHtml.slice(codeContentStart + 1, codeCloseTagIndex);
}

function unwrapShikiLineWrapper(lineHtml: string): string {
  const lineWrapperPattern = /^<span class=(['"])line\1>([\s\S]*)<\/span>$/;
  const match = lineWrapperPattern.exec(lineHtml);
  if (match === null) {
    return lineHtml;
  }

  return match[2];
}

function normalizeShikiHtmlForTailng(shikiHtml: string): string {
  const innerHtml = extractCodeInnerHtml(shikiHtml);
  return innerHtml
    .split('\n')
    .map((line) => unwrapShikiLineWrapper(line))
    .join('\n');
}

function getPreferredShikiThemeFromEnvironment(): (typeof DOCS_SHIKI_THEMES)[number] {
  const documentRef = globalThis.document;
  if (!documentRef?.documentElement) {
    return 'github-light';
  }

  const root = documentRef.documentElement;
  const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
  if (inlineColorScheme.includes('dark')) {
    return 'github-dark';
  }

  const computedColorScheme = globalThis
    .getComputedStyle(root)
    .getPropertyValue('color-scheme')
    .trim()
    .toLowerCase();
  if (computedColorScheme.includes('dark')) {
    return 'github-dark';
  }

  return 'github-light';
}

async function getOrCreateHighlighter(): Promise<ShikiHighlighter> {
  if (cachedHighlighter !== null) {
    return cachedHighlighter;
  }

  cachedHighlighter = await createHighlighter({
    themes: [...DOCS_SHIKI_THEMES],
    langs: [...DOCS_SHIKI_LANGUAGES],
  });

  return cachedHighlighter;
}

export const shikiCodeHighlighterAdapter = createTngCodeHighlighterAdapter(
  'shiki',
  async (input: TngCodeHighlightInput): Promise<TngCodeHighlightResult> => {
    const highlighter = await getOrCreateHighlighter();

    const requestedLanguage = normalizeDocsShikiValue(input.language ?? 'ts');
    const requestedTheme = normalizeDocsShikiValue(input.theme);
    const language = isDocsShikiLanguage(requestedLanguage) ? requestedLanguage : null;
    const theme = isDocsShikiTheme(requestedTheme)
      ? requestedTheme
      : getPreferredShikiThemeFromEnvironment();

    if (language === null) {
      return {
        html: input.code,
        kind: 'html',
        language: input.language,
        trustedHtml: false,
      };
    }

    const html = normalizeShikiHtmlForTailng(
      highlighter.codeToHtml(input.code, { lang: language, theme }),
    );

    return {
      html,
      kind: 'html',
      language: input.language,
      trustedHtml: true,
    };
  },
);
