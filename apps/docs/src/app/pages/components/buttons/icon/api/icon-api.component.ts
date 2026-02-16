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
  selector: 'docs-icon-api',
  templateUrl: './icon-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class IconApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngIcon } from '@tailng-ui/icons/icon';`;

  private readonly seed: DisplayDetails[] = [
    { property: 'name', type: 'string', default: '—', description: 'Icon name from @ng-icons registry (required)' },
    { property: 'size', type: 'number | string', default: "'1em'", description: 'Number => px; string => as-is (e.g. 1em, 20px)' },
    { property: 'slot', type: 'TngSlotMap<TngIconSlot>', default: '{}', description: 'Slot-based micro styling (icon)' },
    { property: 'decorative', type: 'boolean', default: 'true', description: 'true => aria-hidden; false => use ariaLabel' },
    { property: 'ariaLabel', type: 'string', default: "''", description: 'Accessible label when decorative=false' },
  ];

  readonly inputRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['name', 'size', 'decorative', 'ariaLabel'].includes(p.property)));
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
