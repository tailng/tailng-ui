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
};

@Component({
  standalone: true,
  selector: 'docs-autocomplete-api',
  templateUrl: './autocomplete-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol, TngTag],
})
export class AutocompleteApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);

  readonly importExample = computed(() => `import { TngAutocomplete } from '@tailng-ui/ui/form';`);

  private readonly seed: displayDetails[] = [
    { property: 'options', type: 'T[]', default: '[]', description: 'Options shown in the dropdown' },
    { property: 'displayWith', type: '(item: T) => string', default: '(v) => String(v)', description: 'String for input and list display' },
    { property: 'placeholder', type: 'string', default: "'Start typing…'", description: 'Input placeholder' },
    { property: 'inputKlass', type: 'string', default: "''", description: 'CSS classes for the input element' },
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { property: 'search', type: 'OutputEventEmitter<string>', default: '—', description: 'Emits current input text when user types' },
    { property: 'selected', type: 'OutputEventEmitter<T>', default: '—', description: 'Emits selected item (non-form usage)' },
    { property: 'closed', type: 'OutputEventEmitter<AutocompleteCloseReason>', default: '—', description: 'Emits when overlay closes (selection/escape/blur/outside)' },
  ];

  readonly inputRows = signal<displayDetails[]>(this.seed.filter((p) =>
    ['options', 'displayWith', 'placeholder', 'inputKlass', 'disabled'].includes(p.property)
  ));
  readonly outputRows = signal<displayDetails[]>(this.seed.filter((p) =>
    ['search', 'selected', 'closed'].includes(p.property)
  ));

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
