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
  selector: 'docs-select-api',
  templateUrl: './select-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class SelectApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngSelect } from '@tailng-ui/ui/form';`;

  private readonly seed: DisplayDetails[] = [
    { property: 'options', type: 'T[]', default: '[]', description: 'Options to display in the dropdown' },
    { property: 'value', type: 'T | null', default: 'null', description: 'Controlled value (overrides form when set)' },
    { property: 'placeholder', type: 'string', default: "'Select…'", description: 'Text when no selection' },
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { property: 'displayWith', type: '(item: T) => string', default: '(v) => String(v)', description: 'Format option for display' },
    { property: 'selected', type: 'OutputEventEmitter<T>', default: '—', description: 'Emits when user selects an option' },
    { property: 'closed', type: 'OutputEventEmitter<SelectCloseReason>', default: '—', description: 'Emits when overlay closes' },
    { property: 'slot', type: 'TngSlotMap<TngSelectSlot>', default: '{}', description: 'Slot-based micro styling object' },
  ];

  readonly inputRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['options', 'value', 'placeholder', 'disabled', 'displayWith'].includes(p.property)));
  readonly outputRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['selected', 'closed'].includes(p.property)));
  readonly stylingRows = signal<DisplayDetails[]>(this.seed.filter((p) => p.property === 'slot'));

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
