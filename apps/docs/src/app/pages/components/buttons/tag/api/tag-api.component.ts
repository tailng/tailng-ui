import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tailng-ui/ui/table';
import { TngCodeBlock } from '@tailng-ui/ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = {
  property: string;
  type: string;
  default?: string;
  description: string;
};

@Component({
  standalone: true,
  selector: 'docs-tag-api',
  templateUrl: './tag-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class TagApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngTag } from '@tailng-ui/ui/primitives';`;

  private readonly seed: DisplayDetails[] = [
    { property: 'label', type: 'string | null', default: "'Text'", description: 'Tag text' },
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { property: 'color', type: "'default' | 'primary' | 'success' | 'danger'", default: "'default'", description: 'Visual variant' },
    { property: 'slot', type: 'TngSlotMap<TngTagSlot>', default: '{}', description: 'Slot-based micro styling (container)' },
  ];

  readonly inputRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['label', 'disabled', 'color'].includes(p.property)));
  readonly stylingRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['slot'].includes(p.property)));

  readonly property = (r: DisplayDetails) => r.property;
  readonly type = (r: DisplayDetails) => r.type;
  readonly default = (r: DisplayDetails) => r.default;
  readonly description = (r: DisplayDetails) => r.description;

  ngAfterViewInit() {
    const sections = document.querySelectorAll('section[id]');
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
