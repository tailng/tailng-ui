import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-date-range-picker-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './date-range-picker-styling-page.component.html',
  styleUrl: './date-range-picker-styling-page.component.css',
})
export class HeadlessDateRangePickerStylingPageComponent {
  protected readonly compactThemeCode = [
    '.release-date-range-picker {',
    '  color-scheme: light;',
    '  --tng-date-range-picker-radius: 1rem;',
    '  --tng-date-range-picker-field-height: 2.9rem;',
    '  --tng-date-range-picker-overlay-gap: 0.56rem;',
    '  --tng-date-range-picker-overlay-padding: 0.72rem;',
    '  --tng-date-range-picker-grid-gap: clamp(0.14rem, 1.15%, 0.28rem);',
    '  --tng-date-range-picker-inline-gap: 0.36rem;',
    '  --tng-date-range-picker-day-cell-size: 2.2rem;',
    '  --tng-date-range-picker-picker-cell-size: 2.3rem;',
    '  --tng-date-range-picker-nav-size: 1.95rem;',
    '  --tng-date-range-picker-z-overlay: 80;',
    '  --tng-date-range-picker-bg: #ffffff;',
    '  --tng-date-range-picker-surface: #f8fafc;',
    '  --tng-date-range-picker-canvas: #ffffff;',
    '  --tng-date-range-picker-fg: #0f172a;',
    '  --tng-date-range-picker-muted: #64748b;',
    '  --tng-date-range-picker-brand: #2563eb;',
    '  --tng-date-range-picker-border: #cbd5e1;',
    '  --tng-date-range-picker-border-strong: #94a3b8;',
    '  --tng-date-range-picker-focus: #2563eb;',
    '  --tng-date-range-picker-focus-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);',
    '  --tng-date-range-picker-shadow:',
    '    0 22px 38px rgba(15, 23, 42, 0.12),',
    '    0 10px 20px rgba(15, 23, 42, 0.08);',
    '}',
    '',
  ].join('\n');
}
