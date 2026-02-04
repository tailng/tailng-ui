import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tociva/tailng-ui/table';
import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = { property: string; type: string; default?: string; description: string };

@Component({
  standalone: true,
  selector: 'docs-popover-api',
  templateUrl: './popover-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class PopoverApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () =>
    `import { TngPopover, TngPopoverPlacement, TngPopoverCloseReason } from '@tociva/tailng-ui/overlay';`;

  private readonly inputSeed: DisplayDetails[] = [
    { property: 'open', type: 'boolean | null', default: 'null', description: 'Controlled open state (null = uncontrolled)' },
    { property: 'placement', type: 'TngPopoverPlacement', default: "'bottom-start'", description: 'bottom-start | bottom-end | top-start | top-end' },
    { property: 'offset', type: 'number', default: '6', description: 'Gap between trigger and panel' },
    { property: 'width', type: "'anchor' | number", default: "'anchor'", description: 'Panel width: anchor width or pixel value' },
    { property: 'closeOnOutsideClick', type: 'boolean', default: 'true', description: 'Close when clicking outside' },
    { property: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close on Escape key' },
  ];
  private readonly outputSeed: DisplayDetails[] = [
    { property: 'opened', type: 'void', description: 'Emitted when popover opens' },
    { property: 'closed', type: 'TngPopoverCloseReason', description: 'Emitted when popover closes (outside-click | escape | programmatic)' },
    { property: 'openChange', type: 'boolean', description: 'Emitted when open state changes (for controlled usage)' },
  ];
  private readonly klassSeed: DisplayDetails[] = [
    { property: 'rootKlass', type: 'string', default: "'relative inline-flex'", description: 'Root wrapper' },
    { property: 'triggerKlass', type: 'string', default: "'inline-flex'", description: 'Trigger button' },
    { property: 'panelKlass', type: 'string', default: "'p-2'", description: 'Panel content wrapper' },
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
