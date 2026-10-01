import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-popover-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './popover-styling-page.component.html',
  styleUrl: './popover-styling-page.component.css',
})
export class PopoverStylingPageComponent {
  protected readonly stylingContractCode = [
    'tng-popover {',
    '  --tng-popover-panel-radius: 0.9rem;',
    '  --tng-popover-z-overlay: 60;',
    '}',
    '',
    '[data-slot="popover-trigger"] {',
    '  border-radius: 0.65rem;',
    '}',
    '',
    '[data-slot="popover-panel"] {',
    '  background: var(--tng-semantic-background-surface);',
    '  border: 1px solid var(--tng-semantic-border-strong);',
    '  border-radius: 0.9rem;',
    '  display: grid;',
    '  gap: 0.75rem;',
    '  min-width: 16rem;',
    '  max-width: min(24rem, 90vw);',
    '  padding: 1rem;',
    '  box-shadow: 0 22px 42px color-mix(in srgb, var(--tng-semantic-foreground-primary) 22%, transparent);',
    '}',
    '',
    '[data-slot="popover-close"] {',
    '  border-radius: 0.6rem;',
    '  min-height: 2rem;',
    '}',
    '',
    '[data-slot="popover-panel"][hidden] {',
    '  display: none !important;',
    '}',
  ].join('\n');
}
