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
  selector: 'docs-skeleton-api',
  templateUrl: './skeleton-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class SkeletonApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngSkeleton } from '@tailng-ui/ui/primitives';`;

  private readonly seed: DisplayDetails[] = [
    { property: 'variant', type: "'text' | 'circular' | 'rectangular'", default: "'text'", description: 'Shape variant' },
    { property: 'widthClass', type: 'string', default: "'w-full'", description: 'Tailwind width classes' },
    { property: 'heightClass', type: 'string', default: "'h-4'", description: 'Tailwind height classes' },
    { property: 'width', type: 'string', default: "''", description: 'Exact CSS width (e.g. 240px, 60%)' },
    { property: 'height', type: 'string', default: "''", description: 'Exact CSS height' },
    { property: 'shimmer', type: 'boolean', default: 'false', description: 'Shimmer animation (else pulse)' },
    { property: 'slot', type: 'TngSlotMap<TngSkeletonSlot>', default: '{}', description: 'Slot-based micro styling (container)' },
  ];

  readonly contentRows = signal<DisplayDetails[]>(
    this.seed.filter((p) => ['variant', 'widthClass', 'heightClass', 'width', 'height', 'shimmer'].includes(p.property)),
  );
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
      { rootMargin: '-50% 0px -50% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
  }
}
