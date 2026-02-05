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
  selector: 'docs-textarea-api',
  templateUrl: './textarea-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class TextareaApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = computed(() => `import { TngTextarea } from '@tailng-ui/ui/form';`);

  private readonly seed: displayDetails[] = [
    { property: 'placeholder', type: 'string', default: "''", description: 'Placeholder text' },
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { property: 'rows', type: 'number', default: '4', description: 'Number of visible rows' },
    { property: 'klass', type: 'string', default: "''", description: 'Additional CSS classes for the textarea' },
  ];

  readonly inputRows = signal<displayDetails[]>(this.seed);
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
