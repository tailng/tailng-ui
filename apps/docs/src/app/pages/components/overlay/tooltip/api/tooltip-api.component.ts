import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tociva/tailng-ui/table';
import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = { property: string; type: string; default?: string; description: string };

@Component({
  standalone: true,
  selector: 'docs-tooltip-api',
  templateUrl: './tooltip-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class TooltipApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () =>
    `import { TngTooltip, TngTooltipPlacement, TngTooltipCloseReason } from '@tociva/tailng-ui/overlay';`;

  private readonly inputSeed: DisplayDetails[] = [
    { property: 'text', type: 'string', default: "''", description: 'Simple text tooltip' },
    { property: 'contentTpl', type: 'TemplateRef<unknown> | null', default: 'null', description: 'Explicit template (overrides #tooltipContent)' },
    { property: 'placement', type: 'TngTooltipPlacement', default: "'top-start'", description: 'bottom-start | bottom-end | top-start | top-end' },
    { property: 'offset', type: 'number', default: '8', description: 'Gap between trigger and panel' },
    { property: 'showDelay', type: 'number', default: '250', description: 'Delay before showing (ms)' },
    { property: 'hideDelay', type: 'number', default: '100', description: 'Delay before hiding (ms)' },
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disables showing tooltip' },
  ];
  private readonly outputSeed: DisplayDetails[] = [
    { property: 'opened', type: 'void', description: 'Emitted when tooltip opens' },
    { property: 'closed', type: 'TngTooltipCloseReason', description: 'Emitted when tooltip closes (escape | blur | programmatic)' },
  ];
  private readonly klassSeed: DisplayDetails[] = [
    { property: 'panelKlass', type: 'string', default: "'px-3 py-2 text-xs text-foreground'", description: 'Inner content padding/text' },
    { property: 'surfaceKlass', type: 'string', default: "'rounded-md border border-border bg-bg shadow-md'", description: 'Outer panel (border, shadow)' },
  ];

  readonly inputRows = signal<DisplayDetails[]>(this.inputSeed);
  readonly outputRows = signal<DisplayDetails[]>(this.outputSeed);
  readonly klassRows = signal<DisplayDetails[]>(this.klassSeed);
  readonly property = (r: DisplayDetails) => r.property;
  readonly type = (r: DisplayDetails) => r.type;
  readonly default = (r: DisplayDetails) => r.default ?? '—';
  readonly description = (r: DisplayDetails) => r.description;

  ngAfterViewInit() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const links = document.querySelectorAll('.scroll-link');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id');
          const link = document.querySelector(`.scroll-link[href="#${id}"]`);
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove('text-blue-500', 'font-semibold'));
            link?.classList.add('text-blue-500', 'font-semibold');
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
  }
}
