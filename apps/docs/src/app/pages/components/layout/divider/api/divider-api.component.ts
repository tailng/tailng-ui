import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { TngCol, TngTable } from '@tailng-ui/ui/table';
import { TngCodeBlock } from '@tailng-ui/ui/utilities';
import { ShikiHighlighterService } from '../../../../../shared/shiki-highlighter.service';
import { TngShikiAdapter } from '../../../../../shared/tng-shiki.adapter';

type DisplayDetails = { property: string; type: string; default?: string; description: string };

@Component({
  standalone: true,
  selector: 'docs-divider-api',
  templateUrl: './divider-api.component.html',
  imports: [TngCodeBlock, TngTable, TngCol],
})
export class DividerApiComponent implements AfterViewInit {
  private shiki = inject(ShikiHighlighterService);
  readonly highlighter = new TngShikiAdapter(this.shiki);
  readonly importExample = () => `import { TngDivider } from '@tailng-ui/ui/layout';`;

  private readonly inputSeed: DisplayDetails[] = [
    { property: 'orientation', type: 'TngDividerOrientation', default: "'horizontal'", description: 'horizontal | vertical' },
    { property: 'label', type: 'string', default: "''", description: 'Optional label (horizontal only)' },
    { property: 'align', type: 'TngDividerAlign', default: "'center'", description: 'start | center | end' },
    { property: 'dashed', type: 'boolean', default: 'false', description: 'Dashed border' },
  ];
  private readonly slotSeed: DisplayDetails[] = [
    { property: 'slot', type: 'TngSlotMap<TngDividerSlot>', default: '{}', description: 'Slot-based styling: container, line, label, gap, thickness, verticalHeight' },
  ];

  readonly inputRows = signal<DisplayDetails[]>(this.inputSeed);
  readonly slotRows = signal<DisplayDetails[]>(this.slotSeed);
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
