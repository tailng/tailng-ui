import { AfterViewInit, Component, computed, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tailng-ui/ui/table';
import { TngCodeBlock } from '@tailng-ui/ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type displayDetails = { property: string; type: string; default?: string; description: string };

@Component({
  standalone: true,
  selector: 'docs-slide-toggle-api',
  templateUrl: './slide-toggle-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class SlideToggleApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = computed(() => `import { TngSlideToggle } from '@tailng-ui/ui/form';`);
  private readonly seed: displayDetails[] = [
    { property: 'id', type: 'string', default: "''", description: 'Input id' },
    { property: 'name', type: 'string', default: "''", description: 'Input name' },
    { property: 'label', type: 'string', default: "''", description: 'Label text' },
    { property: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { property: 'required', type: 'boolean', default: 'false', description: 'Required (HTML)' },
    { property: 'checked', type: 'boolean | null', default: 'null', description: 'Controlled value (optional)' },
    { property: 'checkedChange', type: 'OutputEventEmitter<boolean>', default: '—', description: 'Emits when toggled' },
    { property: 'slot', type: 'TngSlotMap<TngSlideToggleSlot>', default: '{}', description: 'Slot-based micro styling (container, label, input, track, trackChecked, trackUnchecked, thumb, thumbChecked, thumbUnchecked)' },
  ];
  readonly identityRows = signal<displayDetails[]>(this.seed.filter((p) => ['id', 'name', 'label'].includes(p.property)));
  readonly stateRows = signal<displayDetails[]>(this.seed.filter((p) => ['disabled', 'required', 'checked'].includes(p.property)));
  readonly outputRows = signal<displayDetails[]>(this.seed.filter((p) => p.property === 'checkedChange'));
  readonly stylingRows = signal<displayDetails[]>(this.seed.filter((p) => p.property === 'slot'));
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
