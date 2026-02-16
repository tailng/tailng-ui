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
  selector: 'docs-button-toggle-api',
  templateUrl: './button-toggle-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class ButtonToggleApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngButtonToggle } from '@tailng-ui/ui/form';`;

  private readonly seed: DisplayDetails[] = [
    { property: 'options', type: 'TngButtonToggleOption<T>[]', default: '[]', description: 'Options (value, label, disabled?)' },
    { property: 'value', type: 'TngButtonToggleSelection<T>', default: 'null', description: 'Controlled value (overrides form when set)' },
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { property: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple selection' },
    { property: 'allowDeselect', type: 'boolean', default: 'false', description: 'Allow clearing selection' },
    { property: 'valueChange', type: 'OutputEventEmitter<TngButtonToggleSelection<T>>', default: '—', description: 'Emits when selection changes' },
    { property: 'slot', type: 'TngSlotMap<TngButtonToggleSlot>', default: '{}', description: 'Slot-based micro styling (container, button, buttonActive, buttonInactive, buttonDisabled)' },
  ];

  readonly inputRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['options', 'value', 'disabled', 'multiple', 'allowDeselect'].includes(p.property)));
  readonly outputRows = signal<DisplayDetails[]>(this.seed.filter((p) => p.property === 'valueChange'));
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
