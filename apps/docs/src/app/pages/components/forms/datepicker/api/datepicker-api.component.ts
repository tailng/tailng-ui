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
  selector: 'docs-datepicker-api',
  templateUrl: './datepicker-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class DatepickerApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = computed(() => `import { TngDatepicker } from '@tailng-ui/ui/form';`);

  private readonly seed: displayDetails[] = [
    { property: 'min', type: 'Date | null', default: 'null', description: 'Minimum selectable date' },
    { property: 'max', type: 'Date | null', default: 'null', description: 'Maximum selectable date' },
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { property: 'displayFormat', type: 'string', default: "'DD/MM/YYYY'", description: 'Input display format' },
    { property: 'previewFormat', type: 'string', default: "'DD MMM YYYY'", description: 'Preview in panel' },
    { property: 'locale', type: 'string | null', default: 'null', description: 'Optional locale for formatting' },
    { property: 'dateAdapter', type: 'TngDateAdapter | null', default: 'null', description: 'Custom date adapter' },
    { property: 'inputKlass', type: 'string', default: "''", description: 'Text input classes' },
    { property: 'toggleKlass', type: 'string', default: "''", description: 'Calendar toggle button' },
    { property: 'hostKlass', type: 'string', default: "''", description: 'Host wrapper' },
    { property: 'panelKlass', type: 'string', default: "''", description: 'Overlay panel' },
    { property: 'panelFrameKlass', type: 'string', default: "''", description: 'Panel frame (border, shadow)' },
    { property: 'dayCellKlass', type: 'string', default: "''", description: 'Calendar day cell' },
  ];

  readonly mainRows = signal<displayDetails[]>(this.seed.filter((p) =>
    ['min', 'max', 'disabled', 'displayFormat', 'previewFormat', 'locale', 'dateAdapter'].includes(p.property)
  ));
  readonly klassRows = signal<displayDetails[]>(this.seed.filter((p) =>
    ['inputKlass', 'toggleKlass', 'hostKlass', 'panelKlass', 'panelFrameKlass', 'dayCellKlass'].includes(p.property)
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
