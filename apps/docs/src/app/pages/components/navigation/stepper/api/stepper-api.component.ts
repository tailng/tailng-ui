import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tailng-ui/ui/table';
import { TngCodeBlock } from '@tailng-ui/ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = { property: string; type: string; default?: string; description: string };

@Component({
  standalone: true,
  selector: 'docs-stepper-api',
  templateUrl: './stepper-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class StepperApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () =>
    `import { TngStepper, TngStep, TngStepPanel } from '@tailng-ui/ui/navigation';`;

  private readonly stepperInputSeed: DisplayDetails[] = [
    { property: 'activeIndex', type: 'number | null', default: 'null', description: 'Controlled active step index' },
    { property: 'defaultIndex', type: 'number', default: '0', description: 'Initial index (uncontrolled)' },
    { property: 'linear', type: 'boolean', default: 'false', description: 'Require complete before next' },
    { property: 'orientation', type: 'TngStepperOrientation', default: "'horizontal'", description: 'horizontal | vertical' },
  ];
  private readonly stepperKlassSeed: DisplayDetails[] = [
    { property: 'rootKlass', type: 'string', default: "'w-full'", description: 'Root' },
    { property: 'headerKlass', type: 'string', default: "'flex gap-2'", description: 'Step headers (horizontal)' },
    { property: 'headerVerticalKlass', type: 'string', default: "'flex flex-col gap-2'", description: 'Step headers (vertical)' },
    { property: 'panelWrapKlass', type: 'string', default: "'pt-4'", description: 'Panel wrapper' },
  ];
  private readonly stepInputSeed: DisplayDetails[] = [
    { property: 'label', type: 'string', default: "''", description: 'Optional label' },
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disable step' },
    { property: 'complete', type: 'boolean', default: 'false', description: 'Mark complete (linear mode)' },
    { property: 'stepKlass', type: 'string', default: '...', description: 'Step button base' },
    { property: 'activeKlass', type: 'string', default: "'bg-primary text-on-primary'", description: 'Active state' },
    { property: 'inactiveKlass', type: 'string', default: '...', description: 'Inactive state' },
  ];

  readonly stepperInputRows = signal<DisplayDetails[]>(this.stepperInputSeed);
  readonly stepperKlassRows = signal<DisplayDetails[]>(this.stepperKlassSeed);
  readonly stepInputRows = signal<DisplayDetails[]>(this.stepInputSeed);
  readonly property = (r: DisplayDetails) => r.property;
  readonly type = (r: DisplayDetails) => r.type;
  readonly default = (r: DisplayDetails) => r.default ?? '—';
  readonly description = (r: DisplayDetails) => r.description;

  ngAfterViewInit() {
    const sections = document.querySelectorAll('section[id], div[id]');
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
