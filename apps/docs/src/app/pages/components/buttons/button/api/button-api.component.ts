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
  selector: 'docs-button-api',
  templateUrl: './button-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class ButtonApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngButton } from '@tailng-ui/ui/primitives';`;

  private readonly seed: DisplayDetails[] = [
    { property: 'variant', type: "'solid' | 'outline' | 'ghost'", default: "'solid'", description: 'Visual variant' },
    { property: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size' },
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { property: 'loading', type: 'boolean', default: 'false', description: 'Shows spinner, disables click' },
    { property: 'block', type: 'boolean', default: 'false', description: 'Full width' },
    { property: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Button type' },
    { property: 'ariaLabel', type: 'string', default: "''", description: 'Accessibility label (recommended for icon-only)' },
    { property: 'pressed', type: 'boolean | null', default: 'null', description: 'aria-pressed for toggle' },
    { property: 'slot', type: 'TngSlotMap<TngButtonSlot>', default: '{}', description: 'Slot-based micro styling (button, spinner)' },
  ];

  readonly inputRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['variant', 'size', 'disabled', 'loading', 'block', 'type', 'ariaLabel', 'pressed'].includes(p.property)));
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
