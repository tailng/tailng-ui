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
  selector: 'docs-form-field-api',
  templateUrl: './form-field-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class FormFieldApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngFormField } from '@tailng-ui/ui/form';`;

  private readonly seed: DisplayDetails[] = [
    { property: 'label', type: 'string', default: "''", description: 'Label text above the control' },
    { property: 'hint', type: 'string', default: "''", description: 'Hint text below (hidden when error is shown)' },
    { property: 'error', type: 'string', default: "''", description: 'Manual error text (overrides NgControl errors)' },
    { property: 'invalid', type: 'boolean | null', default: 'null', description: 'Manual invalid state override' },
    { property: 'disabled', type: 'boolean | null', default: 'null', description: 'Manual disabled state override' },
    { property: 'required', type: 'boolean', default: 'false', description: 'Shows required asterisk' },
    { property: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Field size' },
    { property: 'appearance', type: "'outline' | 'filled'", default: "'outline'", description: 'Visual appearance' },
    { property: 'rootKlass', type: 'string', default: "'w-full'", description: 'Root wrapper classes' },
    { property: 'labelKlass', type: 'string', default: "'text-sm font-medium text-fg'", description: 'Label classes' },
    { property: 'requiredMarkKlass', type: 'string', default: "'text-danger'", description: 'Asterisk classes' },
    { property: 'hintKlass', type: 'string', default: "'text-xs text-disable'", description: 'Hint text classes' },
    { property: 'errorKlass', type: 'string', default: "'text-xs text-danger'", description: 'Error text classes' },
    { property: 'controlShellKlass', type: 'string', default: "''", description: 'Control wrapper classes' },
    { property: 'prefixKlass', type: 'string', default: "'text-disable'", description: 'Prefix slot classes' },
    { property: 'suffixKlass', type: 'string', default: "'text-disable'", description: 'Suffix slot classes' },
    { property: 'footerKlass', type: 'string', default: "'mt-1 flex...'", description: 'Hint/error footer classes' },
  ];

  readonly contentRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['label', 'hint', 'error', 'invalid', 'disabled', 'required'].includes(p.property)));
  readonly variantRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['size', 'appearance'].includes(p.property)));
  readonly klassRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['rootKlass', 'labelKlass', 'requiredMarkKlass', 'hintKlass', 'errorKlass', 'controlShellKlass', 'prefixKlass', 'suffixKlass', 'footerKlass'].includes(p.property)));

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
