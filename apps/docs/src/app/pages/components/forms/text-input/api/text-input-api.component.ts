import { AfterViewInit, Component, computed, inject, signal } from '@angular/core';
import { TngCodeBlock } from '@tociva/tailng-ui/utilities';
import { TngTable, TngCol } from '@tociva/tailng-ui/data-table-structure';
import { TngTag } from '@tociva/tailng-ui/buttons-indicators';
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
  selector: 'docs-text-input-api',
  templateUrl: './text-input-api.component.html',
  imports: [
    TngCodeBlock,
    TngTable,
    TngCol,
    TngTag,
  ],
})
export class TextInputApiComponent implements AfterViewInit {
private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  
   readonly inputKlassExample = computed(() => `import { TngTextInput } from '@tociva/tailng-ui';`);


  private readonly seed: displayDetails[] = [
    { property: 'id', type: 'string', default: '', description: 'Input element id' },
    { property: 'name', type: 'string', default: '', description: 'Input name' },
    {
      property: 'type',
      type: 'text | email | password | search | tel | url',
      default: 'text',
      description: 'Type of input',
    },
    { property: 'placeholder', type: 'string', default: '', description: 'Placeholder text' },

    // STATE
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { property: 'readonly', type: 'boolean', default: 'false', description: 'Readonly state' },

    // validation
    { property: 'minlength', type: 'number', default: 'null', description: 'Minimum length' },
    { property: 'maxlength', type: 'number', default: 'null', description: 'Maximum length' },
    { property: 'pattern', type: 'string', default: 'null', description: 'Pattern to match the input value' },

    // browser Hints
    { property: 'autocomplete',type: 'string',default: 'off',description: "Browser hints: 'on' | 'off'"},
    { property: 'input mode', type: 'string', default: 'text', description: '' },
  ];

  readonly basicRows = signal<displayDetails[]>(
    this.seed.filter((p) => ['id', 'name', 'type', 'placeholder'].includes(p.property)),
  );

  readonly stateRows = signal<displayDetails[]>(
    this.seed.filter((p) => ['disabled', 'readonly'].includes(p.property)),
  );

  readonly validationRows = signal<displayDetails[]>(
    this.seed.filter((p) => ['minlength', 'maxlength','pattern'].includes(p.property)),
  );

  readonly browserHintsRows = signal<displayDetails[]>(
    this.seed.filter((p) => ['autocomplete','input mode'].includes(p.property)),
  );

  // bind function references (no arrow functions in template)
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
      { rootMargin: '-50% 0px -50% 0px' } // triggers when section is near center
    );

    sections.forEach((section) => observer.observe(section));
  }
}

