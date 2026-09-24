import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngCodeEditorComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-code-editor-overview-page',
  imports: [TngCodeBlockComponent, TngCodeEditorComponent],
  templateUrl: './code-editor-overview-page.component.html',
  styleUrl: './code-editor-overview-page.component.css',
})
export class CodeEditorOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeTheme,
  );

  protected readonly source = signal(
    [
      'def greet(name: str) -> str:',
      '    return f"Hello, {name}!"',
      '',
      'print(greet("TailNG"))',
    ].join('\n'),
  );
  protected readonly importCode = "import { TngCodeEditorComponent } from '@tailng-ui/components';";
  protected readonly providerCode = [
    'provideTngCodeHighlighting({',
    '  adapters: [shikiCodeHighlighterAdapter],',
    "  defaultAdapter: 'shiki',",
    '});',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
