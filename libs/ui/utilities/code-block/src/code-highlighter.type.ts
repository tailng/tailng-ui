export type TngCodeLanguage =
  | 'text'
  | 'bash'
  | 'json'
  | 'typescript'
  | 'ts'
  | 'html'
  | 'css';

export type TngHighlightedHtml = string;

export interface TngCodeHighlighter {
  /**
   * Must return HTML-safe highlighted output (no <script>, etc).
   * Code-block will inject this via [innerHTML].
   */
  highlight(code: string, language: TngCodeLanguage): TngHighlightedHtml;
}