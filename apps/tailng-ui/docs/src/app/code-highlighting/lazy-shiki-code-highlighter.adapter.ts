import {
  createTngCodeHighlighterAdapter,
  type TngCodeHighlighterAdapter,
  type TngCodeHighlightInput,
  type TngCodeHighlightResult,
} from '@tailng-ui/components';
import { isDocsShikiLanguage } from './shiki-code-highlighter.constants';

let shikiAdapterPromise: Promise<TngCodeHighlighterAdapter> | null = null;

function loadShikiCodeHighlighterAdapter(): Promise<TngCodeHighlighterAdapter> {
  shikiAdapterPromise ??= import('./shiki-code-highlighter.adapter').then(
    (module) => module.shikiCodeHighlighterAdapter,
  );

  return shikiAdapterPromise;
}

export const lazyShikiCodeHighlighterAdapter = createTngCodeHighlighterAdapter(
  'shiki',
  async (input: TngCodeHighlightInput): Promise<TngCodeHighlightResult> => {
    const shikiAdapter = await loadShikiCodeHighlighterAdapter();
    return shikiAdapter.highlight(input);
  },
  (language: string | null): boolean => language === null || isDocsShikiLanguage(language),
);
