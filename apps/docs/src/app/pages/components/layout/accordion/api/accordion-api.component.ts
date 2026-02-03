import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tociva/tailng-ui/table';
import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = { property: string; type: string; default?: string; description: string };

@Component({
  standalone: true,
  selector: 'docs-accordion-api',
  templateUrl: './accordion-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class AccordionApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () =>
    `import { TngAccordion, TngExpansionPanel } from '@tociva/tailng-ui/layout';`;

  private readonly inputSeed: DisplayDetails[] = [
    { property: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple panels open at once' },
    { property: 'collapsible', type: 'boolean', default: 'true', description: 'If false, at least one panel stays open' },
    { property: 'autoOpenFirst', type: 'boolean', default: 'false', description: 'Open the first panel on init when none open' },
  ];
  private readonly outputSeed: DisplayDetails[] = [
    { property: 'openIndexesChange', type: 'EventEmitter<number[]>', description: 'Emitted when open panel indexes change' },
  ];
  private readonly klassSeed: DisplayDetails[] = [
    { property: 'rootKlass', type: 'string', default: "'w-full'", description: 'Root wrapper' },
    { property: 'stackKlass', type: 'string', default: "'space-y-2'", description: 'Container for panel list' },
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
