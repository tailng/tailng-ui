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
  selector: 'docs-progress-bar-api',
  templateUrl: './progress-bar-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class ProgressBarApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngProgressBar } from '@tailng-ui/ui/primitives';`;

  private readonly seed: DisplayDetails[] = [
    { property: 'mode', type: "'determinate' | 'indeterminate'", default: "'determinate'", description: 'Progress bar mode' },
    { property: 'value', type: 'number', default: '0', description: 'Current progress value (0–max)' },
    { property: 'max', type: 'number', default: '100', description: 'Maximum value for percentage calculation' },
    { property: 'disableAnimation', type: 'boolean', default: 'false', description: 'Disable indeterminate animation (reduced motion)' },
    { property: 'slot', type: 'TngSlotMap<TngProgressBarSlot>', default: '{}', description: 'Slot-based micro styling (container, track, indicator)' },
  ];

  readonly contentRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['mode', 'value', 'max', 'disableAnimation'].includes(p.property)));
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
