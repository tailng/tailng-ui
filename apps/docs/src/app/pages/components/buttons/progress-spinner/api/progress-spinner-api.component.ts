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
  selector: 'docs-progress-spinner-api',
  templateUrl: './progress-spinner-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class ProgressSpinnerApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngProgressSpinner } from '@tailng-ui/ui/primitives';`;

  private readonly seed: DisplayDetails[] = [
    { property: 'mode', type: "'indeterminate' | 'determinate'", default: "'indeterminate'", description: 'Spinner mode' },
    { property: 'value', type: 'number', default: '0', description: 'Current progress (0–max) for determinate' },
    { property: 'max', type: 'number', default: '100', description: 'Maximum value for percentage' },
    { property: 'strokeWidth', type: 'number', default: '4', description: 'SVG stroke width' },
    { property: 'slot', type: 'TngSlotMap<TngProgressSpinnerSlot>', default: '{}', description: 'Slot-based micro styling (container, svg, track, indicator)' },
  ];

  readonly contentRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['mode', 'value', 'max', 'strokeWidth'].includes(p.property)));
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
