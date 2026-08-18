import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-tabs-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './tabs-styling-page.component.html',
})
export class TabsStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly contractCss = [
    '.project-tabs {',
    '  --tng-tabs-radius: 1.25rem;',
    '  --tng-tabs-tab-height: 2.75rem;',
    '  --tng-tabs-tab-px: 1.1rem;',
    '  --tng-tabs-panel-padding: 1.25rem;',
    '  --tng-tabs-brand: var(--project-accent);',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
