import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-datepicker-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './datepicker-styling-page.component.html',
  styleUrl: './datepicker-styling-page.component.css',
})
export class DatepickerStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly themeAwareShellCode = [
    '.theme-aware-datepicker-shell {',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  color: var(--tng-semantic-foreground-primary);',
    '  background: linear-gradient(',
    '    180deg,',
    '    color-mix(in srgb, var(--tng-semantic-background-base) 92%, var(--tng-semantic-background-surface) 8%),',
    '    color-mix(in srgb, var(--tng-semantic-background-base) 76%, var(--tng-semantic-background-surface) 24%)',
    '  );',
    '}',
    '',
  ].join('\n');

  protected readonly compactThemeCode = [
    '.booking-datepicker {',
    '  --tng-datepicker-radius: 0.9rem;',
    '  --tng-datepicker-field-height: 2.8rem;',
    '  --tng-datepicker-overlay-padding: 0.72rem;',
    '  --tng-datepicker-grid-gap: clamp(0.12rem, 1.15%, 0.28rem);',
    '  --tng-datepicker-day-cell-size: 2.15rem;',
    '  --tng-datepicker-picker-cell-size: 2.25rem;',
    '  --tng-datepicker-z-overlay: 80;',
    '  --tng-datepicker-brand: var(--tng-semantic-accent-brand);',
    '  --tng-datepicker-focus: var(--tng-semantic-focus-ring);',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
