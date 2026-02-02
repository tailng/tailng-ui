import { Component, ElementRef, computed, input, viewChild, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TngCodeHighlighter, TngCodeLanguage } from './code-highlighter.type';

@Component({
  selector: 'tng-code-block',
  standalone: true,
  templateUrl: './code-block.component.html',
})
export class TngCodeBlock {
  private sanitizer = inject(DomSanitizer);

  // -------------------------
  // API
  // -------------------------
  content = input<string | null>(null);
  language = input<TngCodeLanguage>('text');
  showLineNumbers = input<boolean>(false);
  wrap = input<boolean>(false);
  highlighter = input<TngCodeHighlighter | null>(null);

  // -------------------------
  // klass hooks
  // -------------------------
  rootKlass = input<string>('');
  bodyKlass = input<string>('');
  gutterKlass = input<string>('');
  preKlass = input<string>('');
  codeKlass = input<string>('');

  private projectedEl = viewChild<ElementRef<HTMLElement>>('projected');

  readonly code = computed(() => {
    const c = this.content();
    if (c != null) return c;
    return this.projectedEl()?.nativeElement?.innerText ?? '';
  });

  readonly lines = computed(() => {
    const text = this.code();
    return text ? text.split(/\r\n|\r|\n/).length : 0;
  });

  readonly lineNumbers = computed(() =>
    Array.from({ length: this.lines() }, (_, i) => i + 1),
  );

  /**
   * IMPORTANT:
   * - Without highlighter: return escaped string (safe)
   * - With highlighter: return SafeHtml via bypassSecurityTrustHtml
   *   because Shiki uses inline styles which Angular sanitization strips.
   */
  readonly renderedHtml = computed((): string | SafeHtml => {
    const text = this.code();
    if (!text) return '';

    const h = this.highlighter();
    if (!h) return this.escapeHtml(text);

    const html = h.highlight(text, this.language());
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  // -------------------------
  // klass finals
  // -------------------------
  readonly rootKlassFinal = computed(() =>
    this.join(
      'relative rounded-lg border border-border bg-alternate-background text-fg',
      this.rootKlass(),
    ),
  );

  readonly bodyKlassFinal = computed(() => this.join('relative', this.bodyKlass()));

  readonly gutterKlassFinal = computed(() =>
    this.join(
      'absolute inset-y-0 left-0 w-10 select-none border-r border-border bg-bg px-2 py-4 text-right text-xs leading-6 text-fg/60',
      this.gutterKlass(),
    ),
  );

  readonly preKlassFinal = computed(() =>
    this.join(
      'overflow-auto p-4 text-xs leading-6 text-fg',
      this.showLineNumbers() ? 'pl-14' : '',
      this.wrap() ? 'whitespace-pre-wrap break-words' : 'whitespace-pre',
      this.preKlass(),
    ),
  );

  readonly codeKlassFinal = computed(() => this.join('block', this.codeKlass()));

  private join(...parts: Array<string | null | undefined>): string {
    return parts.map((p) => (p ?? '').trim()).filter(Boolean).join(' ');
  }

  private escapeHtml(s: string): string {
    return s
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
  
copyklass = input<string>(
  'absolute top-2 right-2 px-1 py-1 rounded cursor-pointer text-black text-xs'
);

copyLabel = input<string>('Copy');

  text = input<string>('');
  copied = signal(false);
  copyCode() {
    navigator.clipboard.writeText(this.text()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
