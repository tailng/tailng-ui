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
  selector: 'docs-badge-api',
  templateUrl: './badge-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class BadgeApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngBadge } from '@tailng-ui/ui/primitives';`;

  private readonly seed: DisplayDetails[] = [
    { property: 'value', type: 'number | string | null', default: 'null', description: 'Badge content; null/undefined hides (unless dot)' },
    { property: 'dot', type: 'boolean', default: 'false', description: 'Dot mode (no number/text)' },
    { property: 'hide', type: 'boolean', default: 'false', description: 'Force hide' },
    { property: 'showZero', type: 'boolean', default: 'false', description: 'Show when value is 0' },
    { property: 'max', type: 'number', default: '99', description: 'Max before overflow (e.g. 99+)' },
    { property: 'position', type: 'TngBadgePosition', default: "'top-right'", description: 'top-right | top-left | bottom-right | bottom-left' },
    { property: 'overlap', type: 'boolean', default: 'true', description: 'Badge on top of host vs outside' },
    { property: 'variant', type: 'TngBadgeVariant', default: "'danger'", description: 'primary | neutral | success | warning | danger | info' },
    { property: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Badge size' },
    { property: 'ariaLabel', type: 'string', default: "''", description: 'Accessible label override' },
    { property: 'slot', type: 'TngSlotMap<TngBadgeSlot>', default: '{}', description: 'Slot-based micro styling (container, anchor, badge)' },
  ];

  readonly contentRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['value', 'dot', 'hide', 'showZero', 'max'].includes(p.property)));
  readonly layoutRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['position', 'overlap', 'variant', 'size', 'ariaLabel'].includes(p.property)));
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
