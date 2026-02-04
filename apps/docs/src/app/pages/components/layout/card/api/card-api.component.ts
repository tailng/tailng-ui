import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tociva/tailng-ui/table';
import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
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
  selector: 'docs-card-api',
  templateUrl: './card-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class CardApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngCard, TngCardHeader, TngCardFooter } from '@tociva/tailng-ui/layout';`;

  private readonly seed: DisplayDetails[] = [
    { property: 'rootKlass', type: 'string', default: "''", description: 'Root wrapper (merged with default border, rounded, shadow)' },
    { property: 'headerKlass', type: 'string', default: "''", description: 'Header section' },
    { property: 'contentKlass', type: 'string', default: "''", description: 'Body section' },
    { property: 'footerKlass', type: 'string', default: "''", description: 'Footer section' },
    { property: 'klass', type: 'string', default: "''", description: 'Extra classes merged on root' },
  ];

  readonly klassRows = signal<DisplayDetails[]>(this.seed);

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
