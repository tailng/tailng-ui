import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-fileupload-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './fileupload-styling-page.component.html',
  styleUrl: './fileupload-styling-page.component.css',
})
export class FileUploadStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly contractCss = [
    '/* Base drop zone */\n',
    '[tngFileUpload] {',
    '  background: var(--tng-control-bg);',
    '  border: 2px dashed var(--tng-control-border);',
    '  border-radius: var(--tng-control-radius);',
    '  padding: 2rem;',
    '  transition: var(--tng-transition-colors);',
    '}',
    '',
    '/* Active drag state */\n',
    '[tngFileUpload][data-dragging] {',
    '  background: color-mix(in srgb, var(--tng-control-accent) 8%, var(--tng-control-bg));',
    '  border-color: var(--tng-control-accent);',
    '}',
    '',
    '/* Disabled state */\n',
    '[tngFileUpload][data-disabled] {',
    '  cursor: not-allowed;',
    '  opacity: 0.55;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
