import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-progress-bar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './progress-bar-styling-page.component.html',
  styleUrl: './progress-bar-styling-page.component.css',
})
export class ProgressBarStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly slotContractCode = [
    '[data-slot="progress-bar"] {',
    '  background: var(--tng-progress-bar-track, var(--tng-semantic-background-muted));',
    '  border-radius: var(--tng-progress-bar-radius, var(--tng-radius-control, 0.5rem));',
    '  height: var(--tng-progress-bar-height, 0.625rem);',
    '  overflow: hidden;',
    '}',
    '',
    '[data-slot="progress-bar-indicator"] {',
    '  background: var(--tng-progress-bar-indicator, var(--tng-semantic-accent-brand));',
    '  border-radius: inherit;',
    '  display: block;',
    '  height: 100%;',
    '}',
    '',
    '[data-slot="progress-bar-indicator"][data-indeterminate] {',
    '  animation: tng-progress-bar-indeterminate 1.1s ease-in-out infinite;',
    '}',
    '',
  ].join('\n');

  protected readonly defaultShellCode = [
    ':host {',
    '  display: block;',
    '  width: 100%;',
    '}',
    '',
    '.tng-progress-bar-indicator {',
    '  transition: width var(--tng-progress-bar-transition-duration, 180ms) ease;',
    '}',
    '',
    '@media (prefers-reduced-motion: reduce) {',
    '  .tng-progress-bar-indicator {',
    '    transition: none;',
    '  }',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
