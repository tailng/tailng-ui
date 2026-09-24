import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-code-editor-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './code-editor-styling-page.component.html',
  styleUrl: './code-editor-styling-page.component.css',
})
export class CodeEditorStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  protected readonly codeTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeTheme,
  );

  protected readonly tokensCode = [
    '.editor-shell {',
    '  --tng-code-editor-bg: #0b1220;',
    '  --tng-code-editor-border: #334155;',
    '  --tng-code-editor-fg: #dbeafe;',
    "  --tng-code-editor-font-family: 'Fira Code', monospace;",
    '  --tng-code-editor-line-height: 1.65;',
    '  --tng-code-editor-selection: rgb(59 130 246 / 32%);',
    '}',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
