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
  selector: 'docs-slider-api',
  templateUrl: './slider-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class SliderApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngSlider } from '@tailng-ui/ui/form';`;

  private readonly seed: DisplayDetails[] = [
    { property: 'id', type: 'string', default: "''", description: 'Input element id' },
    { property: 'name', type: 'string', default: "''", description: 'Input name' },
    { property: 'ariaLabel', type: 'string', default: "'Slider'", description: 'Accessibility label for the range input' },
    { property: 'min', type: 'number', default: '0', description: 'Minimum value' },
    { property: 'max', type: 'number', default: '100', description: 'Maximum value' },
    { property: 'step', type: 'number', default: '1', description: 'Step increment' },
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { property: 'value', type: 'number | null', default: 'null', description: 'Controlled value (when set, overrides form value)' },
    { property: 'slot', type: 'TngSlotMap<TngSliderSlot>', default: '{}', description: 'Slot-based micro styling (container, trackWrapper, track, trackFill, thumb, input, valueText)' },
  ];

  readonly identityRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['id', 'name', 'ariaLabel'].includes(p.property)));
  readonly configRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['min', 'max', 'step'].includes(p.property)));
  readonly stateRows = signal<DisplayDetails[]>(this.seed.filter((p) => ['disabled', 'value'].includes(p.property)));
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
