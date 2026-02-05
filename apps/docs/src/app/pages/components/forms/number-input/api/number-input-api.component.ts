import { AfterViewInit, Component, computed, inject, signal } from '@angular/core';
import { TngCodeBlock } from '@tailng-ui/ui/utilities';
import { TngTable, TngCol } from '@tailng-ui/ui/table';
import { TngTag } from '@tailng-ui/ui/primitives';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type displayDetails = {
  property: string;
  type: string;
  default?: string;
  description: string;
  state?: displayDetails[];
};

@Component({
  standalone: true,
  selector: 'docs-number-input-api',
  templateUrl: './number-input-api.component.html',
  imports: [
    TngCodeBlock,
    TngTable,
    TngCol,
    TngTag,
  ],
})
export class NumberInputApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);

  readonly inputKlassExample = computed(() => `import { TngNumberInput } from '@tailng-ui/ui/form';`);

  private readonly seed: displayDetails[] = [
    { property: 'id', type: 'string', default: '', description: 'Input element id' },
    { property: 'name', type: 'string', default: '', description: 'Input name' },
    { property: 'placeholder', type: 'string', default: '', description: 'Placeholder text' },

    // STATE
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { property: 'readonly', type: 'boolean', default: 'false', description: 'Readonly state' },

    // numeric constraints
    { property: 'min', type: 'number | null', default: 'null', description: 'Minimum value (clamped on blur)' },
    { property: 'max', type: 'number | null', default: 'null', description: 'Maximum value (clamped on blur)' },
    { property: 'step', type: 'number | \'any\' | null', default: 'null', description: 'Step for stepper and validation (e.g. 1, 0.01, \'any\')' },

    // browser hints
    { property: 'autocomplete', type: 'string', default: 'off', description: "Browser hints: 'on' | 'off'" },
    { property: 'inputmode', type: '\'numeric\' | \'decimal\'', default: '\'decimal\'', description: 'Mobile keypad hint' },

    // theming
    { property: 'klass', type: 'string', default: '', description: 'Additional CSS classes applied to the input element' },
  ];

  readonly basicRows = signal<displayDetails[]>(
    this.seed.filter((p) => ['id', 'name', 'placeholder'].includes(p.property)),
  );

  readonly stateRows = signal<displayDetails[]>(
    this.seed.filter((p) => ['disabled', 'readonly'].includes(p.property)),
  );

  readonly numericRows = signal<displayDetails[]>(
    this.seed.filter((p) => ['min', 'max', 'step'].includes(p.property)),
  );

  readonly browserHintsRows = signal<displayDetails[]>(
    this.seed.filter((p) => ['autocomplete', 'inputmode'].includes(p.property)),
  );

  readonly klassRows = signal<displayDetails[]>(
    this.seed.filter((p) => ['klass'].includes(p.property)),
  );

  readonly property = (r: displayDetails) => r.property;
  readonly type = (r: displayDetails) => r.type;
  readonly default = (r: displayDetails) => r.default;
  readonly description = (r: displayDetails) => r.description;

  ngAfterViewInit() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.scroll-link');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id');
          const link = document.querySelector(`.scroll-link[href="#${id}"]`);
          if (entry.isIntersecting) {
            links.forEach(l => l.classList.remove('text-blue-500', 'font-semibold'));
            link?.classList.add('text-blue-500', 'font-semibold');
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }
}
