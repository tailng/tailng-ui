import { AfterViewInit, Component, computed, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tailng-ui/ui/table';
import { TngCodeBlock } from '@tailng-ui/ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type displayDetails = {
  property: string;
  type: string;
  default?: string;
  description: string;
};

@Component({
  standalone: true,
  selector: 'docs-checkbox-api',
  templateUrl: './checkbox-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class CheckboxApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = computed(() => `import { TngCheckbox } from '@tailng-ui/ui/form';`);

  private readonly seed: displayDetails[] = [
    { property: 'id', type: 'string', default: "''", description: 'Input element id' },
    { property: 'name', type: 'string', default: "''", description: 'Input name' },
    { property: 'label', type: 'string', default: "''", description: 'Optional label text next to the checkbox' },
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { property: 'required', type: 'boolean', default: 'false', description: 'Required (HTML attribute)' },
    { property: 'rootKlass', type: 'string', default: "'inline-flex items-center gap-2 cursor-pointer select-none'", description: 'Classes for the root <label>' },
    { property: 'inputKlass', type: 'string', default: "''", description: 'Classes for the <input type="checkbox">' },
    { property: 'labelKlass', type: 'string', default: "'text-sm text-fg'", description: 'Classes for the label <span>' },
  ];

  readonly basicRows = signal<displayDetails[]>(this.seed.filter((p) => ['id', 'name', 'label'].includes(p.property)));
  readonly stateRows = signal<displayDetails[]>(this.seed.filter((p) => ['disabled', 'required'].includes(p.property)));
  readonly klassRows = signal<displayDetails[]>(this.seed.filter((p) => ['rootKlass', 'inputKlass', 'labelKlass'].includes(p.property)));

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
