import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-headless-datepicker-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './datepicker-styling-page.component.html',
  styleUrl: './datepicker-styling-page.component.css',
})
export class HeadlessDatepickerStylingPageComponent {
  protected readonly compactThemeCode = [
    '.release-datepicker {',
    '  color-scheme: light;',
    '  --tng-datepicker-radius: 1rem;',
    '  --tng-datepicker-field-height: 2.9rem;',
    '  --tng-datepicker-overlay-gap: 0.56rem;',
    '  --tng-datepicker-overlay-padding: 0.72rem;',
    '  --tng-datepicker-grid-gap: clamp(0.14rem, 1.15%, 0.28rem);',
    '  --tng-datepicker-inline-gap: 0.36rem;',
    '  --tng-datepicker-day-cell-size: 2.2rem;',
    '  --tng-datepicker-picker-cell-size: 2.3rem;',
    '  --tng-datepicker-nav-size: 1.95rem;',
    '  --tng-datepicker-z-overlay: 80;',
    '  --tng-datepicker-bg: #ffffff;',
    '  --tng-datepicker-surface: #f8fafc;',
    '  --tng-datepicker-canvas: #ffffff;',
    '  --tng-datepicker-fg: #0f172a;',
    '  --tng-datepicker-muted: #64748b;',
    '  --tng-datepicker-brand: #2563eb;',
    '  --tng-datepicker-border: #cbd5e1;',
    '  --tng-datepicker-border-strong: #94a3b8;',
    '  --tng-datepicker-focus: #2563eb;',
    '  --tng-datepicker-focus-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);',
    '  --tng-datepicker-shadow:',
    '    0 22px 38px rgba(15, 23, 42, 0.12),',
    '    0 10px 20px rgba(15, 23, 42, 0.08);',
    '}',
    '',
  ].join('\n');
}
