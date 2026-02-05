import type { TngCodeHighlighter, TngCodeLanguage } from '@tailng-ui/ui/utilities';
import { DemoShikiHighlighterService } from './demo-shiki-highlighter.service';

const langMap: Record<TngCodeLanguage, string> = {
  text: 'text',
  bash: 'bash',
  json: 'json',
  typescript: 'typescript',
  ts: 'typescript',
  html: 'html',
  css: 'css',
};

export class TngShikiAdapter implements TngCodeHighlighter {
  constructor(private readonly shiki: DemoShikiHighlighterService) {}

  highlight(code: string, language: TngCodeLanguage): string {
    const html = this.shiki.toHtml(code, langMap[language], 'github-light');
    return extractInnerCodeHtml(html);
  }
}

/**
 * Shiki typically returns:
 * <pre class="shiki" ...><code>...</code></pre>
 *
 * We return ONLY the inner HTML inside <code>.
 * That way Tailng controls padding/scroll/line-height/line-numbers.
 */
function extractInnerCodeHtml(shikiHtml: string): string {
  // Fast path (works for normal Shiki output)
  const m = shikiHtml.match(/<code[^>]*>([\s\S]*?)<\/code>/i);
  if (m?.[1] != null) return m[1];

  // Fallback: DOMParser if markup differs
  try {
    const doc = new DOMParser().parseFromString(shikiHtml, 'text/html');
    const codeEl = doc.querySelector('code');
    return codeEl?.innerHTML ?? escapeHtmlFallback(shikiHtml);
  } catch {
    return escapeHtmlFallback(shikiHtml);
  }
}

function escapeHtmlFallback(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}