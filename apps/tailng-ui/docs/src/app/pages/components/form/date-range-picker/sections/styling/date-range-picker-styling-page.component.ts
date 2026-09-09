import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-date-range-picker-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './date-range-picker-styling-page.component.html',
  styleUrl: './date-range-picker-styling-page.component.css',
})
export class DateRangePickerStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly themeAwareShellCode = [
    '.theme-aware-date-range-picker-shell {',
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
    '.booking-date-range-picker {',
    '  --tng-date-range-picker-radius: 0.9rem;',
    '  --tng-date-range-picker-field-height: 2.8rem;',
    '  --tng-date-range-picker-overlay-padding: 0.72rem;',
    '  --tng-date-range-picker-grid-gap: clamp(0.12rem, 1.15%, 0.28rem);',
    '  --tng-date-range-picker-day-cell-size: 2.15rem;',
    '  --tng-date-range-picker-picker-cell-size: 2.25rem;',
    '  --tng-date-range-picker-z-overlay: 80;',
    '  --tng-date-range-picker-brand: var(--tng-semantic-accent-brand);',
    '  --tng-date-range-picker-focus: var(--tng-semantic-focus-ring);',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
