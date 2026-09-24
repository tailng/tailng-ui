import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeEditorComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-code-editor-examples-page',
  imports: [TngCodeEditorComponent],
  templateUrl: './code-editor-examples-page.component.html',
  styleUrl: './code-editor-examples-page.component.css',
})
export class CodeEditorExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  protected readonly codeTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeTheme,
  );

  protected readonly jsonSource = signal(
    ['{', '  "retries": 3,', '  "mode": "safe"', '}'].join('\n'),
  );
  protected readonly shellSource = signal('pnpm run test:components\npnpm run build:docs');
  protected readonly plainSource = signal('<unsafe> remains visible as text');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
